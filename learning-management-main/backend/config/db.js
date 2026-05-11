const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

let retryTimer = null;
const dbStatus = {
  lastAttemptAt: null,
  lastConnectedAt: null,
  lastError: null,
};

const getMongoUri = () => {
  let uri = (process.env.MONGO_URI || "").trim();

  const embeddedUri = uri.match(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/i);
  if (embeddedUri) {
    uri = embeddedUri[0];
  }

  uri = uri.replace(/^MONGO_URI\s*=\s*/i, "").trim();

  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'"))
  ) {
    uri = uri.slice(1, -1).trim();
  }

  return uri;
};

const connectDB = async () => {
  dbStatus.lastAttemptAt = new Date().toISOString();

  const mongoUri = getMongoUri();

  if (!mongoUri) {
    dbStatus.lastError = 'MONGO_URI is not set.';
    console.warn('MongoDB connection skipped: MONGO_URI is not set.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    dbStatus.lastConnectedAt = new Date().toISOString();
    dbStatus.lastError = null;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    dbStatus.lastError = error.message;
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
  dbStatus.lastConnectedAt = new Date().toISOString();
  dbStatus.lastError = null;
  console.log('MongoDB reconnected.');
});

connectDB.getMongoUri = getMongoUri;
connectDB.getStatus = () => ({ ...dbStatus });

module.exports = connectDB;
