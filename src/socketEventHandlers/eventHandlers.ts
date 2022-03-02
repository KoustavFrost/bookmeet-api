import { Server } from 'socket.io';
import middlewares from '../api/middlewares';
import { AppData, SocketIoEvent } from '../types/socketTypes';
import singleChat from '../services/SingleChat.service';

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
// TODO: Add the winston logger here
// --------------------------------------
// -------- SOCKET.IO handlers ----------
// --------------------------------------

// TODO: Change this global socket to a map to redeuce time complexity
export const globalSockets = [];

// structure inspired by
// https://stackoverflow.com/questions/20466129/how-to-organize-socket-handling-in-node-js-and-socket-io-app
export default (io: Server): void => {
  const nsp = io.of('/socket');
  nsp.use(wrap(middlewares.isAuth));
  nsp.use(wrap(middlewares.attachCurrentUser));

  nsp.on('connection', async (socket: any) => {
    const eventHandlers = [singleChat(globalSockets, socket)];
    console.log('eventHandlers --> ', eventHandlers);

    console.log('User ', socket.request.currentUser._id, ' Connected to socket');

    // Bind events to handlers
    eventHandlers.forEach((handler) => {
      console.log('handler --> ', handler);
      for (const eventName in handler) {
        socket.on(eventName, handler[eventName]);
      }
    });

    socket.on(SocketIoEvent.DISCONNECT, () => {
      console.log('Client disconnected');
    });

    const socketData = { socket, userdata: socket.request.currentUser };

    // Keep track of the socket
    globalSockets.push(socketData);
  });
};
