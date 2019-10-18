import { scheduleJob } from 'node-schedule';
import { from } from 'rxjs';
import { mergeMap, tap, concatMap, map, mapTo, skip } from 'rxjs/operators';
import { query } from '../sql';
import { setDate, storage, saveGlobals } from './util';
import { forceDataDump, asyncDataDump, loadData } from './file-data';
import { sync as syncDel} from 'del';

export let cycle: number; // Hours since epoch time

function updateData(scheduled: boolean = true, skipDumping = false) {
  setDate(new Date());
  cycle = Math.floor(Date.now() / (1000 * 3600));
  updateTrendings();
  if (scheduled) {
    console.log('Ejecutando mantenimiento de rutina');
    if (!skipDumping) asyncDataDump();
    tickPoints();
  }
}

function countVisits(data: { visits: { [cycle: number]: number[] } }, daysAgo?: number) {
  let count = 0;
  const threshold = daysAgo ? cycle - daysAgo * 24 : 0;
  if (data.visits)
    for (const key of Object.keys(data.visits)) if (!daysAgo || +key >= threshold) count += data.visits[+key].length;
  return count;
}

function updateTrendings() {
  /* Told easily: lots of registered visits = trending */
  interface Maxes {
    global: number;
    monthly: number;
    weekly: number;
    daily: number;
  }
  query('select id, publisher from publication')
    .pipe(
      map(data => data as { id: number; publisher: number }[]),
      concatMap(publications => {
        const maxes: Maxes = { global: 0, monthly: 0, weekly: 0, daily: 0 };
        return from(publications).pipe(
          mergeMap(pub => loadData(`${storage}/${pub.publisher}/${pub.id}/data`)),
          tap(data => {
            const locMaxes: Maxes = {
              global: countVisits(data),
              monthly: countVisits(data, 30),
              weekly: countVisits(data, 7),
              daily: countVisits(data, 1)
            };
            if (!maxes.global || locMaxes.global > maxes.global) maxes.global = locMaxes.global;
            if (!maxes.monthly || locMaxes.monthly > maxes.monthly) maxes.monthly = locMaxes.monthly;
            if (!maxes.weekly || locMaxes.weekly > maxes.weekly) maxes.weekly = locMaxes.weekly;
            if (!maxes.daily || locMaxes.daily > maxes.daily) maxes.daily = locMaxes.daily;
          }),
          skip(publications.length - 1),
          mapTo({ publications, maxes })
        );
      }),
      map(data => {
        data.maxes.global *= 0.9;
        data.maxes.monthly *= 0.9;
        data.maxes.weekly *= 0.9;
        data.maxes.daily *= 0.9;
        return data;
      }),
      mergeMap(data =>
        from(data.publications).pipe(
          map(pub => {
            return { id: pub.id, publisher: pub.publisher, maxes: data.maxes };
          })
        )
      ),
      mergeMap(data =>
        loadData(`${storage}/${data.publisher}/${data.id}/data`).pipe(
          map(file => {
            return { id: data.id, maxes: data.maxes, file };
          })
        )
      ),
      mergeMap(data => {
        let stat = 0;
        if (countVisits(data.file) >= data.maxes.global) stat |= 0x1 << 3;
        if (countVisits(data.file, 30) >= data.maxes.monthly) stat |= 0x1 << 2;
        if (countVisits(data.file, 7) >= data.maxes.weekly) stat |= 0x1 << 1;
        if (countVisits(data.file, 1) >= data.maxes.daily) stat |= 0x1;
        return query('UPDATE publication SET status = (status & (~0x1E)) | (? << 1)  WHERE id = ?', [stat, data.id]);
      })
    )
    .subscribe(
      () => {},
      err => console.log('EP01:', err),
      () => {
        console.log('Trendings Updated');
      }
    );
}

function tickPoints(ticks: number = 1) {
  const base = 'UPDATE publication SET points = points *';
  const daysAgo = (days: string | number) => `CURRENT_TIMESTAMP - INTERVAL ${days} DAY`;

  /* Remove some points from publications with more than 14 days left */
  query(`${base} ${0.996756872 * ticks} WHERE points > 0 AND date > ${daysAgo('duration - 14')}`) // (0.925 per day)
    .subscribe(() => {}, err => console.log('EP02:', err));

  /* Add some points to publications with less than 8 days left */
  query(`${base} ${1.002664092 * ticks} WHERE points > 0 AND date < ${daysAgo('duration - 8')}`) // (1.6666... every 8 days)
    .subscribe(() => {}, err => console.log('EP03:', err));

  /* Give boosts from being in trendings */
  // Wide range time trends give smaller boosts, as they last longer in time
  query(`${base} ${1.001008603 * ticks} WHERE points > 0 AND status & 0x10`) // Global Trend (x0.75 times Monthly)
    .subscribe(() => {}, err => console.log('EP04:', err));
  query(`${base} ${1.001344804 * ticks} WHERE points > 0 AND status & 0x08`) // Monthly Trend (1.175 every 5 days)
    .subscribe(() => {}, err => console.log('EP05:', err));
  query(`${base} ${1.00325368 * ticks} WHERE points > 0 AND status & 0x04`) // Weekly Trend ((1 / 0.925) per day)
    .subscribe(() => {}, err => console.log('EP06:', err));
  query(`${base} ${1.006742132 * ticks} WHERE points > 0 AND status & 0x02`) // Daily Trend (1.175 per day)
    .subscribe(() => {}, err => console.log('EP07:', err));
}

let saved = false;
function onClose(exit: boolean) {
  if (!saved) {
    saveGlobals();
    forceDataDump();
    clearTmp();
    saved = true;
  }

  if (exit) {
    console.log('Servidor cerrado correctamente');
    process.exit();
  }
}

function clearTmp() {
  syncDel(`${process.env.STORAGE}/tmp/**`);
  console.log('Datos temporales borrados');
}

export function registerTasks() {
  updateData(false);
  scheduleJob('0 * * * *', updateData as () => void);
  process.stdin.resume();
  process.on('exit', onClose.bind(null, false));
  process.on('SIGINT', onClose.bind(null, true));
  process.on('SIGUSR1', onClose.bind(null, true));
  process.on('SIGUSR2', onClose.bind(null, true));
  process.on('uncaughtException', err => {
    console.error('Uncaught Exception!!!!\n', err);
    onClose.bind(null, true);
  });
}
