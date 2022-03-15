import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  mailer: {
    username: process.env.MAILER_USERNAME,
    password: process.env.MAILER_PASSWORD,
  },

  imageUrl: process.env.IMAGE_URL || 'https://localhost:3000/',

  // AWS Credentials
  awsSecretKey: process.env.AWS_SECRET_KEY,
  awsAccesskey: process.env.AWS_ACCESS_KEY,
  s3ImgBucket: process.env.S3_BUCKET_NAME,
  s3BucketUrl: process.env.S3_BUCKET_URL,
};
