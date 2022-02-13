import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import { Logger } from 'winston';
import { celebrate, Joi, Segments } from 'celebrate';
import ListingService from '../../services/listing';
import { IListingInputDTO } from '../../interfaces/IListing';
import commonValidators from '../../validators/commonValidators';

const route = Router();

export default (app: Router) => {
  app.use('/listing', route);

  // Route to create a listing
  route.post(
    '/create',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.hasUpdatedProfile,
    middlewares.imageUpload.array('images', 5),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling create listing end point -> %s', req.body);

      try {
        // Required fields
        const requiredFields: string[] = ['name', 'author', 'genre', 'publisher', 'isbn', 'condition', 'city', 'state'];
        // Validation
        commonValidators.objectValidator(req.body, requiredFields as string[]);

        const images: string[] = [];
        if (req.files) {
          // User has uploaded images
          for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            // Create a path here with the valid image url
            images.push(file.path);
          }
        }
        const listingServiceInstance = Container.get(ListingService);
        const { message } = await listingServiceInstance.createListing(
          req.body as IListingInputDTO,
          images,
          req.currentUser,
        );
        return res.json({ message }).status(200);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  // Route to fetch top 4 listing for the landing page
  route.get('/landing', async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('In fetch lisings for the landing page api');
    try {
      const listingServiceInstance = Container.get(ListingService);
      const { listings, message } = await listingServiceInstance.getLandingPageListings();

      return res.json({ listings, message }).status(200);
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });

  // Route to get listing by listing id
  route.get(
    '/getlisting/:id',
    celebrate({
      [Segments.PARAMS]: Joi.object({
        id: Joi.required().messages({
          'required.base': `Please pass a listing id`,
        }),
      }),
    }),

    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.info('In fetching listing details by listing id --> %o', req.params);
      try {
        const { id } = req.params;
        const listingServiceInstance = Container.get(ListingService);
        const { listing, message } = await listingServiceInstance.getListingById(id);

        return res.json({ listing, message }).status(200);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  // Routes to update the listings by form data
  route.post(
    '/update/:id',
    celebrate({
      [Segments.PARAMS]: Joi.object({
        id: Joi.required().messages({
          'required.base': `Please pass a listing id`,
        }),
      }),
    }),
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.hasUpdatedProfile,
    middlewares.imageUpload.array('images', 5),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling update listing end point -> %s', req.body);

      try {
        // Required fields
        const requiredFields: string[] = ['name', 'author', 'genre', 'publisher', 'isbn', 'condition', 'city', 'state'];
        // Validation
        commonValidators.objectValidator(req.body, requiredFields as string[]);

        req.body.genre = req.body.genre.split(',');

        const images: string[] = [];
        if (req.files) {
          // User has uploaded images
          for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            // Create a path here with the valid image url
            images.push(file.path);
          }
        }

        // Getting the id as params
        const { id } = req.params;
        const listingServiceInstance = Container.get(ListingService);
        const { listing, message } = await listingServiceInstance.updateListing(
          req.body as IListingInputDTO,
          images,
          id,
        );
        return res.json({ listing, message }).status(200);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  // Get all the listings for the current user
  route.get(
    '/currentuser/getall/listing',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.hasUpdatedProfile,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling get all listing for the current user end point');

      try {
        const listingServiceInstance = Container.get(ListingService);
        const { listings, message } = await listingServiceInstance.getCurrentUserListing(req.currentUser);

        return res.json({ listings, message }).status(200);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
