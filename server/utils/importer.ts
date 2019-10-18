import { readFileSync, existsSync, writeFileSync, mkdirSync, createWriteStream, unlinkSync } from 'fs';
import { clearLine, moveCursor } from 'readline';
import { defer } from 'rxjs';

import { query_promise as query, create_user, create_publication } from '../sql/internal';
import { Gps, stringify, parse } from '../../api';
import { timeout } from 'rxjs/operators';
import { get } from 'https';

const maxJobs = 12;
const legacyFolder = './legacy';
const dataFolder = './server/data';
let bigDataFolder: string;

const names = [
  'Pedro',
  'María',
  'Ana',
  'Carlos',
  'Gustavo',
  'Sofía',
  'Miguel',
  'Serena',
  'Lina',
  'Nerea',
  'Aaron',
  'Luis',
  'Camila',
  'Agustin',
  'Nicolas',
  'Clementine',
  'Bruno',
  'Delfina',
  'Gaspar',
  'Micaela',
  'Ernesto',
  'Hermes',
  'Ileana',
  'Jordan'
];
const lastnames = [
  'Suarez',
  'Leguizamon',
  'Faraday',
  'Garcia',
  'Gutierrez',
  'Mendez',
  'Lopez',
  'Stark',
  'Coder',
  'Knitter',
  'Colinas'
];

const base_fill_users = `
INSERT
	INTO user(firstname, lastname, email, gps, genre, level, status, area_code, cellphone, stamp)
		SELECT
            nombre as firstname,
            apellidos as lastname,
            email,
            0 as gps,
            sexo as genre,
            tipo as level,
            ((estado << 1) | 0x1) as status,
            cod_area as area_code,
            no_cel as cellphone,
            fecha_incripcion as stamp
		FROM usuarios where estado = 0 or estado = 1`;

const insert_publication = `
INSERT
  INTO publication(
    name,
    publisher,
    currency,
    price,
    date,
    gps,
    category,
    subcategory,
    duration,
    views,
    points,
    status
  )
    SELECT
      nombre as name,
      ? as publisher,
      moneda as currency,
      precio as price,
      fecha as date,
      ? as gps,
      ? as category,
      ? as subcategory,
      duracion as duration,
      visitas as view,
      visitas as points,
      1 as status
    FROM avisos WHERE avisos.id = ?;
`;

function insert_empty_user() {
  const name = names[(Math.random() * Number.MAX_SAFE_INTEGER) % (names.length - 1)],
    lastname = lastnames[(Math.random() * Number.MAX_SAFE_INTEGER) % (lastnames.length - 1)];
  return (
    'INSERT ' +
    'INTO user(firstname, lastname, email, gps, area_code, cellphone, google_id) ' +
    `VALUES('${name}', '${lastname}', ?, ?, '0', '0', 'auto');`
  );
}

const location_ts_header = `export interface City {id: number; name: string; code: string; }
export interface State {id: number; name: string; cities: { [id: number]: City };}
export interface Country {id: number; name: string; code: string; states: { [id: number]: State };}
`;

const category_ts_header = `export interface Subcategory {id: number; name: string; category: number}
export interface Category {id: number; name: string;icon: string; childs: number[]}
`;

const currency_ts_header = `export interface Currency {id: number; name: string; code: string}
`;

interface Question {
  publication: number;
  name: string;
  contents: string;
  email: string;
  phone: string;
}

interface CityTrue {
  id: number;
  name: string;
  code: string;
}

interface City {
  id: number;
  name: string;
  code: number;
}

interface StateTrue {
  id: number;
  name: string;
  cities: { [id: number]: CityTrue };
}

interface State {
  id: number;
  name: string;
  cities: { [id: string]: City };
}

interface StateFlex {
  id: number;
  name: string;
  cities?: { [id: string]: City };
}

interface CountryTrue {
  id: number;
  name: string;
  code: string;
  states: { [id: number]: StateTrue };
}

interface Country {
  id: number;
  name: string;
  code: number;
  states: { [id: string]: State };
}

interface CountryFlex {
  id: number;
  name: string;
  code: number;
  states?: { [id: string]: State };
}

interface Subcategory {
  id: number;
  name: string;
  category: number;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  childs: number[];
}

interface CategoryFlex {
  name: string;
  icon: string;
}

interface Currency {
  id: number;
  name: string;
  code: string;
}

const categories: { [key: number]: CategoryFlex } = {
  1: {
    name: 'Automotor',
    icon: 'car'
  },
  2: {
    name: 'Inmuebles',
    icon: 'home'
  },
  3: {
    name: 'Empleos',
    icon: 'briefcase'
  },
  4: {
    name: 'Servicios',
    icon: 'tools'
  },
  5: {
    name: 'Alimentos y Bebidas',
    icon: 'cocktail'
  },
  6: {
    name: 'Animales y Mascotas',
    icon: 'paw'
  },
  7: {
    name: 'Arte y Artesanías',
    icon: 'pencil-ruler'
  },
  8: {
    name: 'Bebés',
    icon: 'baby'
  },
  9: {
    name: 'Cámaras y Accesorios',
    icon: 'camera'
  },
  10: {
    name: 'Celulares y Teléfonos',
    icon: 'mobile-alt'
  },
  11: {
    name: 'Coleccionables y Entretenimiento',
    icon: 'cubes'
  },
  12: {
    name: 'Computación',
    icon: 'desktop'
  },
  13: {
    name: 'Consolas y Videojuegos',
    icon: 'gamepad'
  },
  14: {
    name: 'Construcción',
    icon: 'hard-hat'
  },
  15: {
    name: 'Deportes y Fitness',
    icon: 'dumbbell'
  },
  16: {
    name: 'Electrónica',
    icon: 'microchip'
  },
  17: {
    name: 'Entradas para Eventos',
    icon: 'ticket-alt'
  },
  18: {
    name: 'Hogar, Muebles y Jardín',
    icon: 'chair'
  },
  19: {
    name: 'Industrias y Oficinas',
    icon: 'building'
  },
  20: {
    name: 'Instrumentos Musicales',
    icon: 'guitar'
  },
  21: {
    name: 'Joyas y Relojes',
    icon: 'gem'
  },
  22: {
    name: 'Juegos y Juguetes',
    icon: 'chess'
  },
  23: {
    name: 'Libros, Revistas y Comics',
    icon: 'book'
  },
  24: {
    name: 'Música, Películas y Series',
    icon: 'film'
  },
  25: {
    name: 'Reliquias Antiguas',
    icon: 'hourglass'
  },
  26: {
    name: 'Ropa y Accesorios',
    icon: 'tshirt'
  },
  27: {
    name: 'Salud y Belleza',
    icon: 'heartbeat'
  },
  28: {
    name: 'Otras Categorías',
    icon: 'th-large'
  }
};

type ImageQueue = { uri: string; localUri: string }[];

interface GPSMap {
  countryMap: { [old: number]: number };
  stateMap: { [old: number]: { state: number; country: number } };
  cityMap: {
    [old: number]: { city: number; state: number; country: number };
  };
}

const gpsMaps: GPSMap = { countryMap: {}, stateMap: {}, cityMap: {} };
let userIDMap: { [old: number]: number } = {};
let publishIDMap: { [old: number]: number } = {};
let categoryMap: {
  category: { [old: number]: number };
  subcategory: { [old: number]: { id: number; category: number } };
} = { category: {}, subcategory: {} };

const gpsData: { [key: number]: Country } = {};

let coIdx = 1;

let config: { [key: string]: string } = {};

function loadConfig() {
  if (existsSync('./import.progress')) {
    console.log('Se encontro un archivo de progreso, se procederá a la ultima etapa guardada');
    config = parse(readFileSync('./import.progress', 'utf-8'));
    console.log('');
  }
}

async function mySqlInit() {
  await query('SET @update_id := 0');
}

function saveConfig() {
  writeFileSync('./import.progress', stringify(config), 'utf-8');
}

function clearConfig() {
  if (existsSync('./import.progress')) unlinkSync('./import.progress');
}

function shouldDoStep(step: number, phase?: number): boolean {
  if (config.lastReached && +config.lastReached > step * 100 + (phase || 99)) return false;
  config.lastReached = '' + (step * 100 + (phase || 0));
  saveConfig();
  return true;
}

let step = 0;
const stepCount = 7;
async function nextStep(func: () => void, msg: string) {
  if (shouldDoStep(step)) {
    console.log(`Paso ${step} de ${stepCount}: ${msg}`);
    await func();
    console.log('');
  }
  ++step;
}

async function initialSetup() {
  console.log('Creando tabla de usuarios');
  await query(create_user);
  console.log('Creando tabla de publicaciones');
  await query(create_publication);
  console.log('Migrando usuarios (Sin GPS)');
  await query(base_fill_users);
}

async function downloadImg(uri: string, filename: string, callback?: (filename: string, uri: string) => any) {
  await get(uri, msg => msg.pipe(createWriteStream(filename)));
  // await request(uri).pipe(createWriteStream(filename));
  if (callback) callback(filename, uri);
}

async function downloadImages(
  imageQueue: ImageQueue,
  callback?: (filename: string, uri: string) => any,
  forEach?: () => any
) {
  const totalImages = imageQueue.length;
  let completed = 0,
    jobCount = 0;

  const wipeLine = () => {
    clearLine(process.stdout, 0);
    moveCursor(process.stdout, -100, 0);
  };

  const updateConsole = () => {
    wipeLine();
    process.stdout.write(`Imagenes descargadas: ${completed}/${totalImages} - (${jobCount}/${maxJobs} Hilos)`);
  };

  const next = () => {
    const img = imageQueue.pop();
    if (!img) return;
    jobCount++;
    updateConsole();
    downloadImg(img.uri, img.localUri, callback)
      .then(() => completed++)
      .finally(() => {
        jobCount--;
        updateConsole();
        next();
      });
  };

  updateConsole();
  for (let i = 1; i < maxJobs; i++) next();

  /* Add job to current thread */
  let img: { uri: string; localUri: string } | undefined;
  jobCount++;
  updateConsole();
  do {
    img = imageQueue.pop();
    if (!img) {
      if (forEach) forEach();
      continue;
    }
    await downloadImg(img.uri, img.localUri, callback);
    completed++;
    updateConsole();
    if (forEach) forEach();
  } while (img);
  jobCount--;

  while (jobCount > 0) await timeout(200);
  if (forEach) forEach();
  wipeLine();
  console.log(`Imagenes descargadas: ${completed}/${totalImages}`);
}

function assertCountry(id: number, code?: number, name?: string, states?: { [id: number]: State }) {
  const _id = gpsMaps.countryMap[id];
  if (!_id) {
    const _coIdx = id > 0 ? coIdx++ : 0;
    gpsData[_coIdx] = {
      id: _coIdx,
      code: code ? code : 0,
      name: name ? name : id > 0 ? 'UNKNOWN' : 'NULL',
      states: states ? states : {}
    };
    if (id > 0) gpsMaps.countryMap[id] = _coIdx;
    return _coIdx;
  } else return _id;
}

function assertState(id: number, country?: number, name?: string, cities?: { [id: number]: City }) {
  const _data = gpsMaps.stateMap[id];
  if (!_data || id <= 0) {
    const _coIdx = country ? country : assertCountry(-1);
    const _country = gpsData[_coIdx];
    const _sIdx = Object.keys(_country.states).length + 1;
    if (id > 0) gpsMaps.stateMap[id] = { country: _coIdx, state: _sIdx };
    _country.states[_sIdx] = {
      id: _sIdx,
      name: name ? name : id > 0 ? 'Unknown' : 'NULL',
      cities: cities ? cities : {}
    };
    return _sIdx;
  } else return _data.state;
}

function assertCity(id: number, country?: number, state?: number, name?: string, code?: number) {
  if (!gpsMaps.cityMap[id]) {
    const _coIdx = country ? country : assertCountry(-1);
    const _sIdx = state ? state : assertState(-1, _coIdx);
    const _state = gpsData[_coIdx].states[_sIdx];
    const _ciIdx = Object.keys(_state.cities).length + 1;
    gpsMaps.cityMap[id] = { country: _coIdx, state: _sIdx, city: _ciIdx };
    _state.cities[_ciIdx] = {
      id: _ciIdx,
      name: name ? name : 'Unknown',
      code: code ? code : 0
    };
  }
}

function registerLocation(_: { country?: number | CountryFlex; state?: number | StateFlex; city?: number | City }) {
  let _coIdx, _sIdx;
  if (_.country)
    if (typeof _.country === 'number') _coIdx = assertCountry(_.country);
    else _coIdx = assertCountry(_.country.id, _.country.code, _.country.name, _.country.states);
  else if (_.state) {
    const state = typeof _.state === 'number' ? _.state : _.state.id;
    if (gpsMaps.stateMap[state]) _coIdx = gpsMaps.stateMap[state].country;
  }
  if (_.state)
    if (typeof _.state === 'number') _sIdx = assertState(_.state, _coIdx);
    else _sIdx = assertState(_.state.id, _coIdx, _.state.name, _.state.cities);
  if (_.city)
    if (typeof _.city === 'number') assertCity(_.city, _coIdx, _sIdx);
    else assertCity(_.city.id, _coIdx, _sIdx, _.city.name, _.city.code);
}

async function gpsImporter() {
  console.log(
    `Aqui se leen los paises, provincias y ciudades, se los asocia, y se los guarda en un archivo de datos ('gps.data')`
  );
  const countries = await query('SELECT * FROM pais');
  const states = await query('SELECT * from provincias');
  const cities = await query('SELECT * from localidades');

  for (const country of countries)
    registerLocation({ country: { id: country.id, name: country.nombre, code: country.cod_tel } });
  console.log('Paises Leidos');

  for (const state of states) registerLocation({ country: state.id_pais, state: { id: state.id, name: state.nombre } });
  console.log('Provincias Leidas');

  for (const city of cities)
    registerLocation({ state: city.id_provincia, city: { id: city.id, name: city.nombre, code: 0 } });
  console.log('Ciudades Leidas');

  const _gpsData: { [key: number]: CountryTrue } = {};
  for (const cKey of Object.keys(gpsData)) {
    const country = gpsData[+cKey];
    const _states: { [id: number]: StateTrue } = {};

    for (const sKey of Object.keys(country.states)) {
      const state = country.states[sKey];
      const _cities: { [id: number]: CityTrue } = {};

      for (const ciKey of Object.keys(state.cities)) {
        const city = state.cities[ciKey];
        _cities[+ciKey] = {
          id: +ciKey,
          code: '' + city.code,
          name: city.name
        };
      }

      _states[+sKey] = {
        id: +sKey,
        name: state.name,
        cities: _cities
      };
    }
    _gpsData[+cKey] = {
      id: +cKey,
      code: '' + country.code,
      name: country.name,
      states: _states
    };
  }

  console.log('Volcando datos en archivo');
  let location_ts = location_ts_header;
  location_ts += `export const countries: { [key: number]: Country } = ${stringify(_gpsData)};\n`;
  location_ts += `export default countries;\n`;
  writeFileSync(`${dataFolder}/location.ts`, location_ts, 'utf-8');
  writeFileSync(`${legacyFolder}/gps.map`, stringify(gpsMaps), 'utf-8');
  console.log('Se han generado las claves GPS');
}

function loadGpsMap() {
  const maps: GPSMap = parse(readFileSync(`${legacyFolder}/gps.map`, 'utf-8'));
  gpsMaps.countryMap = maps.countryMap;
  gpsMaps.stateMap = maps.stateMap;
  gpsMaps.cityMap = maps.cityMap;
}

async function categoryImporter() {
  console.log(
    'Se ordenaran las categorias y subcategorias, se agregara informacion sobre los iconos de las categorias, y se guardara todo en un archivo'
  );
  const catQ = await query('SELECT id, nombre FROM categorias WHERE estado = 1');
  const subQ = await query('SELECT id, nombre, id_categoria FROM subcategorias WHERE estado = 1 ORDER BY nombre');

  for (const oldCat of catQ) {
    if (oldCat.nombre === 'Tecnología') oldCat.nombre = 'Otras Categorías';
    for (const newCat of Object.keys(categories))
      if (oldCat.nombre === categories[+newCat].name) {
        categoryMap.category[oldCat.id] = +newCat;
        break;
      }
  }

  const data: { id: number; name: string }[][] = [];

  for (const oldSub of subQ) {
    const category = categoryMap.category[oldSub.id_categoria];
    if (!data[category]) data[category] = [];
    data[category].push({
      id: oldSub.id,
      name: oldSub.nombre
    });
  }

  const category_list: { [id: number]: Category } = {};
  const subcategory_list: { [id: number]: Subcategory } = {};

  let index = 1;
  for (const [category, childs] of data.entries()) {
    if (!childs) continue;
    const _childs: number[] = [];
    for (const subcategory of childs) {
      categoryMap.subcategory[subcategory.id] = { id: index, category };
      subcategory_list[index] = { id: index, name: subcategory.name, category };
      _childs.push(index++);
    }
    category_list[category] = {
      id: category,
      name: categories[category].name,
      icon: categories[category].icon,
      childs: _childs
    };
  }

  saveCategoryMap();

  let category_ts = category_ts_header;
  category_ts += `export const category_list: {[key: number]: Category} = ${stringify(category_list)};\n`;
  category_ts += `export const subcategory_list: {[key: number]: Subcategory} = ${stringify(subcategory_list)};\n`;
  category_ts += `export default category_list;\n`;

  writeFileSync(`${dataFolder}/category.ts`, category_ts, 'utf-8');

  console.log('Categorias y Subcategorias Importadas');
}

function loadCategoryMap() {
  categoryMap = parse(readFileSync(`${legacyFolder}/category.map`, 'utf-8'));
}

function saveCategoryMap() {
  writeFileSync(`${legacyFolder}/category.map`, stringify(categoryMap), 'utf-8');
}

async function migrateUsers() {
  console.log(`Esto completa el campo 'gps' a la tabla de usuarios, basasandose en los contenidos de 'gps.data'`);
  console.log(`Además, se cambia el tipo de algoritmo de los hashes de '$2y*$' a $2a$1`);
  loadGpsMap();
  const res = await query(
    'SELECT id, contrasena, usuario, pais, localidad FROM usuarios where estado = 0 or estado = 1'
  );
  for (const user of res) {
    const gps = Gps.serialize({ country: gpsMaps.countryMap[user.pais], city: gpsMaps.cityMap[user.localidad].city });
    const parsedHash = user.contrasena.replace(/^\$2y(.+)\$/i, '$2a$1');
    await query('update user set gps = ?, secret = ?, id = (select @update_id := id) where email = ?', [
      gps,
      user.email,
      parsedHash
    ]);
    userIDMap[+user.id] = +(await query('select @update_id'))[0].id;
  }
  saveUserIDsMap();
  console.log('Se han migrado los usuarios');
}

function loadUserIDsMap() {
  userIDMap = parse(readFileSync(`${legacyFolder}/userIDs.map`, 'utf-8'));
}

function saveUserIDsMap() {
  writeFileSync(`${legacyFolder}/userIDs.map`, stringify(userIDMap), 'utf-8');
}

async function migratePublications() {
  /* Fix Database */
  const phase1 = async () => {
    console.log('Fase 1 de 2: Rellenado de base de datos');
    console.log(`Se completan todos los campos de la tabla 'publication', se computan las claves gps,`);
    console.log(`y se crean usuarios vacios para los ids de usuarios faltantes (con google_id = 'auto')`);

    loadGpsMap();
    loadCategoryMap();
    loadUserIDsMap();

    const res = await query(
      'SELECT id, id_usuario, id_localidad, id_categoria, id_subcategoria FROM avisos where estado = 1'
    );

    if (!config.n) config.n = '0';

    for (const publication of res) {
      const gps = Gps.serialize(gpsMaps.cityMap[publication.id_localidad]);
      let userID = userIDMap[publication.id_usuario];
      if (!userID) {
        const res = await query(insert_empty_user(), [(config.n = '' + (+config.n + 1)), gps]).catch(err => {
          saveConfig();
          throw err;
        });
        userID = userIDMap[publication.id_usuario] = res.insertId;
      }
      const res = await query(insert_publication, [
        userID,
        gps,
        categoryMap.category[publication.id_categoria],
        categoryMap.subcategory[publication.id_subcategoria].id,
        publication.id
      ]);
      publishIDMap[publication.id] = res.insertId;
    }

    saveConfig();

    console.warn('Punto Critico: Si se corta la ejecucion durante este punto, se debera volver a ejecutar el paso 3');
    console.warn(
      `Para volver a ejecutar el paso 3, cambie el valor de 'lastReached' en el archivo 'import.progress' a '300'`
    );
    saveUserIDsMap();
    savePublishIDsMap();
    console.log('Punto Critico superado');
    console.log('Fase 1 Completada');
    console.log('');
  };

  /* Extract Hard Data */
  const phase2 = async () => {
    console.log('Fase 2 de 2: Volcado de datos');
    console.log(`Se guardan la descripcion y el thumbnail de la publicacion dentro de '${bigDataFolder}'`);
    loadUserIDsMap();
    loadPublishIDsMap();

    const imageQueue: ImageQueue = [];
    const res = await query('SELECT id, id_usuario, descripcion, url FROM avisos WHERE estado = 1');

    console.log('Volcando descripciones en archivos');
    for (const publication of res) {
      const userID = userIDMap[publication.id_usuario];
      const publishID = publishIDMap[publication.id];
      const userPath = `${bigDataFolder}/${userID}`;
      if (!existsSync(userPath)) mkdirSync(userPath);
      const localPath = `${userPath}/${publishID}`;
      if (!existsSync(localPath)) mkdirSync(localPath);
      writeFileSync(`${localPath}/description`, publication.descripcion, 'utf-8');

      if (publication.url.length !== 0 && publication.url.trim()) {
        const uri = `https://avisosentrerios.com.ar/adm/${publication.url}`;
        const localUri = `${localPath}/thumbnail`;
        imageQueue.push({ uri, localUri });
      }
    }

    console.log('Descargando thumbnails');
    await downloadImages(imageQueue);

    console.log('Fase 2 completada');
    console.log('');
  };

  if (shouldDoStep(4, 1)) await phase1();
  if (shouldDoStep(4, 2)) await phase2();

  console.log('Se han migrado las publicaciones');
}

function loadPublishIDsMap() {
  publishIDMap = parse(readFileSync(`${legacyFolder}/publishIDs.map`, 'utf-8'));
}

function savePublishIDsMap() {
  writeFileSync(`${legacyFolder}/publishIDs.map`, stringify(publishIDMap), 'utf-8');
}

async function currencyTable() {
  console.log(`Se volcaran los datos de la tabla a un archivo de datos ('currency.data')`);
  const res = await query('SELECT * FROM monedas');
  const data: { [id: number]: Currency } = {};
  for (const currency of res)
    data[currency.id] = {
      id: currency.id,
      name: currency.nombre,
      code: currency.codigo
    };
  let currency_ts = currency_ts_header;
  currency_ts += `export const currencies: { [id: number]: Currency } = ${stringify(data)};\n`;
  currency_ts += `export default currencies;\n`;
  writeFileSync(`${dataFolder}/currency.ts`, currency_ts, 'utf-8');
  console.log('Importacion de divisas completada');
}

async function questionsTable() {
  console.log(`Se guardaran las preguntas como un archivo de datos de usuario ('questions.data')`);

  loadPublishIDsMap();
  const questions: { [user: number]: Question[] } = {};

  console.log('Construyendo mapa de usuarios y publicaciones');
  const publicationsMap: { [id: number]: number } = {};
  for (const publication of await query('SELECT id, publisher FROM publication'))
    publicationsMap[publication.id] = publication.publisher;

  console.log('Leyendo y asociando preguntas');
  for (const question of await query('SELECT * FROM pregunta')) {
    const publishID = publishIDMap[question.id_aviso];
    const user = publicationsMap[publishID] ? publicationsMap[publishID] : -1;
    if (!questions[user]) questions[user] = [];
    questions[user].push({
      publication: publishID,
      name: question.nombre,
      contents: question.mensaje,
      email: question.email,
      phone: question.telefono
    });
  }

  console.log('Volcando datos en archivos');
  for (const user of Object.keys(questions)) {
    const uFolder = `${bigDataFolder}/${user}`;
    if (!existsSync(uFolder)) mkdirSync(uFolder);
    writeFileSync(`${uFolder}/questions.data`, stringify(questions[+user]), 'utf-8');
  }

  console.log('Preguntas importadas');
}

async function imagesTable() {
  console.log(`Se descargaran las imagenes de la base de datos 'imagen' a un almacenamiento persistente`);

  loadPublishIDsMap();

  console.log('Construyendo mapa de usuarios y publicaciones');
  const publicationsMap: { [id: number]: number } = {};
  for (const publication of await query('SELECT id, publisher FROM publication'))
    publicationsMap[publication.id] = publication.publisher;

  console.log('Descargando imagenes');
  const res = await query('SELECT * FROM imagen');
  let invalid = 0,
    useless = 0,
    already = 0;
  const dataLists: { [folder: string]: string[] } = {};
  const imageQueue: ImageQueue = [];
  for (const img of res) {
    const publishID = publishIDMap[img.id_aviso];
    if (!img.url.includes('/')) {
      useless++;
      continue;
    } else if (!publicationsMap[publishID]) {
      invalid++;
      continue;
    }
    const userPath = `${bigDataFolder}/${publicationsMap[publishID]}`;
    if (!existsSync(userPath)) mkdirSync(userPath);
    const pubPath = `${userPath}/${publishID}`;
    if (!existsSync(pubPath)) mkdirSync(pubPath);
    const localPath = `${pubPath}/img/`;
    if (!existsSync(localPath)) mkdirSync(localPath);
    if (!dataLists[localPath])
      if (existsSync(localPath + 'list')) dataLists[localPath] = parse(readFileSync(localPath + 'list', 'utf-8'));
      else dataLists[localPath] = [];
    const uri = `https://avisosentrerios.com.ar/adm/${img.url}`;
    const filename = img.url.substr(img.url.lastIndexOf('/') + 1);
    if (dataLists[localPath].includes(filename)) {
      already++;
      continue;
    }
    const localUri = `${localPath}${filename}`;
    imageQueue.push({ uri, localUri });
  }

  const imgListQueue: { file: string; folder: string }[] = [];

  const pushImgList = (filename: string) => {
    const idx = filename.lastIndexOf('/') + 1;
    if (idx > 0) imgListQueue.push({ file: filename.substr(idx), folder: filename.substr(0, idx) });
    else imgListQueue.push({ file: filename, folder: '/' });
  };

  const tickImgList = () => {
    let imgList = imgListQueue.pop();
    while (imgList) {
      if (!dataLists[imgList.folder]) {
        console.log('Couldn\'t assert a folder for image?');
        console.log('Folder: ', imgList.folder);
        imgList = imgListQueue.pop();
        continue;
      }
      dataLists[imgList.folder].push(imgList.file);
      writeFileSync(imgList.folder + 'list', stringify(dataLists[imgList.folder]), 'utf-8');
      imgList = imgListQueue.pop();
    }
  };

  await downloadImages(imageQueue, pushImgList, tickImgList);

  console.log(
    `Se han salteado ${invalid +
      useless +
      already} imagenes, de las cuales ${already} ya se encontraban descargadas, ${useless} no eran necesarias,\ny ${invalid} no correspondian a ninguna publicacion`
  );

  console.log('Imagenes importadas');
}

async function main() {
  console.log('Se ha empezado la importacion. Esto podria tardar mucho!');
  console.log('El proceso puede ser terminado en cualquier momento sin efectos colaterales.');
  console.log('Solo se guardaran los pasos y fases completados.');
  console.log(`Para resetear el programa, borrar el archivo 'import.progress'.`);
  console.log('');

  bigDataFolder = `./${process.env.STORAGE}`;
  if (!existsSync(legacyFolder)) mkdirSync(legacyFolder);
  if (!existsSync(dataFolder)) mkdirSync(dataFolder);
  if (!existsSync(bigDataFolder)) mkdirSync(bigDataFolder);

  loadConfig();
  await mySqlInit();

  await nextStep(initialSetup, 'Configuracion de la base de datos');
  await nextStep(gpsImporter, 'Generacion de claves GPS');
  await nextStep(categoryImporter, 'Importando categorias y subcategorias');
  await nextStep(migrateUsers, 'Migracion de Usuarios');
  await nextStep(migratePublications, 'Migracion de Publicaciones');
  await nextStep(currencyTable, 'Importacion de Divisas');
  await nextStep(questionsTable, 'Importacion de Preguntas');
  await nextStep(imagesTable, 'Importacion de Imagenes');

  clearConfig();

  console.log('Importacion Finalizada');
}

export const importer = defer(main);
