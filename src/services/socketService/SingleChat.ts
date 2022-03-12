import { SocketIoEvent } from '../../types/socketTypes';
import { Logger } from 'winston';
import { Container } from 'typedi';
import ChatService from '../Chat.service';
import socketValidator from '../../validators/socketValidators';

const singleChatSocket = (app: any, socket: any) => {
  const handlers = {
    [SocketIoEvent.SINGLE_CHAT]: singleChat(app, socket),
  };

  return handlers;
};

// Events
const singleChat = (app, socket) => (data) => {
  const logger: Logger = Container.get('logger');
  logger.debug('booksmeet:singleChat:singleChat');

  let returnData: any = '';

  try {
    const socketId: string = socket.id;
    if (app.has(socketId)) {
      const socketData = app.get(socketId);

      if (!socketData.isAuth) {
        socket.emit(SocketIoEvent.SINGLE_CHAT, 'Not Authorised');
        return;
      }
    }

    logger.debug('booksmeet:singleChat:singleChat:data:: %o', JSON.stringify(data));

    socketValidator.singleChatValidator(data, socket);

    const chatServiceInstance = Container.get(ChatService);
    chatServiceInstance.insertChat(data);

    console.log('map ---> ', app);

    for (let [, soc] of app) {
      const toUserId = soc.userId;
      logger.debug('booksmeet:singleChat:singleChat:toUserId:: %o', { toUserId });

      if (toUserId && toUserId === data.to) {
        soc.socket.emit(SocketIoEvent.SINGLE_CHAT, data.message);
        logger.debug('booksmeet:singleChat:singleChat:toUserId: send complete %o', { toUserId });
      }
    }
  } catch (error) {
    returnData = { err: error.message };
    logger.error('🔥 error: %o', returnData);
  }
};

export default singleChatSocket;
