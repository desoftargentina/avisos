import { Request, Response } from 'express';
import { query } from '../sql';
import { Gps } from '../../api';

class ApiController {
  public typeahead(req: Request, res: Response) {
    const clauses = `(publication.status & 0x60) = 0x20 AND loc ${Gps.query(+req.params.gps)}`;
    query(
      `SELECT publication.name ` +
        `FROM publication inner join user on publication.publisher = user.id ` +
        `WHERE ${clauses} AND publication.name LIKE \'%\' ? \'%\' LIMIT ?`,
      [req.params.lookup.split('').join('%'), +req.params.count]
    ).subscribe(
      resultSet => {
        const names: string[] = [];
        for (const result of resultSet) names.push(result.name);
        res.send(names);
      },
      err => res.status(500).send(err)
    );
  }
}
export const apiController = new ApiController();
