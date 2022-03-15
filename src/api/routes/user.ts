import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Container } from 'typedi';
import UserService from '../../services/user';
import { Logger } from 'winston';
import { IUser } from '../../interfaces/IUser';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  // Details of current user
  route.get(
    '/me',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling get current user endpoint %o', req.currentUser);
      try {
        const userServiceInstance = Container.get(UserService);
        const user: IUser = await userServiceInstance.getCurrentUser(req.currentUser);
        return res.status(201).json({ user });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  // Details of an user based on id
  route.get(
    '/:id?',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling users endpoint');
      try {
        const { id } = req.params;
        const userServiceInstance = Container.get(UserService);
        const { user } = await userServiceInstance.getUserById(id);
        return res.status(201).json({ user });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  // Update current user details
  route.post(
    '/update',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.imageUpload.array('images', 1),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling update user end point with user details of -> ', req.body);
      try {
        const userServiceInstance = Container.get(UserService);
        const { name, phoneNo, state } = req.body;
        console.log('files --------> ', req.files[0]);
        const { user, message } = await userServiceInstance.updateUser(
          req.currentUser,
          name,
          phoneNo,
          state,
          req.files[0] ? req.files[0] : '',
        );
        return res.status(201).json({ user, message });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  // Function to remove profile image
  route.get(
    '/remove/profileimage',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling remove profile image --> ', req.currentUser);
      try {
        const userServiceInstance = Container.get(UserService);
        const { message } = await userServiceInstance.removeProfileImage(req.currentUser);
        return res.status(201).json({ message });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
