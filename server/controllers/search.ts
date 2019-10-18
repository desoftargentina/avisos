import { Request, Response } from 'express';
import { Subscription, Observable, from } from 'rxjs';
import { query } from '../sql';
import { map, catchError } from 'rxjs/operators';
import { Tag, tagType, tag_list, tag_order, Preview, Gps } from '../../api';
import { today, msPerDay } from '../utils';

interface Data {
  query: string;
  loaded: Preview[];
  subscription: Subscription;
  index: number;
  asyncMeta: Observable<any>;
  meta?: any;
}

const isNew = 'publication.`condition` = 1';
const isTrending = 'publication.status & 0x6';
const isEnding = 'publication.date < current_timestamp - INTERVAL (publication.duration - 3) DAY';
const isFresh = 'publication.date > current_timestamp - INTERVAL 3 DAY';

class SearchController {
  private nextID = 1;
  private idMap = new Map<number, Data>();

  constructor() {
    this.id = this.id.bind(this);
    this.next = this.next.bind(this);
    this.remove = this.remove.bind(this);
  }

  public id(req: Request, res: Response) {
    const data: Data = {
      query: '',
      loaded: [],
      subscription: new Subscription(),
      index: 0,
      asyncMeta: null
    };

    const params: { [key: string]: string } = {};
    for (const key of ['query', 'category', 'from', 'to', 'condition', 'subcategory', 'tag', 'gps'])
      params[key] = req.query[key];
    if (req.params.gps) params['loc'] = req.params.gps;
    data.query = this.prepareQuery(params);

    data.asyncMeta = this.analize(data.query, params);
    data.asyncMeta.subscribe(meta => (data.meta = meta), err => console.log('Error analyzing query\n', err));

    this.computeSub(data, 2);
    this.idMap.set(this.nextID, data);
    res.send('' + this.nextID);
    this.nextID++;
  }

  public fetchMeta(req: Request, res: Response) {
    const data = this.idMap.get(+req.params.id);
    if (typeof data !== 'undefined')
      if (data.meta) res.send(data.meta);
      else data.asyncMeta.subscribe(((meta: any) => res.send(meta)).bind(this));
    else res.status(404).send();
  }

  public async next(req: Request, res: Response) {
    const data = this.idMap.get(+req.params.id);
    if (typeof data !== 'undefined') {
      const realAmount = 10 * +req.params.amount;
      if (data.loaded.length >= realAmount) this.computeSub(data, +req.params.amount);
      else data.loaded.concat(await this.prepare(data, +req.params.amount).toPromise());

      res.send(data.loaded.slice(0, realAmount));
      data.loaded = data.loaded.slice(realAmount);
      return;
    }
    res.status(404);
  }

  public remove(req: Request, res: Response) {
    const data = this.idMap.get(+req.params.id);
    if (data) {
      res.send();
      data.subscription.unsubscribe();
      this.idMap.delete(+req.params.id);
      return;
    }
    res.status(404);
    res.send();
  }

  private computeSub(data: Data, amount: number = 1) {
    data.subscription.add(
      this.prepare(data, amount).subscribe(val => {
        data.loaded = data.loaded.concat(val);
        data.index += val.length;
      })
    );
  }

  private prepare(data: Data, amount: number = 1): Observable<Preview[]> {
    return this.fetch(data.query, 10 * amount, data.index);
  }

  private prepareQuery(params: { [key: string]: string }): string {
    let query = ' WHERE (publication.status & 0x60) = 0x20';
    let cond = false;

    for (const key of Object.keys(params)) {
      if (!params[key]) continue;
      query = query.concat(' AND ');
      switch (key) {
        case 'query':
          query = query.concat('publication.name LIKE \'%' + params[key].split('').join('%') + '%\'');
          break;
        case 'category':
          query = query.concat('publication.category = ' + params[key]);
          break;
        case 'subcategory':
          query = query.concat('publication.subcategory = ' + params[key]);
          break;
        case 'condition':
          if (cond) continue;
          query = query.concat('publication.`condition` = ' + params[key]);
          cond = true;
          break;
        case 'from':
          query = query.concat('publication.price >= ' + params[key]);
          break;
        case 'to':
          query = query.concat('publication.price <= ' + params[key]);
          break;
        case 'tag':
          const tagFlag = +params[key];
          const tags: Tag[] = [];
          for (const type in tagType) if (isNaN(Number(tagType[type])) && tagFlag & +type) tags.push(tag_list[type]);
          for (const tag of tags)
            switch (tag.type) {
              case tagType.New:
                if (cond) continue;
                query = query.concat(isNew);
                cond = true;
                break;
              case tagType.Trending:
                query = query.concat(isTrending);
                break;
              case tagType.Ending:
                query = query.concat(isEnding);
                break;
              case tagType.Fresh:
                query = query.concat(isFresh);
                break;
              case tagType.Trusted:
                query = query.concat('(select status from user where user.id = publication.publisher) & 0x4');
                break;
              case tagType.Premium:
                query = query.concat('(select level from user where user.id = publication.publisher) > 1');
                break;
            }
          break;
        case 'gps':
          query = query.concat(`publication.gps ${Gps.query(+params[key])}`);
          break;
        case 'loc':
          query = query.concat(`user.loc ${Gps.query(+params[key])}`);
          break;
      }
    }

    return query;
  }

  private fetch(_query: string, amount: number, offset: number): Observable<Preview[]> {
    _query =
      'SELECT ' +
      'publication.id as id, ' +
      'publication.publisher as publisher, ' +
      'publication.name as name, ' +
      'publication.price as price, ' +
      'publication.currency as currency, ' +
      'publication.`condition` as `condition`, ' +
      'publication.duration as duration, ' +
      'publication.gps as gps, ' +
      'publication.views as views, ' +
      'publication.date as date, ' +
      'publication.status as pStatus, ' +
      'user.level as level, ' +
      'concat(user.firstname, " ", user.lastname) as userName, ' +
      'user.status as status ' +
      'FROM publication ' +
      'INNER JOIN user ON user.id = publication.publisher' +
      _query +
      ' ORDER BY points desc LIMIT ?, ?';
    return query(_query, [offset, amount]).pipe(
      map(resultSet => {
        const res: Preview[] = [];
        for (const result of resultSet) {
          res.push({
            id: result.id,
            user: result.publisher,
            name: result.name,
            price: result.price,
            currency: result.currency,
            condition: result.condition,
            gps: result.gps,
            views: result.views,
            tags: this.getTags(
              result.condition,
              result.date,
              result.duration,
              result.pStatus,
              result.level,
              result.status
            ),
            userName: result.userName
          });
        }
        return res;
      })
    );
  }

  private getTags(condition: boolean, date: Date, duration: number, pStatus: number, level: number, status: number) {
    const tags: tagType[] = [];
    const elapsedDays = (today.getTime() - date.getTime()) / msPerDay;
    const leftDays = duration - elapsedDays;
    for (const tag of tag_order)
      if (tags.length > 1) break;
      else {
        const tag_t = +tag as tagType;
        let valid = false;
        switch (tag_t) {
          case tagType.Ending:
            valid = leftDays < 4;
            break;
          case tagType.Fresh:
            valid = elapsedDays < 4;
            break;
          case tagType.New:
            valid = condition;
            break;
          case tagType.Trending:
            valid = (pStatus & 0x6) !== 0;
            break;
          case tagType.Trusted:
            valid = (status & 0x4) !== 0;
            break;
          case tagType.Premium:
            valid = level > 1;
            break;
        }
        if (valid) tags.push(tag_t);
      }
    return tags;
  }

  private analize(_query: string, params: { [key: string]: string }) {
    // Return min, max, categories, subcategories, countries, states, cities and tags
    let token = 'SELECT min(price) as min, max(price) as max';
    if (!params['subcategory'])
      if (params['category'])
        token = token.concat(', group_concat(distinct publication.subcategory) as subcategories');
      else token = token.concat(', group_concat(distinct publication.category) as categories');
    const gpsToken = Gps.token('publication.gps', params['gps'] ? +params['gps'] : undefined);
    if (gpsToken) token = token.concat(`, ${gpsToken}`);
    token = token.concat(' FROM publication');
    token = token.concat(' inner join user on user.id = publication.publisher').concat(_query);
    const clause = Object.keys(params).length > 0 ? ' WHERE' : `${_query} AND`;
    const isTrusted = 'user.status & 0x4';
    const isPremium = 'user.level > 1';
    let tags = 'select ';
    tags += 'new_q is not null as new, ';
    tags += 'trend_q is not null as trending, ';
    tags += 'end_q is not null as ending, ';
    tags += 'fresh_q is not null as fresh, ';
    tags += 'trust_q is not null as trusted, ';
    tags += 'vip_q is not null as premium ';
    tags += `from (select 1 as new_q from publication ${clause} ${isNew} limit 1) as new_t `;
    tags += `inner join (select 1 as trend_q from publication ${clause} ${isTrending} limit 1) as trend_t `;
    tags += `inner join (select 1 as end_q from publication ${clause} ${isEnding} limit 1) as end_t `;
    tags += `inner join (select 1 as fresh_q from publication ${clause} ${isFresh} limit 1) as fresh_t `;
    tags += `inner join (select 1 as trust_q from`;
    tags += ` publication inner join user on user.id = publication.publisher`;
    tags += ` ${clause} ${isTrusted} limit 1) as trust_t `;
    tags += `inner join (select 1 as vip_q from`;
    tags += ` publication inner join user on user.id = publication.publisher`;
    tags += ` ${clause} ${isPremium} limit 1) as vip_t `;

    token = `select * from (${token}) as data inner join (${tags}) as tags;`;

    const pushTags: (_: any) => any = result => {
      result.tags = [];
      if (result.new) result.tags.push(tagType.New);
      if (result.trending) result.tags.push(tagType.Trending);
      if (result.ending) result.tags.push(tagType.Ending);
      if (result.fresh) result.tags.push(tagType.Fresh);
      if (result.trusted) result.tags.push(tagType.Trusted);
      if (result.premium) result.tags.push(tagType.Premium);
      result.new = undefined;
      result.trending = undefined;
      result.ending = undefined;
      result.fresh = undefined;
      result.trusted = undefined;
      result.premium = undefined;
      return result;
    };

    return query(token).pipe(
      catchError(err => {
        console.log('Error during analysis\n', JSON.stringify(err));
        return from(null);
      }),
      map(resultSet => {
        return resultSet.length > 0 ? pushTags(resultSet[0]) : {};
      })
    );
  }
}
export const searchController = new SearchController();
