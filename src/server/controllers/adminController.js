/**
 * Admin Controller for CMS operations
 * Provides database access for the admin dashboard
 */

const mongodb = require('../database/mongodb-config');
const { ObjectId } = require('mongodb');
const Client = require('../models/Client');
const Invoice = require('../models/Invoice');

/**
 * Get dashboard summary statistics
 */
async function getDashboardStats() {
  try {
    const db = await mongodb.getDb();
    
    // Get total clients
    const totalClients = await db.collection('clients').countDocuments();

    // Get total invoices
    const totalInvoices = await db.collection('invoices').countDocuments();

    // Get total paid amount
    const paidResult = await db.collection('invoices').aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();
    const totalPaid = paidResult.length > 0 ? paidResult[0].total : 0;

    // Get total unpaid amount
    const unpaidResult = await db.collection('invoices').aggregate([
      { $match: { status: 'unpaid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();
    const totalUnpaid = unpaidResult.length > 0 ? unpaidResult[0].total : 0;

    // Get overdue invoices
    const overdueInvoices = await db.collection('invoices').countDocuments({
      status: 'unpaid',
      due_date: { $lt: new Date() }
    });

    return {
      totalClients,
      totalInvoices,
      totalPaid,
      totalUnpaid,
      overdueInvoices,
      revenueTotal: totalPaid + totalUnpaid
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
}

/**
 * Get recent activity for the admin dashboard
 */
async function getRecentActivity(limit = 10) {
  try {
    const db = await mongodb.getDb();
    
    // Get recent invoices
    const recentInvoices = await db.collection('invoices').aggregate([
      {
        $lookup: {
          from: 'clients',
          localField: 'client_id',
          foreignField: '_id',
          as: 'client'
        }
      },
      {
        $unwind: {
          path: '$client',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          client_name: '$client.name'
        }
      },
      {
        $sort: { created_at: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          _id: 1,
          amount: 1,
          status: 1,
          due_date: 1,
          created_at: 1,
          client_name: 1
        }
      }
    ]).toArray();

    // Get recent clients
    const recentClients = await db.collection('clients')
      .find({})
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .project({
        _id: 1,
        name: 1,
        email: 1,
        created_at: 1
      })
      .toArray();

    return {
      recentInvoices,
      recentClients
    };
  } catch (error) {
    console.error('Error getting recent activity:', error);
    throw error;
  }
}

/**
 * Update invoice status
 */
async function updateInvoiceStatus(invoiceId, status) {
  try {
    const db = await mongodb.getDb();
    
    const updateData = {
      status: status,
      payment_date: status === 'paid' ? new Date() : null
    };
    
    const result = await db.collection('invoices').findOneAndUpdate(
      { _id: new ObjectId(invoiceId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      throw new Error('Invoice not found');
    }
    
    return result.value;
  } catch (error) {
    console.error(`Error updating invoice status for invoice ${invoiceId}:`, error);
    throw error;
  }
}

/**
 * Get all entities from a collection with optional filtering
 */
async function getAllEntities(collectionName, filters = {}, limit = 100, offset = 0) {
  try {
    const db = await mongodb.getDb();
    
    // Convert string IDs to ObjectId if present in filters
    Object.keys(filters).forEach(key => {
      if (key === '_id' || key.endsWith('_id')) {
        try {
          filters[key] = new ObjectId(filters[key]);
        } catch (error) {
          // If not a valid ObjectId, leave as is
        }
      }
    });
    
    // Execute the query with limit and skip for pagination
    const result = await db.collection(collectionName)
      .find(filters)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .toArray();
      
    return result;
  } catch (error) {
    console.error(`Error getting entities from ${collectionName}:`, error);
    throw error;
  }
}

module.exports = {
  getDashboardStats,
  getRecentActivity,
  updateInvoiceStatus,
  getAllEntities
}; 