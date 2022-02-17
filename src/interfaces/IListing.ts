import { BookConditions, ListingStatus } from '../config/constants';
import { IUser } from './IUser';

export interface IListing {
  _id: string;
  userId: string | IUser;
  name: string;
  author: string;
  genre: [];
  publisher: string;
  isbn: string;
  synopsys: string;
  language: string;
  condition: BookConditions;
  images: any;
  status: {
    status: ListingStatus;
    reason: string;
  };
  city: string;
  state: string;
  country: string;
}

export interface IListingInputDTO {
  name: string;
  author: string;
  genre: [];
  publisher: string;
  isbn: string;
  synopsys?: string;
  language?: string;
  condition: BookConditions;
  city: string;
  state: string;
}
