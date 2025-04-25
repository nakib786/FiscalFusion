/**
 * Migration script to update existing clients with client IDs and creation dates
 * Run with: node scripts/update-client-ids.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fiscalfusion';

// Function to generate a client ID
function generateClientId(index, name) {
  const prefix = 'CLI-';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  
  // Use name initial if available, otherwise generate random
  if (name && name.length > 0) {
    result += name.charAt(0).toUpperCase();
  } else {
    result += chars.charAt(Math.floor(Math.random() * 26)); // Ensure first char is a letter
  }
  
  // Generate a random 4-character string
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add index to ensure uniqueness
  const paddedIndex = String(index).padStart(4, '0');
  result += `-${paddedIndex}`;
  
  return result;
}

async function updateClientIds() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const clientsCollection = db.collection('clients');
    
    // Get all clients
    const clients = await clientsCollection.find({}).toArray();
    console.log(`Found ${clients.length} clients to update`);
    
    // Update each client with client_id and created_at if missing
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const updateFields = {};
      let needsUpdate = false;
      
      // Add client_id if missing
      if (!client.client_id) {
        updateFields.client_id = generateClientId(i + 1, client.name);
        needsUpdate = true;
      }
      
      // Add created_at if missing
      if (!client.created_at) {
        // Generate a creation date that's 1-12 months in the past
        const monthOffset = Math.floor(Math.random() * 12) + 1;
        const creationDate = new Date();
        creationDate.setMonth(creationDate.getMonth() - monthOffset);
        
        updateFields.created_at = creationDate;
        needsUpdate = true;
      }
      
      // Add last_activity if missing
      if (!client.last_activity) {
        // Last activity should be after creation date
        const activityDate = new Date(client.created_at || updateFields.created_at);
        activityDate.setDate(activityDate.getDate() + Math.floor(Math.random() * 30));
        
        // Don't set a future date
        if (activityDate > new Date()) {
          activityDate.setTime(new Date().getTime() - Math.random() * 86400000 * 10); // Random time in last 10 days
        }
        
        updateFields.last_activity = activityDate;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        console.log(`Updating client ${i + 1}/${clients.length}: ${client.name || 'Unnamed Client'}`);
        console.log('  Update fields:', updateFields);
        
        await clientsCollection.updateOne(
          { _id: client._id },
          { $set: updateFields }
        );
        
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log(`\nMigration completed successfully!`);
    console.log(`Updated ${updatedCount} clients`);
    console.log(`Skipped ${skippedCount} clients (already had ID and creation date)`);
    
  } catch (error) {
    console.error('Error updating client IDs:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the migration
updateClientIds();
