import { Logger } from 'winston';
import { Container } from 'typedi';
import admin from 'firebase-admin';

const getTokenFromHeader = req => {
  if (
    req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};
const isFirebaseAuth = async (req, res, next) => {
  const Logger: Logger = Container.get('logger');
  try {
    let token: string = getTokenFromHeader(req).trim();
    if (token) {
      const app: admin.app.App = Container.get('firebaseAdmin');

      const decodedToken = await app.auth().verifyIdToken(token);
      req.firebaseUserUid = decodedToken.uid;
      return next();
    } else {
      return res.status(403).json({
        errors: {
          message: 'Forbidden',
        },
      });
    }
  } catch (e) {
    Logger.error('🔥 Error checking  isFirebaseAuth: %o', e);
    return next(e);
  }
};

export default isFirebaseAuth;
