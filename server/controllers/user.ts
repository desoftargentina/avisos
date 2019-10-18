import { Request, Response } from 'express';
import { query } from '../sql';
import { map } from 'rxjs/operators';
import { IUserPreview } from 'api';

class UserController {
  public preview(req: Request, res: Response) {
    query('SELECT id, firstname, lastname, level, status, gps FROM user WHERE id = ? AND loc = ?', [
      req.params.userID,
      req.params.gps
    ])
      .pipe(map(resultSet => resultSet[0]))
      .subscribe(
        user => {
          const uPrev: IUserPreview = {
            id: user.id,
            name: [user.firstname, user.lastname].join(' '),
            isPremium: user.level > 1,
            isTrusted: (user.status & 0x4) !== 0,
            gps: user.gps,
            publications: 0
          };
          res.send(uPrev);
        },
        () => res.status(404).send()
      );
  }

  public info(req: Request, res: Response) {
    query(
      'SELECT id, firstname, lastname, email, level, gps, genre, area_code, cellphone FROM user WHERE id = ? AND loc = ?',
      [req.params.userID, req.params.gps]
    )
      .pipe(map(resultSet => resultSet[0]))
      .subscribe(
        user => res.send(user),
        err => {
          console.log('EP10:', err);
          res.status(404).send();
        }
      );
  }
}
export const userController = new UserController();
