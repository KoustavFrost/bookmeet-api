import { Roles, DefaultCountry, ActiveStatus } from '../config/constants';
export interface IUser {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  image: string;
  googleId: string;
  firebaseToken: string;
  location?: { state: string, country: DefaultCountry }[];
  role: Roles;
  status: ActiveStatus;
  lastLogin: Date;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  phoneNo: string;
  image: string;
  googleId: string;
  firebaseToken: string;
  location?: { state: string, country: DefaultCountry }[];
  role: Roles;
  status: ActiveStatus;
  lastLogin: Date;
}
