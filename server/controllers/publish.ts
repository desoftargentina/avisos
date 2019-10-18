import { Request, Response } from 'express';
import { map, mergeMap, tap, mapTo, merge } from 'rxjs/operators';
import { query } from '../sql';
import { Publish, PublishSeed, ListablePublication, toString, category_list, subcategory_list, Gps, priceHelper, durationHelper } from '../../api';
import { today, storage, cycle, msPerDay, loadData, saveData } from '../utils';
import { of, Observable, AsyncSubject } from 'rxjs';
import { existsSync, rename, unlink, writeFile } from 'fs';
import { join } from 'path';
import { sync as assertDir } from 'mkdirp';
import { validateLocation } from '../utils/pipes';

/* Interface */
interface SoftPublication {
  id: number;
  name: string;
  price: number;
  category: number;
  subcategory: number;
  date: Date;
  condition: boolean;
  gps: number;
  duration: number;
  points: number;
  currency: number;
  views: number;
  type: number;
  publisher: number;
}

interface Publication extends SoftPublication {
  publisherData: {
    id: number;
    firstname: string;
    lastname: string;
    level: number;
    status: number;
    gps: number;
    area_code?: number;
    cellphone?: number;
  };
}

/* Listable */
function listFrom() {
  return 'publication INNER JOIN user ON publication.publisher = user.id ';
}

function listSelect() {
  return (
    'publication.id as id, date, name, price, category, subcategory, ' +
    'currency, publication.status as status, duration, ' +
    `(user.firstname || ' ' || user.lastname) as publisher`
  );
}

function listClauses(req: Request) {
  const status = req.query['status'];
  const hasStatus = status !== undefined && status !== 0xf;
  let query_str = '';
  if (hasStatus) {
    let clauses = '';
    if (status & 0x1) clauses += ` OR (publication.status & ~0x60 = 0x00)`;
    if (status & 0x2) clauses += ` OR (publication.status & ~0x60 = 0x20)`;
    if (status & 0x4) clauses += ` OR (publication.status & ~0x60 = 0x40)`;
    if (status & 0x8) clauses += ` OR (publication.status & ~0x60 = 0x60)`;
    clauses = clauses.substr(4);
    query_str = query_str.concat(`WHERE (${clauses}) AND user.loc ${Gps.query(+req.params.gps)}`);
  } else query_str += `WHERE user.loc ${Gps.query(+req.params.gps)}`;

  return query_str;
}

function listConstraints(page: number, size: number, column: string, direction: string) {
  const offset = page * size;
  return `LIMIT ${size} OFFSET ${offset} `; // ORDER BY ${column} ${direction}
}

function listPublications(query: Observable<any>, res: Response) {
  query.subscribe(
    resultSet => {
      if (resultSet.length < 1) return res.send();
      const publications: ListablePublication[] = [];
      for (const result of resultSet)
        publications.push({
          id: result.id,
          category: category_list[result.category],
          subcategory: subcategory_list[result.subcategory],
          date: result.date,
          name: result.name,
          duration: durationHelper(result.duration),
          price: priceHelper(result.price, result.currency),
          publisher: result.publisher,
          state: toString(result.status & (~0x60 >> 5))
        });
      res.send(publications);
    },
    err => res.status(500).send(err)
  );
}

/* Utils */
function assertOwner(publishID: number, userID: string) {
  return query('SELECT publisher FROM publication WHERE id = ?', publishID)
    .pipe(
      tap(res => { if (res.length < 1 || res[0].publisher !== userID)
        throw { status: 403, obj: `You're not the owner of this publication` }; }),
      map(_ => { return; })
    );
}

function saveImages(publishID: number, userID: string, images: string[]): Observable<number> {
  const tempPath = `./${process.env.STORAGE}/tmp/img`;
  const localPath = `./${process.env.STORAGE}/${userID}/${publishID}/img`;

  const event = new AsyncSubject<number>();
  event.next(publishID);

  if (!existsSync(localPath)) assertDir(localPath);

  images.forEach(image => rename(`${tempPath}/${image}`, `${localPath}/${image}`, err => {
    if (err) event.error(err);
    images.pop();
    if (!images.length) event.complete();
  }));

  return event;
}

function unlinkImages(publishID: number, userID: string, images: string[]): Observable<number> {
  const path = `./${process.env.STORAGE}/${userID}/${publishID}/img`;
  const event = new AsyncSubject<number>();
  event.next(publishID);

  // Unlink img
  images.forEach(image => unlink(`${path}/${image}`, err => {
    if (err) event.error(err);
    images.pop();
    if (!images.length) event.complete();
  }));

  return event;
}

function registerVisit(publishID: number, userID: number, visitorID: number) {
  const path = `./${storage}/${userID}/${publishID}/data`;
  return loadData(path)
    .pipe(
      mergeMap(data => {
        if (!data.visits) data.visits = {};
        if (!data.views) data.views = [];

        const registerView = !data.views.includes(visitorID);
        const addVisit = (data: { visits: { [cycle: number]: number[] }; clean: boolean }) => {
          data.visits[cycle].push(visitorID);
          data.clean = false;
          return query('UPDATE publication set points = points + 4 WHERE id = ?', publishID).pipe(
            mapTo({ data, registerView })
          );
        };

        if (data.visits[cycle]) {
          if (!data.visits[cycle].includes(visitorID)) return addVisit(data);
          // tslint:disable-next-line: deprecation
          else return of({ data, registerView });
        } else {
          data.visits[cycle] = [];
          return addVisit(data);
        }
      }),
      mergeMap(info => {
        if (info.registerView)
          return query('UPDATE publication SET views = views + 1 WHERE id = ?', publishID).pipe(
            tap(() => info.data.views.push(visitorID)),
            map(() => info.data)
          );
        // tslint:disable-next-line: deprecation
        else return of(info.data);
      })
    )
    .subscribe(data => saveData(path, data));
}

class PublishController {
  save(req: Request, res: Response) {
    if (!req.body) return res.status(400).send('No publication info provided');
    const seed: PublishSeed = req.body;
    let event: Observable<number>;

    if (seed.id)
      event = assertOwner(seed.id, req.params.userID).pipe(
        mergeMap(() => query('UPDATE publication ' +
          'SET ' +
          'name = ?, price = ?, ' +
          'category = ?, subcategory = ?, ' +
          '`condition` = ?, gps = ?, ' +
          'duration = ?, currency = ?' +
          'WHERE id = ? Limit 1',
          [
            seed.name, seed.price,
            seed.category, seed.subcategory,
            seed.condition, seed.gps,
            seed.duration, seed.currency,
            seed.id, req.params.userID
          ])),
        mergeMap(_ => query('SELECT serial FROM publication_image WHERE publication = ?')),
        map(resultSet => resultSet as { serial: string }[]),
        map(resultSet => resultSet.map(({ serial }) => serial)),
        map(serials => ({
          added: seed.images.filter(serial => !serials.includes(serial)),
          removed: serials.filter(serial => !seed.images.includes(serial))
        })),
        mergeMap(({ added, removed }) => {
          return merge(
            query(
              'INSERT INTO publication_image(serial, publication) VALUES ?',
              added.map(serial => [serial, seed.id])
            ).pipe(mergeMap(_ => saveImages(seed.id, req.params.userID, added))),
            query(
              'DELETE FROM publication_image WHERE (serial, publication) IN ?',
              removed.map(serial => [serial, seed.id])
            ).pipe(mergeMap(_ => unlinkImages(seed.id, req.params.userID, removed)))
          );
        }),
        map(_ => seed.id)
      );
    else
      event = query(
        'INSERT INTO publication' +
        '(name, price, category, subcategory, `condition`, gps, duration, currency, publisher) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [seed.name, seed.price, seed.category, seed.subcategory, seed.condition, seed.gps, seed.duration, seed.currency, req.params.userID]
      ).pipe(
        map(_ => _.insertId as number),
        mergeMap(id => query('INSERT INTO publication_image(serial, publication) VALUES (?)',
          seed.images.map(serial => [serial, id])).pipe(map(_ => id))),
        mergeMap(id => saveImages(id, req.params.userID, seed.images))
      );
    event
      .pipe(
        map(id => ({ id, path: `./${process.env.STORAGE}/${req.params.userID}/${req.params.id}` })),
        tap(({ path }) => { if (!existsSync(path)) assertDir(path); }),
        mergeMap(({ id, path }) => {
          const event = new AsyncSubject<number>();
          event.next(id);
          writeFile(`${path}/description`, seed.description, 'utf-8', err => {
            if (err) event.error(err);
            event.complete();
          });
          return event;
        })
      )
      .subscribe(
        id => {
          req.params.id = '' + id;
          this.details(req, res);
        },
        err => {
          (err.status ? res.status(err.status).send(err.obj) : res.status(500).send(err));
          console.error(err);
        }
      );
  }

  details(req: Request, res: Response) {
    query('SELECT * FROM publication WHERE id = ?', [req.params.id])
      .pipe(
        map(resultSet => resultSet[0] as SoftPublication),
        mergeMap(soft => {
          let _query = 'SELECT id, firstname, lastname, level, status, gps, loc';
          if (req.params.userID) _query += ', area_code, cellphone';
          _query += ' FROM user WHERE id = ?';
          return query(_query, soft.publisher).pipe(map(result => ({soft, result})));
        }),
        map(({soft, result}) => ({soft, user: result[0]})),
        tap(({user}) => validateLocation(+req.params.gps, user.loc)),
        map(({soft, user}) => {
            const publish: any = soft;
            publish.publisherData = user;
            return publish as Publication;
        }),
        mergeMap(publication => query('SELECT serial FROM publication_image WHERE publication = ?', publication.id)
          .pipe(
            map(result => (result as {serial: string}[]).map(data => data.serial as string)),
            map(images => ({publication, images}))
          )
        ),
        tap(({ publication }) => {
          if (req.params.userID) registerVisit(publication.id, publication.publisherData.id, +req.params.userID);
        })
      )
      .subscribe(
        ({publication, images}) => {
          const elapsedDays = (today.getTime() - publication.date.getTime()) / msPerDay;
          const leftDays = publication.duration - elapsedDays;
          const pub: Publish = {
            id: publication.id,
            name: publication.name,
            price: publication.price,
            category: publication.category,
            subcategory: publication.subcategory,
            isNew: publication.condition,
            isFresh: elapsedDays < 4,
            isEnding: leftDays < 4,
            isTrending: (publication.type & 0x6) !== 0,
            daysLeft: Math.round(leftDays),
            gps: publication.gps,
            currency: publication.currency,
            views: publication.views,
            images,
            publisher: {
              id: publication.publisher,
              name: [publication.publisherData.firstname, publication.publisherData.lastname].join(' '),
              isPremium: publication.publisherData.level > 1,
              isTrusted: (publication.publisherData.status & 0x4) !== 0,
              area_code: publication.publisherData.area_code,
              cellphone: publication.publisherData.cellphone,
              gps: publication.publisherData.gps,
              publications: 0
            }
          };
          res.send(pub);
        },
        err => {
          (err.status ? res.status(err.status).send(err.obj) : res.status(500).send(err));
          console.error(err);
        }
      );
  }

  description(req: Request, res: Response) {
    query('SELECT publisher FROM publication WHERE id = ?', [req.params.id])
      .pipe(
        map(resultSet => resultSet[0].publisher),
        mergeMap(publisher =>
          query('SELECT gps FROM user WHERE id = ?', publisher)
            .pipe(map(result => ({ publisher, result })))
        ),
        map(({publisher, result}) => ({publisher, gps: result[0].gps as number})),
        tap(({ gps }) => validateLocation(+req.params.gps, gps)),
        map(({ publisher }) => publisher)
      ).subscribe(
        publisher => res.set('Content-Type', 'text/html').sendFile(join(__dirname, '../../../server/', `./${process.env.STORAGE}/${publisher}/${req.params.id}/description`)),
        err => {
          (err.status ? res.status(err.status).send(err.obj) : res.status(500).send(err));
          console.error(err);
        }
      );
  }

  approve(req: Request, res: Response) {
    if (!req.params.id) return res.status(400).send('No publication id provided');
    query(
      'UPDATE publication SET status = (status & ~0x60) | 0x20 WHERE id = ? AND status & 0x60 = 0x00',
      req.params.id
    ).subscribe(
      resultSet => {
        if (resultSet.length < 1) return res.status(404).send();
        res.send();
      },
      err => res.status(500).send(err)
    );
  }

  pause(req: Request, res: Response) {
    if (!req.params.id) return res.status(400).send('No publication id provided');
    query(
      'UPDATE publication SET status = (status & ~0x60) | 0x40 WHERE id = ? AND publisher = ? AND status & 0x60 = 0x20',
      [req.params.id, req.params.userID]
    ).subscribe(
      resultSet => {
        if (resultSet.length < 1) return res.status(404).send();
        res.send();
      },
      err => res.status(500).send(err)
    );
  }

  resume(req: Request, res: Response) {
    if (!req.params.id) return res.status(400).send('No publication id provided');
    query(
      'UPDATE publication SET status = (status & ~0x60) | 0x20 WHERE id = ? AND publisher = ? AND status & 0x60 = 0x40',
      [req.params.id, req.params.userID]
    ).subscribe(
      resultSet => {
        if (resultSet.length < 1) return res.status(404).send();
        res.send();
      },
      err => res.status(500).send(err)
    );
  }

  list(req: Request, res: Response) {
    const size = req.params.size,
      page = req.params.page,
      direction = req.params.direction;
    const query_str = `SELECT ${listSelect()} FROM ${listFrom()} ${listClauses(req)} ${listConstraints(
      +page,
      +size,
      'date',
      direction
    )}`;
    listPublications(query(query_str + ' AND user.id = ?', [req.params.userID]), res);
  }

  countList(req: Request, res: Response) {
    const query_str = `SELECT count(*) as count FROM ${listFrom()} ${listClauses(req)}`;
    query(query_str + ' AND user.id = ?', [req.params.userID]).subscribe(
      resultSet => {
        if (resultSet.length < 1) return res.status(400).send('Dafak? How dare you!');
        return res.send({ count: resultSet[0].count });
      },
      err => res.status(500).send(err)
    );
  }

  listAll(req: Request, res: Response) {
    const size = req.params.size,
      page = req.params.page,
      direction = req.params.direction;
    const query_str = `SELECT ${listSelect()} FROM ${listFrom()} ${listClauses(req)} ${listConstraints(
      +page,
      +size,
      'date',
      direction
    )}`;
    listPublications(query(query_str), res);
  }

  countListAll(req: Request, res: Response) {
    const query_str = `SELECT count(*) as count FROM ${listFrom()} ${listClauses(req)}`;
    query(query_str).subscribe(
      resultSet => {
        if (resultSet.length < 1) return res.status(400).send(`Let's assume you never get this message`);
        return res.send({ count: resultSet[0].count });
      },
      err => res.status(500).send(err)
    );
  }
}
export const publishController = new PublishController();
