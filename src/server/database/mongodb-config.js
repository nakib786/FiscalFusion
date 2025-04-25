/**
 * MongoDB connection configuration
 */
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fiscalfusion';

// Create a MongoDB client
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
});

// Global connection status
let isConnected = false;
let db = null;

/**
 * Connect to MongoDB
 */
const connect = async () => {
  try {
    if (!isConnected) {
      await client.connect();
      console.log('Connected to MongoDB successfully');
      db = client.db();
      isConnected = true;
    }
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
};

/**
 * Get database connection
 */
const getDb = async () => {
  if (!isConnected) {
    return await connect();
  }
  return db;
};

/**
 * Test database connection
 */
const testConnection = async () => {
  try {
    await connect();
    // Run a simple command to verify the connection is working
    await db.command({ ping: 1 });
    console.log('MongoDB connection test successful');
    return true;
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    isConnected = false;
    return false;
  }
};

/**
 * Close database connection
 */
const close = async () => {
  if (isConnected) {
    await client.close();
    isConnected = false;
    db = null;
    console.log('MongoDB connection closed');
  }
};

// Initialize connection
connect().catch(console.error);

// Handle process termination
process.on('SIGINT', async () => {
  await close();
  process.exit(0);
});

module.exports = {
  connect,
  getDb,
  testConnection,
  close,
  getConnectionStatus: () => isConnected
}; 