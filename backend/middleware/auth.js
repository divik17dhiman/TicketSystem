const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;


  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        console.log('❌ User not found in database with ID:', decoded.userId);
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.log('❌ Token verification failed:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  } else {
    console.log('❌ No authorization header or invalid format');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorization check - User role:', req.user?.role, 'Required roles:', roles);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Not authorized for this role. Required: ${roles.join(', ')}, Got: ${req.user.role}` });
    }
    next();
  };
};

module.exports = { protect, authorize };
