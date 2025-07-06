const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Use the MONGODB_URI directly since it already contains the password
    const mongoURI = process.env.MONGODB_URI;
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
