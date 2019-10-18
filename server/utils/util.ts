import { exists, readFile, writeFileSync } from 'fs';
import { sync as assertDir } from 'mkdirp';
import { parse, stringify } from '../../api';

export let today: Date = new Date();
export const msPerDay = 1000 * 3600 * 24;
export let storage: string;

let data: { [key: string]: any };

export function initUtils() {
  storage = process.env.STORAGE;
  loadGlobals();
}

function loadGlobals() {
  exists(`${storage}/globals.dat`, exists => {
    if (exists) readFile(`${storage}/globals.dat`, 'utf-8', (err, contents) => {
      if (err) console.error('EP11', err);
      else data = parse(contents);
    });
    else data = {};
  });
}

export function saveGlobals() {
  assertDir(storage);
  writeFileSync(`${storage}/globals.dat`, stringify(data), 'utf-8');
  console.log('Datos globales guardados');
}

export function generateID(key: string) {
  if (key in data) return data[key] += 1;
  else return data[key] = 1;
}

export function generateSerial(key: string) {
  let serial = 'S', id = generateID(key);
  while (id >= 1) {
    const curr = id % 36;
    serial += String.fromCharCode(curr > 9 ? 87 + curr : 48 + curr);
    id /= 36;
  }
  return serial;
}

export function set(path: string, value: any) {
  data[path] = value;
}

export function read(path: string, def?: any) {
  if (path in data)
    return data[path];
  return def;
}

export function setDate(day: Date) {
  today = day;
}


