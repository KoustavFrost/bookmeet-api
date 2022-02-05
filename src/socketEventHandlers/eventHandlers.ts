import { Server } from 'socket.io';
import middlewares from '../api/middlewares';
import { AppData, SocketIoEvent } from '../types/ts/Socket.Types';

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

// --------------------------------------
// -------- SOCKET.IO handlers ----------
// --------------------------------------

export const app: AppData = {
  allSockets: [],
};

// structure inspired by
// https://stackoverflow.com/questions/20466129/how-to-organize-socket-handling-in-node-js-and-socket-io-app
export default (io: Server): void => {
  const nsp = io.of('/socket');
  // nsp.use(wrap(middlewares.isAuth));
  // nsp.use(wrap(middlewares.attachCurrentUser));

  nsp.on('connection', async (socket: any) => {
    // console.log('User ', socket.request.currentUser._id, ' Connected to socket');
    console.log('User Connected to socket');

    socket.on(SocketIoEvent.DISCONNECT, () => {
      console.log('Client disconnected');
    });

    // Keep track of the socket
    app.allSockets.push(socket);
  });
};
