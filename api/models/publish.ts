import { tagType, Category, Subcategory } from '../data';

export interface ListablePublication {
  id: number;
  date: Date;
  name: string;
  price: string;
  publisher: string;
  state: string;
  category: Category;
  subcategory: Subcategory;
  duration: string;
}

export enum PublicationState {
  Pendiente = 0,
  Publicada = 1,
  Pausada = 2,
  Finalizada = 3
}

export const publication_states: PublicationState[] = [0, 1, 2, 3];

export function toString(state: PublicationState) {
  switch (state) {
    case PublicationState.Pendiente:
      return 'Pendiente';
    case PublicationState.Publicada:
      return 'Publicada';
    case PublicationState.Pausada:
      return 'Pausada';
    case PublicationState.Finalizada:
      return 'Finalizada';
    default:
      return 'ERROR';
  }
}

export interface Preview {
  id: number;
  user: number;
  name: string;
  price?: number;
  currency: number;
  condition: boolean;
  gps: number;
  views: number;
  tags: tagType[];
  userName: string;
}

export interface PublishSeed {
  id?: number;
  name: string;
  price: number | 'free';
  category: number;
  subcategory: number;
  description: string;
  condition: boolean;
  gps: number;
  currency: number;
  duration: number;
  images: string[];
}

export interface Publish {
  id: number;
  name: string;
  price?: number;
  category: number;
  subcategory: number;
  isNew: boolean;
  isFresh: boolean;
  isEnding: boolean;
  isTrending: boolean;
  daysLeft: number;
  gps: number;
  currency: number;
  views: number;
  images: string[];
  publisher: {
    id: number;
    name: string;
    isPremium: boolean;
    isTrusted: boolean;
    gps?: number;
    area_code?: number;
    cellphone?: number;
    publications: number;
  };
}
