const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Create a pool with a timeout
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fiscalfusion',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
  // Set a shorter connection timeout
  connectionTimeoutMillis: 5000,
  // Don't throw on a connection error
  allowExitOnIdle: false,
  // Max number of clients the pool should contain
  max: 20,
  // Max milliseconds a client can stay idle before being closed
  idleTimeoutMillis: 30000
});

// Global database connection status
let isConnected = false;

// Test the database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Database connected successfully at:', result.rows[0].now);
    client.release();
    isConnected = true;
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    isConnected = false;
    return false;
  }
};

// Call testConnection to initialize, but don't wait for it
testConnection();

// Add a listener for connection errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  isConnected = false;
});

// Use query method that handles connection failures
const query = async (text, params) => {
  try {
    // Always test connection first if we think we're disconnected
    if (!isConnected) {
      isConnected = await testConnection();
    }
    
    // If we're still not connected, throw an error
    if (!isConnected) {
      throw new Error('Database connection is unavailable');
    }
    
    // Execute the query
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error('Database query error:', err);
    throw err; // Rethrow to let the caller handle it
  }
};

module.exports = {
  query,
  pool,
  testConnection,
  getConnectionStatus: () => isConnected
}; 