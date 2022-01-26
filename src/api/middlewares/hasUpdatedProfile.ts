import i18next from 'i18next';
import { Container } from 'typedi';
import { Logger } from 'winston';
import UserService from '../../services/user';

const hasUpdatedProfile = async (req, res, next) => {
  const Logger: Logger = Container.get('logger');
  const userId = req.currentUser._id;
  const userServiceInstance = Container.get(UserService);
  const returnData: boolean = await userServiceInstance.checkUpdatedProfile(userId);
  if (!returnData) {
    Logger.error('🔥 error: %o', i18next.t('profileNotUpdated'));
    return res.status(401).json({ message: i18next.t('profileNotUpdated') });
  } else {
    next();
  }
};

export default hasUpdatedProfile;
