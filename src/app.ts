import 'reflect-metadata'; // We need this in order to use @Decorators

import config from './config';

import express from 'express';

import Logger from './loaders/logger';

import { readFileSync } from 'fs';

async function startServer() {
  const app = express();

  await require('./loaders').default({ expressApp: app });

  const server = app
    .listen(config.port, () => {
      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    })
    .on('error', (err) => {
      Logger.error(err);
      process.exit(1);
    });

  // const https = require('https');
  // const options = {
  //   key: readFileSync('./keys/key.pem'),
  //   cert: readFileSync('./keys/cert.pem')
  // };

  // https.createServer(options, app).listen(config.port, () => {
  //   Logger.info(`
  //     ################################################
  //     🛡️  Server listening on port: ${config.port} 🛡️
  //     ################################################
  //   `);
  // }).on('error', err => {
  //   Logger.error(err);
  //   process.exit(1);
  // });
}

startServer();
