import Gps from '../utils/gps';

export interface FullProfile {
  subdomain: string;
  name: string;
  gps: number;
}

export interface Profile {
  name: string;
  gps: number;
}

export const profiles: { [key: string]: Profile } = {
  argentina: {
    name: 'Entre Ríos',
    gps: Gps.serialize({ country: 1, state: 1 })
  },
  cuba: {
    name: 'Cuba',
    gps: Gps.serialize({ country: 2 })
  }
};
