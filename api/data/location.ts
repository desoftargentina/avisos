export interface City {
  id: number;
  name: string;
  code: string;
}
export interface State {
  id: number;
  name: string;
  cities: { [id: number]: City };
}
export interface Country {
  id: number;
  name: string;
  code: string;
  states: { [id: number]: State };
}
export const countries: { [key: number]: Country } = {
  1: {
    id: 1,
    code: '0054',
    name: 'Argentina',
    states: {
      1: {
        id: 1,
        name: 'Entre Ríos',
        cities: {
          1: { id: 1, code: '0', name: 'Basavilbaso' },
          2: { id: 2, code: '0', name: 'Chajarí' },
          3: { id: 3, code: '0', name: 'Colón ' },
          4: { id: 4, code: '0', name: 'San José' },
          5: { id: 5, code: '0', name: 'C del Uruguay' },
          6: { id: 6, code: '0', name: 'Concordia' },
          7: { id: 7, code: '0', name: 'Diamante' },
          8: { id: 8, code: '0', name: 'Federación' },
          9: { id: 9, code: '0', name: 'Federal' },
          10: { id: 10, code: '0', name: 'Gualeguay' },
          11: { id: 11, code: '0', name: 'Gualeguaychú' },
          12: { id: 12, code: '0', name: 'Ibicuy' },
          13: { id: 13, code: '0', name: 'La Paz' },
          14: { id: 14, code: '0', name: 'María Grande' },
          15: { id: 15, code: '0', name: 'Nogoyá' },
          16: { id: 16, code: '0', name: 'Paraná' },
          17: { id: 17, code: '0', name: 'Rosario del Tala' },
          18: { id: 18, code: '0', name: 'Victoria' },
          19: { id: 19, code: '0', name: 'Villa Elisa' },
          20: { id: 20, code: '0', name: 'Villa Paranacito' },
          21: { id: 21, code: '0', name: 'Villaguay' },
          22: { id: 22, code: '0', name: 'General Ramirez' },
          23: { id: 23, code: '0', name: 'Oro Verde' },
          24: { id: 24, code: '0', name: 'Crespo' },
          25: { id: 25, code: '0', name: 'VL San Martín' },
          26: { id: 26, code: '0', name: 'San Jose De Feliciano' },
          27: { id: 27, code: '0', name: 'Hasenkamp' },
          28: { id: 28, code: '0', name: 'Viale' },
          29: { id: 29, code: '0', name: 'Cerrito' },
          30: { id: 30, code: '0', name: 'Seguí' },
          31: { id: 31, code: '0', name: 'Villa Urquiza' },
          32: { id: 32, code: '0', name: 'San Benito' },
          33: { id: 33, code: '0', name: 'Piedras Blancas' },
          34: { id: 34, code: '0', name: 'Maciá' },
          35: { id: 35, code: '0', name: 'Sauce' },
          36: { id: 36, code: '0', name: 'Bovril' },
          37: { id: 37, code: '0', name: 'San Salvador' },
          38: { id: 38, code: '0', name: 'Santa Elena' },
          39: { id: 39, code: '0', name: 'Otras Localidades' }
        }
      }
    }
  },
  2: {
    id: 2,
    name: 'Cuba',
    code: '0053',
    states: {
      1: {
        id: 1,
        name: 'Habana',
        cities: {
          1: {
            id: 1,
            code: '9100',
            name: 'Ciudad Habana'
          }
        }
      }
    }
  }
};
export default countries;
