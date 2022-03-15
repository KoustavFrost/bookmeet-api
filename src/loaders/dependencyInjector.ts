import { readFileSync } from 'fs';
import { Container } from 'typedi';
import LoggerInstance from './logger';
import * as admin from 'firebase-admin';
const serviceAccount = require('../../serviceAccount.json');
import S3 from 'aws-sdk/clients/s3';
import config from '../config';

export default async ({ models }: { models: { name: string; model: any }[] }): Promise<any> => {
  try {
    models.forEach((m) => {
      Container.set(m.name, m.model);
    });

    // Initializing the service acount for firebase
    let app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    const privateJWTRS256Key = readFileSync('./keys/jwtRS256.key');
    const publicJWTRS256Key = readFileSync('./keys/jwtRS256.key.pub');
    Container.set('privateJWTRS256Key', privateJWTRS256Key);
    Container.set('publicJWTRS256Key', publicJWTRS256Key);
    Container.set('firebaseAdmin', app);

    const s3 = new S3({
      accessKeyId: config.awsAccesskey,
      secretAccessKey: config.awsSecretKey,
    });

    Container.set('s3', s3);

    Container.set('logger', LoggerInstance);
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
