// Next.js API route for clients - connects directly to database
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  let client;
  
  try {
    // Connect directly to MongoDB
    client = await clientPromise;
    const db = client.db();
    const collection = db.collection('clients');
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get all clients or a specific client
        if (req.query.id) {
          const client = await collection.findOne({ _id: new ObjectId(req.query.id) });
          if (!client) {
            return res.status(404).json({
              success: false,
              error: 'Client not found'
            });
          }
          return res.status(200).json({
            success: true,
            data: client
          });
        } else {
          const data = await collection.find({}).sort({ created_at: -1 }).toArray();
          return res.status(200).json({
            success: true,
            data: data,
            source: 'database'
          });
        }
      
      case 'POST':
        // Create a new client with generated ID and creation date
        const newClient = {
          ...req.body,
          created_at: new Date(), // Add creation timestamp
          client_id: generateClientId(), // Add a human-readable client ID
          last_activity: new Date()
        };
        
        console.log('Creating new client:', newClient);
        
        const result = await collection.insertOne(newClient);
        return res.status(201).json({
          success: true,
          data: { ...newClient, _id: result.insertedId }
        });
      
      case 'PUT':
        // Update a client
        if (!req.query.id) {
          return res.status(400).json({
            success: false,
            error: 'Client ID is required'
          });
        }
        
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
        
        return res.status(200).json({
          success: true,
          data: { _id: req.query.id, ...updateData }
        });
      
      case 'DELETE':
        // Delete a client
        if (!req.query.id) {
          return res.status(400).json({
            success: false,
            error: 'Client ID is required'
          });
        }
        
        const deleteResult = await collection.deleteOne({ _id: new ObjectId(req.query.id) });
        
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'Client not found'
          });
        }
        
        return res.status(200).json({
          success: true,
          message: 'Client deleted successfully'
        });
      
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('MongoDB operation error:', error);
    // Return error without mock data
    return res.status(500).json({
      success: false,
      error: 'Database operation failed',
      message: error.message
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