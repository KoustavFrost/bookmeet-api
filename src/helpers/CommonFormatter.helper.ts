import { IChatInputDTO } from '../interfaces/IChat';
class CommonFormatter {
  public formatChatInput(data, fromUser): IChatInputDTO {
    return {
      to: data.to,
      from: fromUser,
      message: data.message,
    };
  }
}

const commonFormatter = new CommonFormatter();
export default commonFormatter;
