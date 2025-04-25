/**
 * Invoice model for MongoDB database interaction
 */

const mongodb = require('../database/mongodb-config');
const { ObjectId } = require('mongodb');

/**
 * Get all invoices
 * @returns {Promise<Array>} Array of invoices
 */
const getAll = async () => {
  try {
    const db = await mongodb.getDb();
    // Use aggregation to join with clients collection to get client name
    const invoices = await db.collection('invoices').aggregate([
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
        $sort: { due_date: -1 }
      }
    ]).toArray();
    
    return invoices;
  } catch (error) {
    console.error('Error retrieving invoices:', error);
    throw error;
  }
};

/**
 * Get invoice by ID
 * @param {string} id - Invoice ID
 * @returns {Promise<Object|null>} Invoice object or null if not found
 */
const getById = async (id) => {
  try {
    const db = await mongodb.getDb();
    // Use aggregation to join with clients collection to get client name
    const invoices = await db.collection('invoices').aggregate([
      {
        $match: { _id: new ObjectId(id) }
      },
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
      }
    ]).toArray();
    
    return invoices.length > 0 ? invoices[0] : null;
  } catch (error) {
    console.error(`Error retrieving invoice ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new invoice
 * @param {Object} data - Invoice data
 * @returns {Promise<Object>} Created invoice
 */
const create = async (data) => {
  try {
    const db = await mongodb.getDb();
    const newInvoice = {
      client_id: new ObjectId(data.client_id),
      amount: parseFloat(data.amount),
      status: data.status || 'unpaid',
      due_date: new Date(data.due_date),
      payment_date: data.payment_date ? new Date(data.payment_date) : null,
      notes: data.notes,
      created_at: new Date()
    };
    
    const result = await db.collection('invoices').insertOne(newInvoice);
    
    // Get the client name for the newly created invoice
    if (result.insertedId) {
      const client = await db.collection('clients').findOne({ _id: new ObjectId(data.client_id) });
      
      if (client) {
        return { 
          _id: result.insertedId, 
          ...newInvoice, 
          client_name: client.name 
        };
      }
    }
    
    return { _id: result.insertedId, ...newInvoice };
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

/**
 * Update an invoice
 * @param {string} id - Invoice ID
 * @param {Object} data - Invoice data to update
 * @returns {Promise<Object|null>} Updated invoice or null if not found
 */
const update = async (id, data) => {
  try {
    const db = await mongodb.getDb();
    const updateData = {};
    
    // Only include fields that are provided
    if (data.client_id !== undefined) updateData.client_id = new ObjectId(data.client_id);
    if (data.amount !== undefined) updateData.amount = parseFloat(data.amount);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.due_date !== undefined) updateData.due_date = new Date(data.due_date);
    if (data.payment_date !== undefined) updateData.payment_date = data.payment_date ? new Date(data.payment_date) : null;
    if (data.notes !== undefined) updateData.notes = data.notes;
    
    // If no valid fields were provided to update, return null
    if (Object.keys(updateData).length === 0) {
      return null;
    }
    
    const result = await db.collection('invoices').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    // Get the client name for the updated invoice
    if (result.value) {
      const client = await db.collection('clients').findOne({ _id: result.value.client_id });
      
      if (client) {
        result.value.client_name = client.name;
      }
    }
    
    return result.value;
  } catch (error) {
    console.error(`Error updating invoice ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an invoice
 * @param {string} id - Invoice ID
 * @returns {Promise<Object|null>} Deleted invoice or null if not found
 */
const deleteInvoice = async (id) => {
  try {
    const db = await mongodb.getDb();
    
    // Delete any invoice items first
    await db.collection('invoice_items').deleteMany({ invoice_id: new ObjectId(id) });
    
    // Then delete the invoice
    const result = await db.collection('invoices').findOneAndDelete({ _id: new ObjectId(id) });
    
    return result.value;
  } catch (error) {
    console.error(`Error deleting invoice ${id}:`, error);
    throw error;
  }
};

/**
 * Send reminders for invoices
 * @returns {Promise<Object>} Reminder results
 */
const sendReminders = async () => {
  try {
    const db = await mongodb.getDb();
    
    // Get overdue invoices
    const overdue = await db.collection('invoices').aggregate([
      {
        $match: {
          status: 'unpaid',
          due_date: { $lt: new Date() }
        }
      },
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
        $sort: { due_date: 1 }
      }
    ]).toArray();
    
    // Get upcoming invoices due in the next 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const upcoming = await db.collection('invoices').aggregate([
      {
        $match: {
          status: 'unpaid',
          due_date: { 
            $gte: new Date(),
            $lte: sevenDaysFromNow
          }
        }
      },
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
        $sort: { due_date: 1 }
      }
    ]).toArray();
    
    return {
      overdue,
      upcoming,
      total: overdue.length + upcoming.length
    };
  } catch (error) {
    console.error('Error getting invoice reminders:', error);
    throw error;
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteInvoice,
  sendReminders
}; 