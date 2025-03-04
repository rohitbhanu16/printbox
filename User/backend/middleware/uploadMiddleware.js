const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('../config/awsConfig'); // Import S3 properly
require('dotenv').config();

if (!s3) {
  throw new Error('AWS S3 instance is undefined! Check your AWS configuration.');
}

// Add error logging
console.log('Setting up multer-s3 with bucket:', process.env.AWS_BUCKET_NAME);

// Multer S3 Storage Configuration
const upload = multer({
  storage: multerS3({
    s3: s3, // Ensure this is a valid object
    bucket: process.env.AWS_BUCKET_NAME,
    //acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      console.log('Processing file:', file.originalname);
      const filename = `uploads/${Date.now()}_${file.originalname}`;
      cb(null, filename);
    },
  }),
});

module.exports = { upload };
