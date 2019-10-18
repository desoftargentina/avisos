import { verify, VerifyErrors, sign } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { query } from '../sql';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { compare } from 'bcrypt';

export function generateAccessToken(id: number): string {
  return sign({ id }, process.env.SECRET_KEY || '', { expiresIn: '15 minutes' });
}

export function generateRefreshToken(key: string, mode: 'local' | 'google' | 'facebook'): string {
  return sign({ key, mode }, process.env.SECRET_KEY || '', { expiresIn: '90 days' });
}

export function requirePassword(req: Request, res: Response, next: NextFunction) {
  const password = req.headers['pwd'];
  if (password)
    query('SELECT secret FROM user WHERE id = ?', req.params.userID)
      .pipe(
        map(data => data as any[]),
        map(data => {
          if (data.length > 0) return data[0].secret as string;
          throwError({});
        })
      )
      .subscribe(
        secret =>
          compare(req.body, secret, (err, approved) => {
            if (err) res.status(500).send(err);
            else if (!approved) res.status(403).send('Wrong password!');
            else next();
          }),
        err => res.status(403).send(err)
      );
  else res.status(400).send('No password supplied');
}

let logged = false;
export function requireAccessToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-access-token'] as string;
  if (!token && !logged) {
    console.log(req);
    logged = true;
  }
  if (!token) return res.status(403).send('No access token found');
  verify(token, process.env.SECRET_KEY || '', (err: VerifyErrors, decoded: any) => {
    if (err)
      if (err.name && err.name === 'TokenExpiredError') return res.status(406).send();
      else return res.status(500).send(err);
    req.params.userID = decoded.id;
    next();
  });
}

export function checkAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.params || !req.params.userID) return res.status(400).send('Missing access info');
  query('SELECT level FROM user WHERE id = ?', req.params.userID).subscribe(resultSet => {
    if (resultSet.length < 1 || resultSet[0].level !== 0)
      return res.status(403).send('You must be an administrator');
    next();
  });
}

export function requireRefreshToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-access-token'] as string;
  if (!token) return res.status(403).send('No token found');
  verify(token, process.env.SECRET_KEY || '', (err: VerifyErrors, decoded: any) => {
    if (err)
      if (err.name && err.name === 'TokenExpiredError') return res.status(406).send();
      else return res.status(500).send(err);
    req.params.key = decoded.key;
    req.params.mode = decoded.mode;
    next();
  });
}

export function acceptAccessToken(req: Request, _: Response, next: NextFunction) {
  const token = req.headers['x-access-token'] as string;
  if (token)
    verify(token, process.env.SECRET_KEY || '', (err: VerifyErrors, decoded: any) => {
      if (!err) req.params.userID = decoded.id;
      next();
    });
  else next();
}
