import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import AuthService from '../../services/auth';
import { IUserInputDTO } from '../../interfaces/IUser';
import middlewares from '../middlewares';
import { celebrate, Joi, Segments } from 'celebrate';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/userauthentication',
    celebrate({
      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
      }).unknown(),
      [Segments.BODY]: Joi.object({
        email: Joi.string().required(),
        uid: Joi.string().required(),
      }),
    }),
    // middlewares.firebaseIsAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling Google Sign-In endpoint with body: %o', req.body);
      try {
        const authServiceInstance = Container.get(AuthService);
        const { user, token, message } = await authServiceInstance.googleSignIn(req.body);
        return res.json({ user, token, message }).status(200);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  // /**
  //  * @TODO Let's leave this as a place holder for now
  //  * The reason for a logout route could be deleting a 'push notification token'
  //  * so the device stops receiving push notifications after logout.
  //  *
  //  * Another use case for advance/enterprise apps, you can store a record of the jwt token
  //  * emitted for the session and add it to a black list.
  //  * It's really annoying to develop that but if you had to, please use Redis as your data store
  //  */
  route.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
    try {
      //@TODO AuthService.Logout(req.user) do some clever stuff
      return res.status(200).end();
    } catch (e) {
      logger.error('🔥 error %o', e);
      return next(e);
    }
  });
};
