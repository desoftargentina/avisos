import { writeFileSync, readFile, writeFile, access } from 'fs';
import { Observable, Subject, of } from 'rxjs';
import { sync as assertDir } from 'mkdirp';
import { tap } from 'rxjs/operators';
import { F_OK } from 'constants';

let cleaning = true;
let buffer: { [file: string]: { file: string; data: any; touches: number; saving?: boolean } } = {};

export function saveData(file: string, data: any) {
  const buff = buffer[file];
  if (!buff)
    loadData(file).subscribe(loaded => {
      for (const key in loaded) if (!data.hasOwnProperty(key)) data[key] = loaded[key];
      buffer[file] = { file, data, touches: 0, saving: true };
      const idx = file.lastIndexOf('/');
      if (idx > 0) assertDir(file.substr(0, idx));
      writeFile(file, JSON.stringify(data), 'utf-8', err => {
        if (!err) buffer[file].touches = 0;
        buffer[file].saving = false;
      });
    });
  else {
    buff.data = data;
    if (!buff.saving && buff.touches > 5) {
      buff.saving = true;
      const idx = file.lastIndexOf('/');
      if (idx > 0) assertDir(file.substr(0, idx));
      writeFile(file, JSON.stringify(data), 'utf-8', err => {
        if (!err) buff.touches = 0;
        buff.saving = false;
      });
    } else buff.touches++;
  }
}

export function loadData(file: string): Observable<any> {
  const subject: Subject<any> = new Subject();
  // tslint:disable-next-line: deprecation
  if (buffer[file]) return of(buffer[file].data);
  access(file, F_OK, err => {
    if (err) {
      subject.next({});
      subject.complete();
    } else
      readFile(file, 'utf-8', (err, data) => {
        if (err) subject.error(err);
        else subject.next(JSON.parse(data));
        subject.complete();
      });
  });

  return subject.pipe(
    tap(data => (buffer[file] = { file, data, touches: 0 })),
    tap(checkBuffer)
  );
}

function checkBuffer() {
  if (!cleaning && Object.keys(buffer).length > 100000) asyncDataDump();
}

export function forceDataDump() {
  cleaning = false;
  const buff = buffer;
  buffer = {};
  for (const file of Object.keys(buff)) {
    const idx = file.lastIndexOf('/');
    if (idx > 0) assertDir(file.substr(0, idx));
    writeFileSync(file, JSON.stringify(buff[file].data), 'utf-8');
  }
  console.log('Se han guardado los archivos temporales');
}

export async function asyncDataDump() {
  const subject: Subject<{ file: string; data: any; touches: number }> = new Subject();
  cleaning = true;
  for (const file of Object.keys(buffer)) {
    const entry = buffer[file];
    if (typeof entry === 'undefined') continue;
    const idx = file.lastIndexOf('/');
    if (idx > 0) assertDir(file.substr(0, idx));
    await writeFile(file, JSON.stringify(entry.data), 'utf-8', err => subject.error(err));
    buffer[file] = undefined;
    subject.next(entry);
    if (!cleaning) break;
  }
  subject.complete();
  cleaning = false;
  console.log('Se han guardado los archivos temporales');

  return subject.toPromise();
}
