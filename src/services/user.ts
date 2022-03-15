import { Service, Inject } from 'typedi';
import { IUser } from '../interfaces/IUser';
import _ from 'lodash';
import i18next from 'i18next';
import CommonService from './common';
import config from '../config';
import { Roles } from '../config/constants';
@Service()
export default class UserService extends CommonService {
  constructor(@Inject('userModel') private userModel: Models.UserModel, @Inject('logger') private logger) {
    super();
    this.initiatePerformanceLogger();
  }

  public async getCurrentUser(currentUser: IUser): Promise<IUser> {
    this.logger.info('====Fetching the current user data ====');
    this.startPerformanceLogging();
    try {
      const user: IUser = await this.userModel.findById(currentUser._id);

      if (user.image) {
        user.image = `${config.imageUrl}${user.image}`;
      }

      return user;
    } catch (error) {
      this.logger.error(error);
      this.endPerformanceLogging('Current user listing');
      throw error;
    }
  }

  public async getUserById(userId: string): Promise<{ user: IUser }> {
    this.logger.info('Fetching the user details by id');
    this.startPerformanceLogging();

    try {
      const user: IUser = await this.userModel.findById(userId);

      if (!user) {
        throw new Error(i18next.t('userDoesNotExists'));
      }

      if (user.role === Roles.ADMIN) {
        throw new Error(`Permission Denied`);
      }

      if (user.image) {
        user.image = `${config.imageUrl}${user.image}`;
      }

      return { user };
    } catch (error) {
      this.logger.error(error);
      this.endPerformanceLogging('Current user listing');
      throw error;
    }
  }

  public async updateUser(
    currentUser: IUser,
    name: string,
    phoneNo: string,
    state: string,
    imagePath: any,
  ): Promise<{ user: IUser; message: string }> {
    try {
      this.logger.info('booksmeet:user:updateUser:Updating the userdata');
      let user = await this.userModel.findById(currentUser._id);

      if (!user) {
        // User does not exists
        throw new Error(i18next.t('userDoesNotExists'));
      }

      // Find a better way to do this
      if (name) user.name = name;
      if (phoneNo) user.phoneNo = phoneNo;
      if (state) user.location.state = state;
      if (imagePath) {
        const resizedImgBuffer = await this.resizeImage(imagePath);
        const uplaodedFile = await this.S3ImageUpload(resizedImgBuffer, imagePath.filename);
        user.image = uplaodedFile.Location;
      }
      if (!user.hasUpdatedProfile) user.hasUpdatedProfile = true;

      await user.save();

      return { user, message: i18next.t('updatedUser') };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
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

  public async checkUpdatedProfile(userId: string): Promise<boolean> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error(i18next.t('userDoesNotExists'));
      }
      return user.hasUpdatedProfile;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
