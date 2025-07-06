const express = require('express');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload single image
router.post('/image', protect, (req, res) => {
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message });
    }

    try {
      if (!req.file) {
        console.log('No file in request');
        return res.status(400).json({ message: 'No image file provided' });
      }


      const imageData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        uploadedAt: new Date()
      };

      res.json(imageData);
    } catch (error) {
      console.error('Upload processing error:', error);
      res.status(500).json({ message: 'Upload failed', error: error.message });
    }
  });
});

// Upload multiple images
router.post('/images', protect, (req, res) => {
  console.log('Upload images route hit');
  
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message });
    }

    try {
      if (!req.files || req.files.length === 0) {
        console.log('No files in request');
        return res.status(400).json({ message: 'No image files provided' });
      }

      console.log('Files uploaded:', req.files);

      const imagesData = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        url: `/uploads/${file.filename}`,
        uploadedAt: new Date()
      }));

      console.log('Sending response:', imagesData);
      res.json(imagesData);
    } catch (error) {
      console.error('Upload processing error:', error);
      res.status(500).json({ message: 'Upload failed', error: error.message });
    }
  });
});

module.exports = router;
