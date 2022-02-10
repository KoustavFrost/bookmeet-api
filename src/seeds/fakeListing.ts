import mongoose, { Document, Model } from 'mongoose';
import config from '../config';
import { IListing } from '../interfaces/IListing';
import Logger from '../loaders/logger';

const arrConfig = [];

(async () => {
  Logger.info(`
  ################################################
            🛡️  Start adding configs 🛡️
  ################################################
`);
  try {
    await mongoose.connect(config.databaseURL);
    Logger.info('✌️ DB loaded and connected!');

    const listingModel: Model<IListing & Document> = require('../models/listing').default;

    const bulkOps = [];

    // Update the config if exists, if it doesnt exist then upsert the config data
    arrConfig.forEach((config) => {
      const doc = {
        updateOne: {
          filter: { type: config.type, name: config.name },
          update: { $set: config },
          upsert: true,
        },
      };
      bulkOps.push(doc);
    });

    const bulkWriteOpResult = await listingModel.collection.bulkWrite(bulkOps);
    Logger.info(JSON.stringify(bulkWriteOpResult, null, 2));
    Logger.info('Configs insert/update OK');
  } catch (error) {
    Logger.error(error);
  }
  process.exit(0);
})();
