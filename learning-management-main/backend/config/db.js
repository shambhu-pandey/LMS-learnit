const mongoose = require('mongoose');

let retryTimer = null;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MongoDB connection skipped: MONGO_URI is not set.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);

    clearTimeout(retryTimer);
    retryTimer = setTimeout(connectDB, 30000);
  }
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected.');
});

module.exports = connectDB;
