const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

// Validate that AWS credentials exist
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
  throw new Error('Missing AWS credentials in .env file!');
}

// Add error logging
console.log('AWS Configuration:', {
  region: process.env.AWS_REGION,
  bucketName: process.env.AWS_BUCKET_NAME,
  // Don't log credentials in production
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
});

// Configure AWS SDK (v2)
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create and export S3 instance
const s3 = new AWS.S3();

module.exports = { s3 };
