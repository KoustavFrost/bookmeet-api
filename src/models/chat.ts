import mongoose from 'mongoose';
import { IChat } from '../interfaces/IChat';
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

const Chat = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
    to: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
    message: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IChat & mongoose.Document>('Chat', Chat);
