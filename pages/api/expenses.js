// Next.js API route for expenses - connects directly to database
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    // Connect to MongoDB using the shared client
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('expenses');
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get all expenses or a specific expense
        if (req.query.id) {
          const expense = await collection.findOne({ _id: new ObjectId(req.query.id) });
          if (!expense) {
            return res.status(404).json({
              success: false,
              error: 'Expense not found'
            });
          }
          return res.status(200).json({
            success: true,
            data: expense
          });
        } else {
          const data = await collection.find({}).toArray();
          return res.status(200).json({
            success: true,
            data: data,
            source: 'database'
          });
        }
      
      case 'POST':
        // Create a new expense
        const newExpense = req.body;
        const result = await collection.insertOne(newExpense);
        return res.status(201).json({
          success: true,
          data: { ...newExpense, _id: result.insertedId }
        });
      
      case 'PUT':
        // Update an expense
        if (!req.query.id) {
          return res.status(400).json({
            success: false,
            error: 'Expense ID is required'
          });
        }
        
        const updateData = req.body;
        const updateResult = await collection.updateOne(
          { _id: new ObjectId(req.query.id) },
          { $set: updateData }
        );
        
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'Expense not found'
          });
        }
        
        return res.status(200).json({
          success: true,
          data: { _id: req.query.id, ...updateData }
        });
      
      case 'DELETE':
        // Delete an expense
        if (!req.query.id) {
          return res.status(400).json({
            success: false,
            error: 'Expense ID is required'
          });
        }
        
        const deleteResult = await collection.deleteOne({ _id: new ObjectId(req.query.id) });
        
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'Expense not found'
          });
        }
        
        return res.status(200).json({
          success: true,
          message: 'Expense deleted successfully'
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