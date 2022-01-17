import { BookConditions, ListingStatus } from '../config/constants';

export interface IListing {
  _id: string;
  name: string;
  author: string;
  genre: [];
  publisher: string;
  isbn: string;
  synopsys: string;
  language: string;
  condition: BookConditions;
  images: [];
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
