import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IListing } from '../../interfaces/IListing';

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type ListingModel = Model<IListing & Document>;
  }
}
