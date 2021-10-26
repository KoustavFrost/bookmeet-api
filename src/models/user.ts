import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';
import { DefaultCountry, Roles, ActiveStatus } from '../config/constants';
mongoose.set("useFindAndModify", false);

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    phoneNo: String,
    image: String,
    googleId: String,
    firebaseToken: String,
    location: [{
      state: String,
      country: {
        type: String,
        default: DefaultCountry.INDIA
      }
    }],
    role: {
      type: String,
      default: Roles.USER
    },
    status: {
      type: String,
      default: ActiveStatus.ACTIVE
    },
    lastLogin: Date
  },
  { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);
