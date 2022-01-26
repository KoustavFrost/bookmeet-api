import { Roles, DefaultCountry } from '../config/constants';
export interface IUser {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  image: string;
  googleId: string;
  firebaseToken: string;
  location: { state: string; country: DefaultCountry.INDIA };
  role: Roles;
  isActive: boolean;
  hasUpdatedProfile: boolean;
  status: string;
  lastLogin: Date;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  phoneNo: string;
  image: string;
  googleId: string;
  firebaseToken: string;
  location: { state: string; country: DefaultCountry.INDIA };
  role: Roles;
  isActive: boolean;
  hasUpdatedProfile: boolean;
  status: string;
  lastLogin: Date;
}
