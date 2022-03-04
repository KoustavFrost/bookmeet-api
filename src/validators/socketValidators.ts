import { SocketIoEvent } from '../types/socketTypes';

class SocketValidator {
  public singleChatValidator(chatData, socket) {
    const requiredFields = ['from', 'to', 'message'];
    for (const key of requiredFields) {
      if (!chatData[key]) {
        const returnData = {
          name: 'validationError',
          message: `${key} is not present`,
          status: 400,
        };
        socket.emit(SocketIoEvent.SINGLE_CHAT, returnData);
        throw new Error('SOCKET_ERROR');
      }
    }
  }
}

const socketValidator = new SocketValidator();
export default socketValidator;
