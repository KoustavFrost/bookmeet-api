import fs from 'fs';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { isArray } from 'lodash';
import { performance, PerformanceObserver } from 'perf_hooks';
let observer = null;
import sharp from 'sharp';
import S3 from 'aws-sdk/clients/s3';
import config from '../config';

export default class CommonService {
  initiatePerformanceLogger() {
    if (!observer) {
      const logger: Logger = Container.get('logger');
      observer = new PerformanceObserver((list, obs) => {
        const lists = list
          .getEntries()
          .forEach((entry) =>
            logger.info(
              `${entry.name} took ${entry.duration.toFixed(2)}ms / ${(entry.duration / 1000).toFixed(2)}s to complete`,
            ),
          );
        return lists;
      });
      observer.observe({ buffered: true, entryTypes: ['measure'] });
    }
  }

  startPerformanceLogging() {
    performance.mark('start');
  }

  endPerformanceLogging(apiName: string) {
    performance.mark('stop');
    performance.measure(apiName, 'start', 'stop');
  }

  // taken from: https://stackoverflow.com/a/43624637/8062849
  //takes dayIndex from sunday(0) to saturday(6)
  nextDate(dayIndex: number, date: Date) {
    let today = date;
    today.setDate(today.getDate() + ((dayIndex - 1 - today.getDay() + 7) % 7) + 1);
    today.setHours(0, 0, 0, 0);
    return today;
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  removeFileIfExists(filePath: string | string[], isDir = false) {
    const Logger: Logger = Container.get('logger');

    const removeFile = (filePath: string) => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          Logger.error('removeFileIfExists--Error while checking file stats: %s', err.message);
          return;
        }
        if (isDir) {
          fs.rm(filePath, { recursive: true }, (err) => {
            if (err) return Logger.error('removeFileIfExists--Error while unlinking folder: %s', err.message);
            Logger.info('removeFileIfExists--Folder successfully unlinked');
          });
        } else {
          fs.unlink(filePath, (err) => {
            if (err) return Logger.error('removeFileIfExists--Error while unlinking file: %s', err.message);
            Logger.info('removeFileIfExists--File successfully unlinked');
          });
        }
      });
    };

    if (isArray(filePath)) {
      filePath.forEach((file) => removeFile(file));
    } else {
      removeFile(filePath);
    }
  }

  // This function filter outs the unique season number from all the episodes and group into an array. Taken from: https://learnwithparam.com/blog/how-to-group-by-array-of-objects-using-a-key/
  public groupBy(array: any[], key: string) {
    // Return the end result
    return array.reduce((result, currentValue) => {
      let value = this.getPropByString(currentValue, key);
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[value] = result[value] || []).push(currentValue);
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  }

  // Taken from: https://stackoverflow.com/a/6906859/8062849
  getPropByString(obj: Record<string, any>, propString: string) {
    if (!propString) return obj;

    let prop: string,
      props = propString.split('.');

    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];

      var candidate = obj[prop];
      if (candidate !== undefined) {
        obj = candidate;
      } else {
        break;
      }
    }
    return obj[props[i]];
  }

  timeout(ms) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  async resizeBase64Image(fileBuffer: Buffer, originalImagePath = ''): Promise<Buffer> {
    const logger: Logger = Container.get('logger');
    logger.info('====Resize base64 image starts====');
    try {
      const buffer = await sharp(fileBuffer)
        .rotate()
        .jpeg({ quality: 25, force: false })
        .png({ force: false, quality: 10, adaptiveFiltering: true })
        .toBuffer();
      if (originalImagePath) {
        await sharp(buffer).toFile(originalImagePath);
      }
      logger.info('====Resize base64 image ends====');
      return buffer;
    } catch (error) {
      logger.error('Error resizing base64 image: %o', error);
    }
  }

  async resizeImage(file: Express.Multer.File): Promise<Buffer> {
    const logger: Logger = Container.get('logger');
    try {
      const buffer = await sharp(file.path)
        .rotate()
        .jpeg({ quality: 25, force: false })
        .png({ force: false, quality: 10, adaptiveFiltering: true })
        .toBuffer();
      return buffer;
    } catch (error) {
      logger.error('Error resizing image: %o', error);
    }
  }

  public async S3ImageUpload(imageBuffer: Buffer, imageName: string) {
    const logger: Logger = Container.get('logger');
    const s3: S3 = Container.get('s3');

    logger.info('booksmeet:commonService:S3ImageUpload: starting image upload');
    const params: S3.PutObjectRequest = {
      Bucket: config.s3ImgBucket,
      Key: imageName,
      Body: imageBuffer,
    };
    return new Promise<S3.ManagedUpload.SendData>((resolve, reject) => {
      s3.upload(params, (s3Err, data) => {
        logger.info('booksmeet:commonService:S3ImageUpload: end image upload');
        if (s3Err) return reject(s3Err);
        resolve(data);
      });
    });
  }
}
