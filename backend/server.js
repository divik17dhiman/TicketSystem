const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Apply JSON parsing only to non-upload routes
app.use('/api/auth', express.json({ limit: '10mb' }));
app.use('/api/tickets', express.json({ limit: '10mb' }));

// Don't apply express.json to upload routes - let multer handle it
app.use(express.urlencoded({ extended: true }));

// Remove debug middleware logging completely for GET requests
app.use((req, res, next) => {
  // Only log POST, PUT, DELETE requests to reduce noise
  if (req.path.startsWith('/api') && !['GET', 'OPTIONS'].includes(req.method)) {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// Test endpoint to verify JWT
app.get('/api/test-jwt', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.json({ error: 'No token provided' });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, decoded });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/users', require('./routes/users'));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Ticket Support System API',
    jwt_secret_configured: !!process.env.JWT_SECRET,
    mongodb_configured: !!process.env.MONGODB_URI
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment check:');
  console.log('- JWT_SECRET configured:', !!process.env.JWT_SECRET);
  console.log('- MongoDB configured:', !!process.env.MONGODB_URI);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
});
