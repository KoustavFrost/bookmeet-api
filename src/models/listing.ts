import { IListing } from '../interfaces/IListing';
import mongoose from 'mongoose';
import { BookConditions, ListingStatus } from '../config/constants';
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

const Listing = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      required: true,
      type: String,
    },
    author: {
      required: true,
      type: String,
    },
    genre: {
      type: [String],
      required: true,
    },
    publisher: {
      required: true,
      type: String,
    },
    isbn: {
      required: true, // need to rethink about this once
      type: String,
      index: true,
    },
    synopsys: {
      type: String,
    },
    language: {
      type: String,
    },
    condition: {
      type: String,
      enum: BookConditions,
      required: true,
    },
    images: {
      type: Array,
    },
    status: {
      status: {
        type: String,
        enum: ListingStatus,
        default: ListingStatus.ACTIVE,
      },
      reason: {
        type: String,
        required: true,
        default: 'This listing is active.',
      },
    },
    city: {
      required: true,
      type: String,
    },
    state: {
      required: true,
      type: String,
    },
    country: {
      type: String,
      default: 'india',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IListing & mongoose.Document>('Listing', Listing);
