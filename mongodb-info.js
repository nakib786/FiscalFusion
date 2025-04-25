/**
 * Script to display MongoDB database information
 */
const mongodb = require('./src/server/database/mongodb-config');

async function showMongoDBInfo() {
  try {
    console.log('Connecting to MongoDB...');
    const db = await mongodb.getDb();
    
    // Get database information
    const dbInfo = await db.admin().serverStatus();
    console.log('=== MongoDB Server Information ===');
    console.log(`Version: ${dbInfo.version}`);
    console.log(`Uptime: ${Math.floor(dbInfo.uptime / 86400)} days, ${Math.floor((dbInfo.uptime % 86400) / 3600)} hours`);
    console.log('===============================\n');
    
    // Get database list
    const dbList = await db.admin().listDatabases();
    console.log('=== Databases ===');
    dbList.databases.forEach(database => {
      console.log(`- ${database.name} (${(database.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    console.log('=================\n');
    
    // Get collections in current database
    const collections = await db.listCollections().toArray();
    console.log(`=== Collections in ${db.databaseName} ===`);
    for (const collection of collections) {
      console.log(`- ${collection.name}`);
      const count = await db.collection(collection.name).countDocuments();
      console.log(`  Documents: ${count}`);
      
      if (count > 0) {
        // Show one sample document
        const sample = await db.collection(collection.name).findOne();
        console.log('  Sample document:');
        console.log('  ' + JSON.stringify(sample, null, 2).replace(/\n/g, '\n  '));
      }
      console.log('');
    }
    console.log('=================');
    
    // Close the connection
    await mongodb.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the function
showMongoDBInfo(); 