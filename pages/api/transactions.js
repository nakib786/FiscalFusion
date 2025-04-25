import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

// Next.js API route for transactions - connects directly to database
export default async function handler(req, res) {
  try {
    // Connect to MongoDB using the shared client
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('transactions');

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res, collection);
      case 'PUT':
        return await handleUpdate(req, res, collection);
      case 'POST':
        return await handleCreate(req, res, collection);
      case 'DELETE':
        return await handleDelete(req, res, collection);
      default:
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('MongoDB operation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Database operation failed',
      message: error.message
    });
  }
}

async function handleGet(req, res, collection) {
  const { 
    id,
    dateRange, 
    status, 
    type, 
    category, 
    search, 
    page = 1, 
    limit = 50 
  } = req.query;
  
  try {
    // If specific ID is provided
    if (id) {
      const transaction = await collection.findOne({ _id: new ObjectId(id) });
      
      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: transaction
      });
    }
    
    // Build MongoDB query
    let query = {};
    
    // Date range filter
    if (dateRange) {
      let startDate = new Date();
      
      switch(dateRange) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(startDate.getMonth() - 1); // Default to month
      }
      
      query.date = { $gte: startDate.toISOString() };
    }
    
    // Other filters
    if (status) query.status = status;
    if (type) query.type = type;
    
    if (category) {
      if (category === 'uncategorized') {
        query.category = { $exists: false };
      } else {
        query.category = category;
      }
    }
    
    // Search in description or payee
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { description: searchRegex },
        { payee: searchRegex }
      ];
    }
    
    // Get total count for pagination
    const total = await collection.countDocuments(query);
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const transactions = await collection
      .find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    // Return data with pagination metadata
    return res.status(200).json({
      success: true,
      source: 'database',
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error in transactions API:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
}

async function handleUpdate(req, res, collection) {
  try {
    const { id } = req.query;
    const updateData = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction ID is required'
      });
    }
    
    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString();
    
    // Update in database
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found'
      });
    }
    
    // Get the updated transaction
    const updatedTransaction = await collection.findOne({ _id: new ObjectId(id) });
    
    return res.status(200).json({ 
      success: true, 
      data: updatedTransaction,
      message: 'Transaction updated successfully'
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to update transaction',
      error: error.message
    });
  }
}

async function handleCreate(req, res, collection) {
  try {
    const transactionData = req.body;
    
    if (!transactionData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction data is required'
      });
    }
    
    // Add timestamps
    const now = new Date().toISOString();
    const newTransaction = {
      ...transactionData,
      createdAt: now,
      updatedAt: now
    };
    
    // Insert into database
    const result = await collection.insertOne(newTransaction);
    
    return res.status(201).json({ 
      success: true, 
      data: { ...newTransaction, _id: result.insertedId },
      message: 'Transaction created successfully'
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create transaction',
      error: error.message
    });
  }
}

async function handleDelete(req, res, collection) {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction ID is required'
      });
    }
    
    // Delete from database
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found'
      });
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete transaction',
      error: error.message
    });
  }
} 