// Next.js API route for clients - connects directly to database
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  console.log('Clients API: Processing request...');
  let client;
  
  try {
    // Connect directly to MongoDB
    console.log('Clients API: Connecting to MongoDB Atlas...');
    client = await clientPromise;
    console.log('Clients API: MongoDB connection established');
    
    const db = client.db();
    console.log('Clients API: Database accessed');
    
    const collection = db.collection('clients');
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        console.log('Clients API: Processing GET request');
        // Get all clients or a specific client
        if (req.query.id) {
          try {
            const clientData = await collection.findOne({ _id: new ObjectId(req.query.id) });
            if (!clientData) {
              return res.status(404).json({
                success: false,
                error: 'Client not found'
              });
            }
            console.log(`Clients API: Found client with ID ${req.query.id}`);
            return res.status(200).json({
              success: true,
              data: clientData
            });
          } catch (err) {
            console.error('Clients API: Error fetching client by ID:', err);
            return res.status(400).json({
              success: false,
              error: 'Invalid client ID format',
              message: err.message
            });
          }
        } else {
          try {
            const data = await collection.find({}).sort({ created_at: -1 }).toArray();
            console.log(`Clients API: Found ${data.length} clients`);
            return res.status(200).json({
              success: true,
              data: data,
              source: 'database'
            });
          } catch (err) {
            console.error('Clients API: Error fetching all clients:', err);
            return res.status(500).json({
              success: false,
              error: 'Failed to retrieve clients',
              message: err.message
            });
          }
        }
      
      case 'POST':
        console.log('Clients API: Processing POST request');
        try {
          // Create a new client with generated ID and creation date
          const newClient = {
            ...req.body,
            created_at: new Date(), // Add creation timestamp
            client_id: generateClientId(), // Add a human-readable client ID
            last_activity: new Date()
          };
          
          console.log('Creating new client:', newClient);
          
          const result = await collection.insertOne(newClient);
          console.log(`Clients API: Created client with ID ${result.insertedId}`);
          return res.status(201).json({
            success: true,
            data: { ...newClient, _id: result.insertedId }
          });
        } catch (err) {
          console.error('Clients API: Error creating client:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to create client',
            message: err.message
          });
        }
      
      case 'PUT':
        console.log('Clients API: Processing PUT request');
        if (!req.query.id) {
          return res.status(400).json({
            success: false,
            error: 'Client ID is required'
          });
        }
        
        try {
          const updateData = {
            ...req.body,
            last_updated: new Date() // Track when the client was last updated
          };
          
          const updateResult = await collection.updateOne(
            { _id: new ObjectId(req.query.id) },
            { $set: updateData }
          );
          
          if (updateResult.matchedCount === 0) {
            return res.status(404).json({
              success: false,
              error: 'Client not found'
            });
          }
          
          console.log(`Clients API: Updated client with ID ${req.query.id}`);
          return res.status(200).json({
            success: true,
            data: { _id: req.query.id, ...updateData }
          });
        } catch (err) {
          console.error('Clients API: Error updating client:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to update client',
            message: err.message
          });
        }
      
      case 'DELETE':
        console.log('Clients API: Processing DELETE request');
        if (!req.query.id) {
          return res.status(400).json({
            success: false,
            error: 'Client ID is required'
          });
        }
        
        try {
          const deleteResult = await collection.deleteOne({ _id: new ObjectId(req.query.id) });
          
          if (deleteResult.deletedCount === 0) {
            return res.status(404).json({
              success: false,
              error: 'Client not found'
            });
          }
          
          console.log(`Clients API: Deleted client with ID ${req.query.id}`);
          return res.status(200).json({
            success: true,
            message: 'Client deleted successfully'
          });
        } catch (err) {
          console.error('Clients API: Error deleting client:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to delete client',
            message: err.message
          });
        }
      
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Clients API error:', error);
    console.error('Error stack:', error.stack);
    // Return error without mock data
    return res.status(500).json({
      success: false,
      error: 'Database operation failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Generate a unique client ID in format "CLI-XXXXX" 
 * where XXXXX is a random alphanumeric string
 */
function generateClientId() {
  const prefix = 'CLI-';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  
  // Generate a random 5-character string
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add timestamp to ensure uniqueness
  const timestamp = new Date().getTime().toString(36).slice(-4);
  result += `-${timestamp}`;
  
  return result;
} 