import { SocketIoEvent, isAuth } from '../../types/socketTypes';
import { Logger } from 'winston';
import { Container } from 'typedi';
import ChatService from '../Chat.service';
import AuthService from '../auth';
import socketValidator from '../../validators/socketValidators';
import { map } from 'lodash';

const authSocket = (app: any, socket: any) => {
  const handlers = {
    [SocketIoEvent.SOCKET_AUTH]: socketAuth(app, socket),
  };

  return handlers;
};

// Events
const socketAuth = (app, socket) => (data) => {
  const logger: Logger = Container.get('logger');
  logger.debug('booksmeet:authSocket:socketAuth');

  let returnData: any = '';

  try {
    logger.debug('booksmeet:authSocket:socketAuth:data:: %o', JSON.stringify(data));
    const { token } = data;
    const authServiceInstance = Container.get(AuthService);
    const isAuth: isAuth = authServiceInstance.validateToken(token);
    console.log('isauth -----> ', isAuth);
    const userId = isAuth._id;

    const socketId: string = socket.id;

    if (app.has(socketId)) {
      // If found, then update the auth and emit to channel
      app.set(socketId, { ...app.get(socketId), isAuth: true, userId });
      socket.emit(SocketIoEvent.SOCKET_AUTH, 'Auth Complete!');
    } else {
      socket.emit('Some error has occured while auth!');
    }
  } catch (error) {
    returnData = { err: error.message };
    logger.error('booksmeet:authSocket:socketAuth:error:: %o', JSON.stringify(returnData));
  }
};

export default authSocket;
