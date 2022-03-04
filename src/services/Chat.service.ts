import { Service, Inject } from 'typedi';
import i18next from 'i18next';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import CommonService from './common';
import { IChatInputDTO } from '../interfaces/IChat';

@Service()
export default class ChatService extends CommonService {
  constructor(
    @Inject('chatModel') private chatModel: Models.ChatModel,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    super();
    this.initiatePerformanceLogger();
  }

  public async insertChat(data: IChatInputDTO) {
    this.logger.info('booksmeet:chatService:insertChat:data:: %o', JSON.stringify(data));
    this.startPerformanceLogging();
    try {
      await this.chatModel.create(data);
    } catch (error) {
      this.logger.error(error);
      this.endPerformanceLogging('booksmeet:chatService:insertChat');
      throw error;
    }
  }
}
