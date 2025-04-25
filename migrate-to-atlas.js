/**
 * MongoDB Migration Script
 * Migrates data from the current MongoDB database to MongoDB Atlas
 */
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB connection strings
const sourceURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fiscalfusion';
const targetURI = 'mongodb+srv://nakib786:Canada%402025@cluster0.42fxaw4.mongodb.net/fiscalfusion';

// Create MongoDB clients
const sourceClient = new MongoClient(sourceURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const targetClient = new MongoClient(targetURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// List of collections to migrate
const collections = [
  'clients',
  'invoices',
  'invoice_items',
  'expenses',
  'assets',
  'liabilities',
  'cash_transactions',
  'transactions',
  'report_templates'
];

// Migrate a single collection
async function migrateCollection(collection, sourceDb, targetDb) {
  console.log(`Migrating collection: ${collection}`);
  
  // Get all documents from source collection
  const documents = await sourceDb.collection(collection).find({}).toArray();
  console.log(`Found ${documents.length} documents in ${collection}`);
  
  if (documents.length === 0) {
    console.log(`No documents to migrate for ${collection}`);
    return 0;
  }
  
  // Insert documents into target collection
  try {
    // Create the collection if it doesn't exist
    await targetDb.createCollection(collection).catch(() => {
      console.log(`Collection ${collection} already exists in target database`);
    });
    
    // Get collection indexes from source
    const indexes = await sourceDb.collection(collection).indexes();
    
    // Create indexes in target collection (skip _id index which is created automatically)
    for (const index of indexes) {
      if (index.name !== '_id_') {
        await targetDb.collection(collection).createIndex(
          index.key,
          {
            name: index.name,
            unique: index.unique || false,
            sparse: index.sparse || false,
            background: index.background || true
          }
        ).catch(err => {
          console.warn(`Could not create index ${index.name} on ${collection}: ${err.message}`);
        });
      }
    }
    
    // Insert the documents
    const result = await targetDb.collection(collection).insertMany(documents);
    console.log(`Migrated ${result.insertedCount} documents to ${collection}`);
    return result.insertedCount;
  } catch (error) {
    console.error(`Error migrating ${collection}:`, error);
    return 0;
  }
}

// Main migration function
async function migrateData() {
  try {
    console.log('Starting migration from current database to Atlas...');
    
    // Connect to source and target databases
    await sourceClient.connect();
    await targetClient.connect();
    
    console.log('Connected to both source and target databases');
    
    const sourceDb = sourceClient.db();
    const targetDb = targetClient.db();
    
    let totalDocuments = 0;
    
    // Migrate each collection
    for (const collection of collections) {
      const count = await migrateCollection(collection, sourceDb, targetDb);
      totalDocuments += count;
    }
    
    console.log(`Migration complete. Total documents migrated: ${totalDocuments}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close connections
    await sourceClient.close();
    await targetClient.close();
    console.log('Database connections closed');
  }
}

// Run the migration
migrateData().catch(console.error); 