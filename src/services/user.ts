import { Service, Inject } from 'typedi';
import { IUser } from '../interfaces/IUser';
import _ from 'lodash';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import i18next from 'i18next';

@Service()
export default class UserService {
  constructor(@Inject('userModel') private userModel: Models.UserModel, @Inject('logger') private logger) {}

  public async getAllUsers(currentUser: IUser, userId: string): Promise<{ users: IUser[] | IUser }> {
    // Find all users
    // TODO: exclude admins, I want only I can see admin users
    try {
      let users;
      if (userId) {
        const user = await this.userModel.findOne({ _id: userId });
        users = user.toObject();
      } else {
        users = await this.userModel.find();
      }
      if (_.isEmpty(users)) {
        throw new Error('Users/Users doesnt exists');
      }
      return { users };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async updateUser(
    currentUser: IUser,
    name: string,
    phoneNo: string,
    state: string,
    imagePath: string,
  ): Promise<{ message: string }> {
    try {
      let user = await this.userModel.findById(currentUser._id);

      if (!user) {
        // User does not exists
        throw new Error(i18next.t('userDoesNotExists'));
      }

      // Find a better way to do this
      if (name) user.name = name;
      if (phoneNo) user.phoneNo = phoneNo;
      if (state) user.location.state = state;
      if (imagePath) user.image = imagePath; // For now images are kept in local

      await user.save();

      return { message: i18next.t('updatedUser') };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
    return;
  }

  public async removeProfileImage(currentUser: IUser): Promise<{ message: string }> {
    try {
      let user = await this.userModel.findById(currentUser._id);

      if (!user) {
        // User does not exists
        throw new Error(i18next.t('userDoesNotExists'));
      }

      user.image = '';

      await user.save();

      return { message: i18next.t('removedProfileImage') };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
