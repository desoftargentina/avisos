import Gps from '../utils/gps';

export interface IUserForm {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  level: number;
  gps?: number;
  genre?: boolean; // True for Male
  country_code?: string;
  area_code?: string;
  cellphone?: string;
}

export interface IUserCredentials {
  firstname: string;
  lastname: string;
  email: string;
  pass: string;
}

export interface IUserPreview {
  id: number;
  name: string;
  gps?: number;
  isPremium?: boolean;
  isTrusted?: boolean;
  publications: number;
}

export class User implements IUserForm {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  level: number;
  gps?: number;
  country?: number;
  state?: number;
  city?: number;
  genre?: boolean; // True for Male
  country_code?: string;
  area_code?: string;
  cellphone?: string;

  constructor(user: IUserForm) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.gps = user.gps;
    const location = Gps.deserialize(user.gps);
    this.country = location.country;
    this.state = location.state;
    this.city = location.city;
    this.genre = user.genre;
    this.country_code = user.country_code;
    this.area_code = user.area_code;
    this.cellphone = user.cellphone;
    this.level = user.level;
  }

  get fullname() {
    return this.lastname
      .split(' ')[0]
      .concat(', ')
      .concat(this.firstname);
  }

  get isAdmin() {
    return this.level === 0;
  }
}
