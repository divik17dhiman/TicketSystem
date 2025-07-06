const User = require('../models/User');

const getAgents = async (req, res) => {
  try {
    const agents = await User.find({ 
      role: { $in: ['agent', 'admin'] },
      isActive: true 
    }).select('name email role');
    
    res.json(agents);
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    // Only admins can view all users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAgents,
  getUsers
};
