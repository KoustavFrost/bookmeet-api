import { SocketIoEvent } from '../types/socketTypes';
import { Logger } from 'winston';
import { Container } from 'typedi';

const singleChatSocket = (app: any, socket: any) => {
  const handlers = {
    [SocketIoEvent.SINGLE_CHAT]: singleChat(app, socket),
  };

  return handlers;
};

// Events
const singleChat = (app, socket) => (data) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Inside the goOnline function');

  let returnData: any = '';

  try {
    logger.debug('Data -> %o', JSON.stringify(data));
    console.log('to --> ', data.to);

    for (let soc of app) {
      const toUserId = soc.userdata._id;
      if (toUserId.toString() === data.to) {
        console.log('send ---> ');
        soc.socket.emit(SocketIoEvent.SINGLE_CHAT, data.message);
      }
    }
    // socket.emit(SocketIoEvent.SINGLE_CHAT, 'MSG RCV');
  } catch (error) {
    returnData = { err: error.message };
    logger.error('🔥 error: %o', returnData);
  }
};

export default singleChatSocket;
