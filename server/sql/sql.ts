import mysql, { MysqlError, FieldInfo, Connection, Pool } from 'mysql';
import { Observable, of, iif, Subject } from 'rxjs';
import { map, catchError, mergeMap, mapTo } from 'rxjs/operators';
import { importer } from './internal';
import { existsSync } from 'fs';

export const create_user = `
CREATE TABLE IF NOT EXISTS user (
  id int NOT NULL AUTO_INCREMENT,
  firstname varchar(32) NOT NULL,
  lastname varchar(128) NOT NULL,
  email varchar(64) NOT NULL,
  secret varchar(255),
  gps int DEFAULT 0,
  genre char(1),
  level tinyint unsigned NOT NULL DEFAULT '1',
  status tinyint NOT NULL DEFAULT 0, /* See reference */
  area_code varchar(4),
  cellphone varchar(16),
  google_id varchar(36),
  facebook_id varchar(36),
  loc int DEFAULT 0,
  stamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email_UNIQUE (email) /*!80000 INVISIBLE */,
  KEY search_idx (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

export const create_publication = `
CREATE TABLE IF NOT EXISTS publication (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(64) NOT NULL,
  price decimal(9,2) unsigned,
  category tinyint unsigned NOT NULL,
  subcategory smallint unsigned NOT NULL,
  \`date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`condition\` binary NOT NULL DEFAULT true,
  gps int NOT NULL,
  duration smallint unsigned NOT NULL,
  points int unsigned NOT NULL DEFAULT '0',
  currency tinyint unsigned NOT NULL DEFAULT '1',
  views int unsigned NOT NULL DEFAULT '0',
  publisher int NOT NULL,
  status int NOT NULL DEFAULT '0',
  PRIMARY KEY (id),
  KEY sort_idx (points) /*!80000 INVISIBLE */,
  KEY search_idx (category),
  KEY publisher (publisher),
  CONSTRAINT publication__user_fk FOREIGN KEY (publisher) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

export const create_publication_image = `
CREATE TABLE IF NOT EXISTS publication_image (
  publication int NOT NULL,
  serial varchar(32) NOT NULL,
  stamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (publication, serial),
  KEY publication_idx (publication),
  CONSTRAINT publication_image__publication FOREIGN KEY (publication) REFERENCES publication(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

let pool: Pool;
const initSubject = new Subject<void>();

export function dbInitHook() {
  return initSubject.asObservable();
}

export function assertDB() {

  query('SELECT 1 FROM user LIMIT 1')
    .pipe(
      mapTo(false),
      catchError(() => query(create_user).pipe(mapTo(true))),

      mergeMap(err1 => query('SELECT 1 FROM publication LIMIT 1').pipe(mapTo(err1))),
      catchError(() => query(create_publication).pipe(mapTo(true))),

      mergeMap(err2 => query('SELECT 1 FROM publication_image LIMIT 1').pipe(mapTo(err2))),
      catchError(() => query(create_publication_image).pipe(mapTo(true)))
    ).subscribe(dirty => {

      if (existsSync('./import.progress') || dirty) {
        if (!dirty) console.log('Se continuara con la importacion de datos');

        // tslint:disable-next-line: no-console
        importer.subscribe(() => { }, err => console.trace(err));
      }

      initSubject.next();
    });
}

export function initDatabase() {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  });

  pool.getConnection((err, conn) => {
    if (err) throw err;
    pool.releaseConnection(conn);
    console.log('Base de Datos conectada exitosamente');
    assertDB();
  });
}

export interface ResultSet {
  result?: any;
  fields?: FieldInfo[];
}

const querryIdx = 0;
function _query(conn: Connection | Pool, query: string, values?: any): Observable<ResultSet> {
  // console.log(`Query ${++querryIdx}: ${query}`);
  return new Observable(observer => {
    conn.query(query, values, (err: MysqlError, result?: any, fields?: FieldInfo[]) => {
      if (err) observer.error(err);
      else observer.next({ result, fields });
      observer.complete();
    });
  });
}

export function queryFields(query: string, values?: any): Observable<ResultSet> {
  return _query(pool, query, values);
}

export function query(query: string, values?: any): Observable<any> {
  return queryFields(query, values).pipe(map(res => res.result));
}

export function queryFields_promise(query: string, values?: any): Promise<ResultSet> {
  return queryFields(query, values).toPromise();
}

export function query_promise(_query: string, values?: any): Promise<any> {
  return query(_query, values).toPromise();
}
