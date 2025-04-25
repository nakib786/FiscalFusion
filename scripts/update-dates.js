// Script to update existing data with dates in the range Jan 1 - Apr 30, 2025
// Run with: node scripts/update-dates.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fiscalfusion';

async function updateDates() {
  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Collections to update
    const collections = [
      { name: 'transactions', dateFields: ['date', 'created_at', 'updated_at'] },
      { name: 'invoices', dateFields: ['due_date', 'created_at'] },
      { name: 'expenses', dateFields: ['date', 'created_at'] },
      { name: 'archived_invoices', dateFields: ['due_date', 'created_at', 'archive_metadata.archived_at'] }
    ];
    
    // Date range: Jan 1, 2025 - Apr 30, 2025
    const startDate = new Date('2025-01-01T00:00:00.000Z');
    const endDate = new Date('2025-04-30T23:59:59.999Z');
    
    // Get random date within our range
    const getRandomDate = () => {
      const start = startDate.getTime();
      const end = endDate.getTime();
      const randomTime = start + Math.random() * (end - start);
      return new Date(randomTime);
    };
    
    // Process each collection
    for (const collection of collections) {
      const coll = db.collection(collection.name);
      
      // Get all documents
      const documents = await coll.find({}).toArray();
      console.log(`Found ${documents.length} documents in ${collection.name}`);
      
      // Update each document
      let updateCount = 0;
      for (const doc of documents) {
        const updates = {};
        
        // Update all date fields in the document
        for (const dateField of collection.dateFields) {
          // Handle nested fields like archive_metadata.archived_at
          if (dateField.includes('.')) {
            const [parent, child] = dateField.split('.');
            if (doc[parent] && doc[parent][child]) {
              if (!updates[parent]) updates[parent] = {};
              updates[parent][child] = getRandomDate();
            }
          } else if (doc[dateField]) {
            updates[dateField] = getRandomDate();
          }
        }
        
        // Only update if we have date fields to update
        if (Object.keys(updates).length > 0) {
          const updateObj = {};
          
          // Flatten nested updates for MongoDB update operation
          for (const [key, value] of Object.entries(updates)) {
            if (typeof value === 'object' && !value instanceof Date) {
              for (const [nestedKey, nestedValue] of Object.entries(value)) {
                updateObj[`${key}.${nestedKey}`] = nestedValue;
              }
            } else {
              updateObj[key] = value;
            }
          }
          
          // Update the document
          await coll.updateOne({ _id: doc._id }, { $set: updateObj });
          updateCount++;
        }
      }
      
      console.log(`Updated dates for ${updateCount} documents in ${collection.name}`);
    }
    
    console.log('Data update completed successfully!');
  } catch (error) {
    console.error('Error updating dates:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB');
    }
    process.exit(0);
  }
}

// Run the function
updateDates(); 