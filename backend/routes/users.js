const express = require('express');
const { getAgents, getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all agents (for assignment dropdowns)
router.get('/agents', protect, getAgents);

// Get all users (admin only)
router.get('/', protect, authorize('admin'), getUsers);

// Get current user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (admin only)
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['customer', 'agent', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
