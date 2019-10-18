import { Request, Response, NextFunction } from 'express';
import { profiles, Gps } from '../../api';
import { query } from '../sql';

export function queryLocation(req: Request, _: Response, next: NextFunction) {
  const parts = req.hostname.split('.');
  let gps = 0;
  if (parts.length > 2) {
    const subdomain = parts[0].toLowerCase();
    if (subdomain !== 'www' && profiles[subdomain]) gps = profiles[subdomain].gps;
  }
  if (req.params.gps) gps = Gps.merge(gps, +req.params.gps);
  req.params.gps = '' + gps;
  next();
}

export function assertLocation(req: Request, res: Response, next: NextFunction) {
  if (!req.params.userID) return res.status(406).send();
  const parts = req.hostname.split('.');
  let gps = 0;
  if (parts.length > 2) {
    const subdomain = parts[0].toLowerCase();
    if (subdomain !== 'www' && profiles[subdomain]) gps = profiles[subdomain].gps;
  }
  if (req.params.gps) gps = Gps.merge(gps, +req.params.gps);
  req.params.gps = '' + gps;
  query('SELECT loc FROM user WHERE id = ?', req.params.userID).subscribe(
    resultSet => {
      if (resultSet.length < 1) return res.status(404).send();
      else if (resultSet[0].loc === gps) next();
      else return res.status(400).send({ location: resultSet[0].loc });
    },
    err => res.status(500).send(err)
  );
}

export function validateLocation(gps: number, location: number): { status: number; obj?: Object } {
  if (location === gps) return;
  else throw { status: 400, obj: { location } };
}
