const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Debug middleware to log incoming requests
router.use((req, res, next) => {
  next();
});

// Register route with validation
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

// Login route with validation
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// Get profile route (protected)
router.get('/profile', protect, getProfile);

module.exports = router;
