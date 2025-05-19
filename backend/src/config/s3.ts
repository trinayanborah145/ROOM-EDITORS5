import AWS from 'aws-sdk';
import { logger } from '../utils/logger';

export let s3: AWS.S3;

export const initS3 = () => {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
    logger.warn('AWS credentials not found. S3 uploads will be disabled.');
    return;
  }

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
  });

  logger.info('AWS S3 initialized successfully');
};

// Generate a pre-signed URL for uploading a file
export const getSignedUrl = (key: string, contentType: string): Promise<string> => {
  if (!s3) {
    throw new Error('S3 not initialized');
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 60 * 60, // 1 hour
    ContentType: contentType,
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        logger.error('Error generating pre-signed URL', { error: err.message });
        return reject(err);
      }
      resolve(url);
    });
  });
};

// Delete a file from S3
export const deleteFile = (key: string): Promise<boolean> => {
  if (!s3) {
    throw new Error('S3 not initialized');
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  return new Promise((resolve) => {
    s3.deleteObject(params, (err) => {
      if (err) {
        logger.error('Error deleting file from S3', { error: err.message, key });
        return resolve(false);
      }
      resolve(true);
    });
  });
};
