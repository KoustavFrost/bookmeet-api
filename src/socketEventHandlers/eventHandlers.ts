import { Server } from 'socket.io';
import middlewares from '../api/middlewares';
import { AppData, SocketIoEvent } from '../types/socketTypes';
import singleChat from '../services/socketService/SingleChat';
import authSocket from '../services/socketService/SocketAuth';
import { Logger } from 'winston';

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
// TODO: Add the winston logger here

export const globalSocketsMap = new Map();

export default (io: Server): void => {
  const nsp = io.of('/socket');
  nsp.on('connection', async (socket: any) => {
    const eventHandlers = [singleChat(globalSocketsMap, socket), authSocket(globalSocketsMap, socket)];

    // Getting the socket id
    const socketId = socket.id;
    globalSocketsMap.set(socketId, {
      isAuth: false,
      socket,
    });

    // Bind events to handlers
    eventHandlers.forEach((handler) => {
      for (const eventName in handler) {
        socket.on(eventName, handler[eventName]);
      }
    });

    socket.on(SocketIoEvent.DISCONNECT, () => {
      globalSocketsMap.delete(socketId);
      console.log('Client disconnected');
    });
    console.log(globalSocketsMap);
  });
};
