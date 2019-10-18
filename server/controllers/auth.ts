import { Response, Request } from 'express';
import { generateAccessToken, generateRefreshToken } from '../utils/validator';
import axios from 'axios';
import { query } from '../sql';
import { hash, compare } from 'bcrypt';
import { mergeMap, map, catchError, delayWhen, tap } from 'rxjs/operators';
import { of, defer, Observable, throwError, timer, from } from 'rxjs';
import { validateLocation } from '../utils/pipes';

const saltRounds = 13;

enum AuthType {
  Facebook,
  Google,
  Local
}

function createUser(
  firstname: string,
  lastname: string,
  email: string,
  token: string,
  method: AuthType,
  loc: string
): Observable<void> {
  const params: { [token: string]: string } = { firstname, lastname, email: email.toLowerCase(), loc };
  switch (method) {
    case AuthType.Facebook:
      params.facebook_id = token;
      break;
    case AuthType.Google:
      params.google_id = token;
      break;
    case AuthType.Local:
      params.secret = token;
      break;
  }

  const parsedParams = createParams(params);

  return query(`INSERT INTO user(${parsedParams.head}) VALUES(${parsedParams.tail})`, parsedParams.values).pipe(
    map(() => { }),
    catchError(err => {
      if (err.errno === 1062)
        return query('SELECT id, secret, google_id, facebook_id FROM user WHERE email = ?', params.email).pipe(
          map(resultSet => resultSet[0]),
          map(data => data as { id: number; secret?: string; google_id?: string; facebook_id?: string }),
          mergeMap(data => {
            let _params: {} = null;
            if (method === AuthType.Local && !data.secret) _params = { secret: token };
            else if (method === AuthType.Google && !data.google_id) _params = { google_id: token };
            else if (method === AuthType.Facebook && !data.facebook_id) _params = { facebook_id: token };
            if (_params) {
              const sqlParams = createParams(_params);
              const values = parsedParams.values;
              values.push(data.id);
              return query('UPDATE user SET ' + sqlParams.pairs + ' WHERE id = ?', values).pipe(
                map(() => { }),
                catchError(err => throwError({ status: 500, obj: err }))
              );
            } else return throwError({ status: 500, obj: 'Unknown auth method' });
          })
        );
      else return throwError({ status: 500, obj: err });
    })
  );
}

function createParams(params: { [key: string]: any }) {
  const values: any[] = [];
  let head = '',
    tail = '',
    pairs = '',
    first = true;
  for (const token of Object.keys(params)) {
    pairs += first ? token.concat(' = ?') : ', '.concat(token).concat(' = ?');
    head += first ? token : ', '.concat(token);
    tail += first ? '?' : ', ?';
    values.push(params[token]);
    first = false;
  }
  return { head, tail, values, pairs };
}

class AuthController {
  signin(req: Request, res: Response) {
    if (req.body.pass)
      query('SELECT loc, secret FROM user WHERE email = ?', req.params.email)
        .pipe(
          delayWhen(data => (data.length > 0 ? timer(0) : timer(1000))),
          map(data => data[0]),
          tap(data => validateLocation(+req.params.gps, data.loc))
        ).subscribe(
          data => compare(req.body.pass, data.secret, (err, approved) => {
            if (err) res.status(500).send(err);
            else if (!approved) res.status(404).send();
            else res.send({ token: generateRefreshToken(data.secret, 'local') });
          }),
          err => {
            (err.status ? res.status(err.status).send(err.obj) : res.status(500).send(err));
            console.error(err);
          }
        );
    else res.status(400).send('No password provided');
  }

  signup(req: Request, res: Response) {
    if (req.body && req.body.firstname && req.body.lastname && req.body.email && req.body.pass)
      hash(req.body.pass, saltRounds, (err, secret) => {
        if (err) return res.status(500).send(err);
        createUser(
          req.body.firstname,
          req.body.lastname,
          req.body.email,
          secret,
          AuthType.Local,
          req.params.gps
        ).subscribe(
          () => res.send({ token: generateRefreshToken(secret, 'local') }),
          err => {
            (err.status ? res.status(err.status).send(err.obj) : res.status(500).send(err));
            console.error(err);
          }
        );
      });
    else res.status(400).send('Signup leaking params');
  }

  update(req: Request, res: Response) {
    if (req.body) {
      const params: { [token: string]: any } = {};
      if (req.body.gps) params.gps = req.body.gps;
      if (req.body.genre) params.genre = req.body.genre ? 'M' : 'F';
      if (req.body.area_code) params.area_code = req.body.area_code;
      if (req.body.cellphone) params.cellphone = req.body.cellphone;

      const values: any[] = [];
      let qStr = '';
      for (const token of Object.keys(params)) {
        qStr += token.concat(' = ?, ');
        values.push(params[token]);
      }

      values.push(req.params.id);
      qStr = qStr.substr(0, qStr.length - 2);

      query(`UPDATE user SET ${qStr} WHERE id = ?`, values).subscribe(
        _ => res.send(),
        err => res.status(500).send(err)
      );
    } else res.status(400).send('No user info provided');
  }

  changeSecret(req: Request, res: Response) {
    if (req.body)
      query('UPDATE user SET secret = ? WHERE id = ?', [req.body, req.params.id]).subscribe(() => res.send());
    else res.status(400).send('No password provided');
  }

  delete(req: Request, res: Response) {
    query('DELETE FROM user WHERE id = ?', req.params.id).subscribe(
      () => res.send(),
      err => res.status(500).send(err)
    );
  }

  token(req: Request, res: Response) {
    if (req.params.mode) {
      let field: string;
      switch (req.params.mode) {
        case 'local':
          field = 'secret';
          break;
        case 'google':
          field = 'google_id';
          break;
        case 'facebook':
          field = 'facebook_id';
          break;
      }

      query(`SELECT id, loc FROM user WHERE ${field} = ?`, req.params.key).subscribe(
        resultSet => {
          if (resultSet.length < 1) res.status(404).send();
          else {
            validateLocation(+req.params.gps, resultSet[0].loc);
            res.send({ token: generateAccessToken(resultSet[0].id) });
          }
        },
        err => {
          (err.status ? res.status(err.status).send(err.obj) : res.status(500).send(err));
          console.error(err);
        }
      );
    } else res.status(403).send('You need a refresh token to gatter an access token');
  }

  async google(req: Request, res: Response) {
    const access_token = req.params.token;
    const validation: any = await axios.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
      params: { access_token }
    });
    if (validation.error || validation.data.issued_to !== process.env.GOOGLE_CLIENT_ID)
      return res.status(401).send('Invalid or expired google token');
    query('SELECT loc FROM user WHERE google_id = ? LIMIT 1', validation.data.user_id)
      .pipe(
        tap(resultSet => { if (!resultSet.length) throw { status: 404, obj: 'User not found' }; }),
        tap(resultSet => validateLocation(+req.params.gps, resultSet[0].loc)),
        catchError(err => {
          if (err.status === 404)
            return defer(async () => axios.get(
              `https://people.googleapis.com/v1/people/me`,
              { params: { personFields: 'emailAddresses,names', access_token } }
            )).pipe(
              mergeMap(data => {
                const name = data.data.names[0];
                const email = data.data.emailAddresses[0].value;
                return createUser(
                  name.givenName,
                  name.familyName,
                  email,
                  validation.data.user_id,
                  AuthType.Google,
                  req.params.gps
                );
              })
            );
          else throw err;
        })
      ).subscribe(
        () => res.send({ token: generateRefreshToken(validation.data.user_id, 'google') }),
        err => {
          (err.status ? res.status(err.status).send(err.obj) : res.status(500).send(err));
          console.error(err);
        }
      );
  }

  async facebook(req: Request, res: Response) {
    const input_token = req.params.token;
    const validation: any = (await axios.get('https://graph.facebook.com/debug_token', {
      params: { input_token, access_token: process.env.FACEBOOK_ACCESS_TOKEN }
    })).data.data;
    if (!validation.is_valid) return res.status(401).send('Invalid facebook token');
    query('SELECT loc FROM user WHERE facebook_id = ? LIMIT 1', validation.user_id)
      .pipe(
        tap(resultSet => { if (!resultSet.length) throw { status: 404, obj: 'User not found' }; }),
        tap(resultSet => validateLocation(+req.params.gps, resultSet[0].loc)),
        catchError(err => {
          if (err.status === 404)
            return defer(async () => axios.get(
              `https://graph.facebook.com/${validation.user_id}`,
              { params: { fields: 'name,last_name,email', access_token: input_token } }
            )).pipe(
              map(data => data.data),
              mergeMap(data => {
                const name = data.name as string;
                const lastname = data.last_name as string;
                const email = data.email as string;
                const firstname = name.substr(0, name.length - lastname.length - 1);
                return createUser(
                  firstname,
                  lastname,
                  email,
                  validation.user_id,
                  AuthType.Facebook,
                  req.params.gps
                );
              })
            );
          else throw err;
        }),
      ).subscribe(
        () => res.send({ token: generateRefreshToken(validation.user_id, 'facebook') }),
        err => {
          (err.status ? res.status(err.status).send(err.obj) : res.status(500).send(err));
          console.error(err);
        }
      );
  }
}
export const authController = new AuthController();
