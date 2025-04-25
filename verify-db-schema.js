/**
 * Verify and fix MongoDB Atlas database schema
 * This script checks for any missing collections or indexes and adds them if needed
 */
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI || 'mongodb+srv://nakib786:Canada%402025@cluster0.42fxaw4.mongodb.net/fiscalfusion';

// Create MongoDB client with appropriate options
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Required collections and their indexes
const requiredCollections = [
  {
    name: 'clients',
    indexes: [
      { key: { email: 1 }, options: { unique: true, sparse: true } }
    ]
  },
  {
    name: 'invoices',
    indexes: [
      { key: { client_id: 1 }, options: {} },
      { key: { status: 1 }, options: {} },
      { key: { due_date: 1 }, options: {} }
    ]
  },
  {
    name: 'invoice_items',
    indexes: [
      { key: { invoice_id: 1 }, options: {} }
    ]
  },
  {
    name: 'expenses',
    indexes: [
      { key: { category: 1 }, options: {} },
      { key: { date: 1 }, options: {} }
    ]
  },
  {
    name: 'assets',
    indexes: [
      { key: { category: 1 }, options: {} }
    ]
  },
  {
    name: 'liabilities',
    indexes: [
      { key: { category: 1 }, options: {} }
    ]
  },
  {
    name: 'cash_transactions',
    indexes: [
      { key: { type: 1 }, options: {} },
      { key: { date: 1 }, options: {} }
    ]
  },
  {
    name: 'transactions',
    indexes: [
      { key: { date: 1 }, options: {} },
      { key: { type: 1 }, options: {} },
      { key: { category: 1 }, options: {} },
      { key: { status: 1 }, options: {} }
    ]
  },
  {
    name: 'report_templates',
    indexes: [
      { key: { type: 1 }, options: {} }
    ]
  }
];

async function verifyAndFixSchema() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('Connected successfully!');
    
    const db = client.db();
    
    // Get existing collections
    const existingCollections = await db.listCollections().toArray();
    const existingCollectionNames = existingCollections.map(c => c.name);
    
    console.log('Existing collections:', existingCollectionNames.join(', '));
    
    // Verify each required collection and its indexes
    for (const collection of requiredCollections) {
      // Check if collection exists
      if (!existingCollectionNames.includes(collection.name)) {
        console.log(`Creating missing collection: ${collection.name}`);
        await db.createCollection(collection.name);
      }
      
      // Get existing indexes
      const existingIndexes = await db.collection(collection.name).indexes();
      const existingIndexNames = existingIndexes.map(idx => idx.name);
      
      // Create missing indexes
      for (const index of collection.indexes) {
        // Generate index name (MongoDB uses this format)
        const indexFields = Object.keys(index.key).map(key => `${key}_${index.key[key]}`).join('_');
        
        if (!existingIndexNames.includes(indexFields)) {
          console.log(`Creating missing index ${indexFields} on collection ${collection.name}`);
          try {
            await db.collection(collection.name).createIndex(index.key, index.options);
            console.log(`Index ${indexFields} created successfully`);
          } catch (err) {
            console.error(`Error creating index ${indexFields}:`, err.message);
          }
        }
      }
    }
    
    console.log('Database schema verification complete!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the verification
verifyAndFixSchema().catch(console.error); 