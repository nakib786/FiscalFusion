/**
 * Client model for MongoDB database interaction
 */

const mongodb = require('../database/mongodb-config');
const { ObjectId } = require('mongodb');

/**
 * Get all clients
 * @returns {Promise<Array>} Array of clients
 */
const getAll = async () => {
  try {
    const db = await mongodb.getDb();
    const clients = await db.collection('clients').find().sort({ name: 1 }).toArray();
    return clients;
  } catch (error) {
    console.error('Error retrieving clients:', error);
    throw error;
  }
};

/**
 * Get client by ID
 * @param {string} id - Client ID
 * @returns {Promise<Object|null>} Client object or null if not found
 */
const getById = async (id) => {
  try {
    const db = await mongodb.getDb();
    const client = await db.collection('clients').findOne({ _id: new ObjectId(id) });
    return client;
  } catch (error) {
    console.error(`Error retrieving client ${id}:`, error);
    throw error;
  }
};

/**
 * Get invoices for a client
 * @param {string} clientId - Client ID
 * @returns {Promise<Array>} Array of invoices
 */
const getInvoices = async (clientId) => {
  try {
    const db = await mongodb.getDb();
    const invoices = await db.collection('invoices')
      .find({ client_id: new ObjectId(clientId) })
      .sort({ due_date: -1 })
      .toArray();
    return invoices;
  } catch (error) {
    console.error(`Error retrieving invoices for client ${clientId}:`, error);
    throw error;
  }
};

/**
 * Create a new client
 * @param {Object} data - Client data
 * @returns {Promise<Object>} Created client
 */
const create = async (data) => {
  try {
    const db = await mongodb.getDb();
    const newClient = {
      ...data,
      created_at: new Date()
    };
    
    const result = await db.collection('clients').insertOne(newClient);
    return { _id: result.insertedId, ...newClient };
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

/**
 * Update a client
 * @param {string} id - Client ID
 * @param {Object} data - Client data to update
 * @returns {Promise<Object|null>} Updated client or null if not found
 */
const update = async (id, data) => {
  try {
    const db = await mongodb.getDb();
    
    // Remove any fields that are undefined
    Object.keys(data).forEach(key => 
      data[key] === undefined && delete data[key]
    );
    
    // If no valid fields were provided to update, return null
    if (Object.keys(data).length === 0) {
      return null;
    }
    
    const result = await db.collection('clients').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    );
    
    return result.value;
  } catch (error) {
    console.error(`Error updating client ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a client
 * @param {string} id - Client ID
 * @returns {Promise<Object|null>} Deleted client or null if not found
 */
const deleteClient = async (id) => {
  try {
    const db = await mongodb.getDb();
    
    // Check if client has invoices first
    const invoices = await getInvoices(id);
    
    if (invoices.length > 0) {
      throw new Error('Cannot delete client with existing invoices');
    }
    
    const result = await db.collection('clients').findOneAndDelete({ _id: new ObjectId(id) });
    return result.value;
  } catch (error) {
    console.error(`Error deleting client ${id}:`, error);
    throw error;
  }
};

module.exports = {
  getAll,
  getById,
  getInvoices,
  create,
  update,
  delete: deleteClient
}; 