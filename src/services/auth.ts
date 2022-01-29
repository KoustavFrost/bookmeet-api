import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';
import { Document } from 'mongoose';
import admin from 'firebase-admin';
import { ActiveStatus } from '../config/constants';
import i18next from 'i18next';

@Service()
export default class AuthService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    private mailer: MailerService,
    @Inject('logger') private logger,
    @Inject('privateJWTRS256Key') private privateJWTRS256Key,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Inject('firebaseAdmin') private firebaseAdmin: admin.app.App,
  ) {}

  public async googleSignIn(data: any): Promise<{ user: IUser; token: string; message: string }> {
    const updateUser = async (id: string, userDataToUpdate: any) => {
      return await this.userModel.findByIdAndUpdate(id, { ...userDataToUpdate, lastLogin: new Date() }, { new: true });
    };

    try {
      const userExists = await this.userModel.findOne({ email: data.email });

      let userRecord;
      let isNew = false;

      if (userExists) {
        if (!userExists.hasUpdatedProfile) {
          userRecord = await updateUser(userExists._id, {
            image: data.photoUrl,
            name: data.name,
          });
        } else {
          userRecord = userExists;
        }
      } else {
        let userdata: any = {
          image: data.photoUrl,
          name: data.name,
          googleId: data.uid,
          email: data.email,
        };
        userRecord = await this.userModel.create(userdata);
        isNew = true;
      }

      if (!userRecord) {
        throw new Error(i18next.t('userCreationFailed'));
      }

      if (userRecord.status === ActiveStatus.INACTIVE) {
        throw new Error(i18next.t('inactiveAccount'));
      }

      this.logger.silly('Generating JWT');
      const user = userRecord.toObject();
      const token = this.generateToken({ ...user, isGoogleSignin: true });

      return { user, token, message: i18next.t('signInSuccess') };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private generateToken(user) {
    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        isGoogleSignin: user.isGoogleSignin || false,
      },
      this.privateJWTRS256Key,
      { algorithm: 'RS256' },
    );
  }
}
