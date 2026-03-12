const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Warning: MongoDB connection failed: ${error.message}`);
    console.log('Server will continue without database connection...');
    // Don't exit, just continue without DB
  }
};

module.exports = connectDB;
