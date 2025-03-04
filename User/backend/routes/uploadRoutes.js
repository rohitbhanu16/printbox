const express = require('express');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload', upload.single('file'), (req, res) => {
  console.log('Upload request received:', req.file);
  
  if (!req.file) {
    console.error('No file received in request');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('File uploaded successfully:', req.file.location);
  res.status(200).json({ fileUrl: req.file.location });
});

module.exports = router;
