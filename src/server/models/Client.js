/**
 * Mock Client model
 * This is a placeholder until we implement the actual database model
 */

// Mock data
const mockClients = [
  {
    id: 1,
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '555-123-4567',
    address: '123 Main St, Business City',
    notes: 'Regular client',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'TechStart Inc.',
    email: 'info@techstart.com',
    phone: '555-987-6543',
    address: '456 Tech Ave, Innovation District',
    notes: 'New client, high priority',
    created_at: new Date().toISOString()
  }
];

// Reference to the Invoice model for getting client invoices
const Invoice = require('./Invoice');

/**
 * Get all clients
 * @returns {Promise<Array>} Array of clients
 */
const getAll = async () => {
  // In a real app, this would query the database
  return [...mockClients];
};

/**
 * Get client by ID
 * @param {number} id - Client ID
 * @returns {Promise<Object|null>} Client object or null if not found
 */
const getById = async (id) => {
  // In a real app, this would query the database
  const client = mockClients.find(c => c.id === parseInt(id));
  return client || null;
};

/**
 * Get invoices for a client
 * @param {number} clientId - Client ID
 * @returns {Promise<Array>} Array of invoices
 */
const getInvoices = async (clientId) => {
  // Get all invoices and filter by client_id
  const allInvoices = await Invoice.getAll();
  return allInvoices.filter(invoice => invoice.client_id === parseInt(clientId));
};

/**
 * Create a new client
 * @param {Object} data - Client data
 * @returns {Promise<Object>} Created client
 */
const create = async (data) => {
  // In a real app, this would insert to the database
  const newClient = {
    id: mockClients.length + 1,
    ...data,
    created_at: new Date().toISOString()
  };
  mockClients.push(newClient);
  return newClient;
};

/**
 * Update a client
 * @param {number} id - Client ID
 * @param {Object} data - Client data to update
 * @returns {Promise<Object|null>} Updated client or null if not found
 */
const update = async (id, data) => {
  // In a real app, this would update the database
  const index = mockClients.findIndex(c => c.id === parseInt(id));
  
  if (index === -1) return null;
  
  mockClients[index] = {
    ...mockClients[index],
    ...data
  };
  
  return mockClients[index];
};

/**
 * Delete a client
 * @param {number} id - Client ID
 * @returns {Promise<Object|null>} Deleted client or null if not found
 */
const deleteClient = async (id) => {
  // In a real app, this would delete from the database
  // Check if client has invoices first
  const clientInvoices = await getInvoices(id);
  
  if (clientInvoices.length > 0) {
    throw new Error('Cannot delete client with existing invoices');
  }
  
  const index = mockClients.findIndex(c => c.id === parseInt(id));
  
  if (index === -1) return null;
  
  const deletedClient = mockClients[index];
  mockClients.splice(index, 1);
  
  return deletedClient;
};

module.exports = {
  getAll,
  getById,
  getInvoices,
  create,
  update,
  delete: deleteClient
}; 