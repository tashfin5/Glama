const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Configuration for Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'glama-products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private (Authenticated users can upload images for reviews)
router.post('/', protect, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      message: 'Image uploaded successfully',
      url: req.file.path,
    });
  } else {
    res.status(400);
    throw new Error('No image file provided');
  }
});

module.exports = router;
