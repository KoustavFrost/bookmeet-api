import { Service, Inject } from 'typedi';
import { IListing, IListingInputDTO } from '../interfaces/IListing';
import { IUser } from '../interfaces/IUser';
import i18next from 'i18next';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import CommonService from './common';

@Service()
export default class ListingService extends CommonService {
  constructor(
    @Inject('listingModel') private listingModel: Models.ListingModel,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    super();
    this.initiatePerformanceLogger();
  }

  public async createListing(
    data: IListingInputDTO,
    images: string[],
    currentUser: IUser,
  ): Promise<{ message: string }> {
    this.logger.info('====Creating the listing: %s====', data);
    this.startPerformanceLogging();

    try {
      const query = {
        userId: currentUser._id,
        ...data,
        images: images,
      };
      const listing = await this.listingModel.create(query);

      if (!listing) {
        this.logger.error('Failed to create Listing');
        throw new Error(i18next.t('listing.error'));
      }

      return { message: i18next.t('listing.create') };
    } catch (error) {
      this.logger.error(error);
      this.endPerformanceLogging('Create listing');
      throw error;
    }
  }

  public async getLandingPageListings(): Promise<{ listings: any; message: string }> {
    this.logger.info('==== fetching landing page listings ====');
    this.startPerformanceLogging();

    try {
      const listings = await this.listingModel
        .find()
        .sort({
          createdAt: -1,
        })
        .limit(4);

      if (!listings) {
        this.logger.error('Failed to fetch listing for the landing page');
        throw new Error(i18next.t('listing.error'));
      }

      return { listings, message: i18next.t('listing.landing') };
    } catch (error) {
      this.logger.error(error);
      this.endPerformanceLogging('Get landing page listing');
      throw error;
    }
  }

  public async getListingById(id: string): Promise<{ listing: IListing; message: string }> {
    this.logger.info('==== Fetching listing by id ====');
    this.startPerformanceLogging();

    try {
      let listing: IListing = await this.listingModel.findById(id);

      return { listing, message: 'OK' };
    } catch (error) {
      this.logger.error(error);
      this.endPerformanceLogging('Get listing by id');
      throw error;
    }
  }

  // Function to update listing
  public async updateListing(data: IListingInputDTO, images: string[], id: string): Promise<{ message: string }> {
    this.logger.info('====Updating the listing: %s====', data);
    this.startPerformanceLogging();

    try {
      console.log('id ----------> ', id);
      const query = {
        ...data,
        images: images,
      };

      console.log('query ----------> ', query);
      // @todo: Debug once why update listing is not working in standard way
      const listing = await this.listingModel.findOneAndUpdate({ _id: id }, { query });
      console.log('listing ----------> ', listing);

      if (!listing) {
        this.logger.error('Failed to update Listing');
        throw new Error(i18next.t('listing.error'));
      }

      return { message: i18next.t('listing.update') };
    } catch (error) {
      this.logger.error(error);
      this.endPerformanceLogging('Update Listing');
      throw error;
    }
  }

  // Function to get all the listing for the current user
  public async getCurrentUserListing(currentUser: IUser): Promise<{ listings?: IListing[]; message: string }> {
    this.logger.info('====Fetching the listing for the current user ====');
    this.startPerformanceLogging();

    try {
      const query = {
        userId: currentUser._id,
      };

      const listings = await this.listingModel.find(query);

      if (!listings) {
        throw new Error(i18next.t('listing.noListing'));
      }

      return { listings, message: i18next.t('general.success') };
    } catch (error) {
      this.logger.error(error);
      this.endPerformanceLogging('Current user listing');
      throw error;
    }
  }

  // @todo: Create a function to check whether the current user has more than 2 listings or not
}
