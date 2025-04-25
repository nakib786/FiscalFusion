/**
 * Cleanup Local MongoDB Database
 * 
 * This script drops the local MongoDB database now that we've migrated to MongoDB Atlas.
 * Run this after verifying that the MongoDB Atlas migration is complete and working properly.
 */
const { MongoClient } = require('mongodb');

// Local MongoDB connection string
const localURI = 'mongodb://localhost:27017/fiscalfusion';

// Create MongoDB client
const client = new MongoClient(localURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function dropLocalDatabase() {
  console.log('Connecting to local MongoDB...');
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to local MongoDB successfully');
    
    // Drop the database
    await client.db().dropDatabase();
    console.log('Local MongoDB database "fiscalfusion" has been dropped');
    
    console.log('Local database cleanup completed successfully');
  } catch (error) {
    // Check if the error is about connection refused (i.e., local MongoDB not running)
    if (error.code === 'ECONNREFUSED') {
      console.log('Local MongoDB is not running, no cleanup needed');
    } else {
      console.error('Error cleaning up local database:', error);
    }
  } finally {
    // Close the connection
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the cleanup script
dropLocalDatabase().catch(console.error); 