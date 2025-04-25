// Next.js API route for expenses - connects directly to database
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  console.log('Expenses API: Processing request...');
  try {
    // Connect to MongoDB using the shared client
    console.log('Expenses API: Connecting to MongoDB Atlas...');
    const client = await clientPromise;
    console.log('Expenses API: MongoDB connection established');
    
    const db = client.db();
    console.log('Expenses API: Database accessed');
    
    const collection = db.collection('expenses');
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        console.log('Expenses API: Processing GET request');
        try {
          // Get all expenses or a specific expense
          if (req.query.id) {
            // Validate ObjectId before querying
            let objectId;
            try {
              if (!ObjectId.isValid(req.query.id)) {
                return res.status(400).json({
                  success: false,
                  error: 'Invalid expense ID format'
                });
              }
              objectId = new ObjectId(req.query.id);
            } catch (err) {
              console.error('Expenses API: Invalid expense ID format:', err);
              return res.status(400).json({
                success: false,
                error: 'Invalid expense ID format'
              });
            }
            
            const expense = await collection.findOne({ _id: objectId });
            if (!expense) {
              return res.status(404).json({
                success: false,
                error: 'Expense not found'
              });
            }
            console.log(`Expenses API: Found expense with ID ${req.query.id}`);
            return res.status(200).json({
              success: true,
              data: expense
            });
          } else {
            const data = await collection.find({}).toArray();
            console.log(`Expenses API: Found ${data.length} expenses`);
            return res.status(200).json({
              success: true,
              data: data,
              source: 'database'
            });
          }
        } catch (err) {
          console.error('Expenses API: Error processing GET request:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to retrieve expenses',
            message: err.message
          });
        }
      
      case 'POST':
        console.log('Expenses API: Processing POST request');
        try {
          // Create a new expense
          const newExpense = req.body;
          const result = await collection.insertOne(newExpense);
          console.log(`Expenses API: Created expense with ID ${result.insertedId}`);
          return res.status(201).json({
            success: true,
            data: { ...newExpense, _id: result.insertedId }
          });
        } catch (err) {
          console.error('Expenses API: Error creating expense:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to create expense',
            message: err.message
          });
        }
      
      case 'PUT':
        console.log('Expenses API: Processing PUT request');
        try {
          // Update an expense
          if (!req.query.id) {
            return res.status(400).json({
              success: false,
              error: 'Expense ID is required'
            });
          }
          
          // Validate ObjectId before querying
          let updateObjectId;
          try {
            if (!ObjectId.isValid(req.query.id)) {
              return res.status(400).json({
                success: false,
                error: 'Invalid expense ID format'
              });
            }
            updateObjectId = new ObjectId(req.query.id);
          } catch (err) {
            console.error('Expenses API: Invalid expense ID format for update:', err);
            return res.status(400).json({
              success: false,
              error: 'Invalid expense ID format'
            });
          }
          
          const updateData = req.body;
          const updateResult = await collection.updateOne(
            { _id: updateObjectId },
            { $set: updateData }
          );
          
          if (updateResult.matchedCount === 0) {
            return res.status(404).json({
              success: false,
              error: 'Expense not found'
            });
          }
          
          console.log(`Expenses API: Updated expense with ID ${req.query.id}`);
          return res.status(200).json({
            success: true,
            data: { _id: req.query.id, ...updateData }
          });
        } catch (err) {
          console.error('Expenses API: Error updating expense:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to update expense',
            message: err.message
          });
        }
      
      case 'DELETE':
        console.log('Expenses API: Processing DELETE request');
        try {
          // Delete an expense
          if (!req.query.id) {
            return res.status(400).json({
              success: false,
              error: 'Expense ID is required'
            });
          }
          
          // Validate ObjectId before querying
          let deleteObjectId;
          try {
            if (!ObjectId.isValid(req.query.id)) {
              return res.status(400).json({
                success: false,
                error: 'Invalid expense ID format'
              });
            }
            deleteObjectId = new ObjectId(req.query.id);
          } catch (err) {
            console.error('Expenses API: Invalid expense ID format for delete:', err);
            return res.status(400).json({
              success: false,
              error: 'Invalid expense ID format'
            });
          }
          
          const deleteResult = await collection.deleteOne({ _id: deleteObjectId });
          
          if (deleteResult.deletedCount === 0) {
            return res.status(404).json({
              success: false,
              error: 'Expense not found'
            });
          }
          
          console.log(`Expenses API: Deleted expense with ID ${req.query.id}`);
          return res.status(200).json({
            success: true,
            message: 'Expense deleted successfully'
          });
        } catch (err) {
          console.error('Expenses API: Error deleting expense:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to delete expense',
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
    console.error('Expenses API error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: 'Database operation failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 