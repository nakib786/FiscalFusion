/**
 * Verify MongoDB Atlas Connection
 * This script tests the connection to the new MongoDB Atlas cluster
 */
const { MongoClient } = require('mongodb');

// MongoDB Atlas connection string
const atlasURI = 'mongodb+srv://nakib786:Canada%402025@cluster0.42fxaw4.mongodb.net/fiscalfusion';

// Create MongoDB client
const client = new MongoClient(atlasURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function verifyConnection() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    
    // Connect to the MongoDB Atlas cluster
    await client.connect();
    
    console.log('Connected to MongoDB Atlas successfully!');
    
    // Get database information
    const admin = client.db().admin();
    
    // Get server info
    const serverInfo = await admin.serverInfo();
    console.log('Server Info:');
    console.log(`- MongoDB Version: ${serverInfo.version}`);
    
    // List databases
    const dbs = await client.db().admin().listDatabases();
    console.log('\nAvailable Databases:');
    dbs.databases.forEach(db => {
      console.log(`- ${db.name} (${(db.sizeOnDisk / (1024 * 1024)).toFixed(2)} MB)`);
    });
    
    // Test database operations
    const db = client.db();
    
    // Check if collections exist
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('\nNo collections found. The database is empty or you may not have permissions to view collections.');
    } else {
      console.log('\nExisting Collections:');
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
      
      // Count documents in each collection
      console.log('\nDocument Counts:');
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`- ${collection.name}: ${count} documents`);
      }
    }
    
    console.log('\nMongoDB Atlas connection verification completed successfully!');
    
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the verification
verifyConnection().catch(console.error); 