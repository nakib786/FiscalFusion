/**
 * Mock Invoice model
 * This is a placeholder until we implement the actual database model
 */

// Mock data
const mockInvoices = [
  {
    id: 1,
    client_id: 1,
    client_name: 'Acme Corporation',
    amount: 2500.00,
    status: 'unpaid',
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payment_date: null,
    notes: 'Website development project',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    client_id: 2,
    client_name: 'TechStart Inc.',
    amount: 1800.00,
    status: 'paid',
    due_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payment_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Consulting services',
    created_at: new Date().toISOString()
  }
];

/**
 * Get all invoices
 * @returns {Promise<Array>} Array of invoices
 */
const getAll = async () => {
  // In a real app, this would query the database
  return [...mockInvoices];
};

/**
 * Get invoice by ID
 * @param {number} id - Invoice ID
 * @returns {Promise<Object|null>} Invoice object or null if not found
 */
const getById = async (id) => {
  // In a real app, this would query the database
  const invoice = mockInvoices.find(inv => inv.id === parseInt(id));
  return invoice || null;
};

/**
 * Create a new invoice
 * @param {Object} data - Invoice data
 * @returns {Promise<Object>} Created invoice
 */
const create = async (data) => {
  // In a real app, this would insert to the database
  const newInvoice = {
    id: mockInvoices.length + 1,
    ...data,
    created_at: new Date().toISOString()
  };
  mockInvoices.push(newInvoice);
  return newInvoice;
};

/**
 * Update an invoice
 * @param {number} id - Invoice ID
 * @param {Object} data - Invoice data to update
 * @returns {Promise<Object|null>} Updated invoice or null if not found
 */
const update = async (id, data) => {
  // In a real app, this would update the database
  const index = mockInvoices.findIndex(inv => inv.id === parseInt(id));
  
  if (index === -1) return null;
  
  mockInvoices[index] = {
    ...mockInvoices[index],
    ...data
  };
  
  return mockInvoices[index];
};

/**
 * Delete an invoice
 * @param {number} id - Invoice ID
 * @returns {Promise<Object|null>} Deleted invoice or null if not found
 */
const deleteInvoice = async (id) => {
  // In a real app, this would delete from the database
  const index = mockInvoices.findIndex(inv => inv.id === parseInt(id));
  
  if (index === -1) return null;
  
  const deletedInvoice = mockInvoices[index];
  mockInvoices.splice(index, 1);
  
  return deletedInvoice;
};

/**
 * Send reminders for invoices
 * @returns {Promise<Object>} Reminder results
 */
const sendReminders = async () => {
  // In a real app, this would generate and send reminders
  const overdue = mockInvoices.filter(inv => 
    inv.status === 'unpaid' && 
    new Date(inv.due_date) < new Date()
  );
  
  const upcoming = mockInvoices.filter(inv => 
    inv.status === 'unpaid' && 
    new Date(inv.due_date) >= new Date() &&
    new Date(inv.due_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  
  return {
    overdue,
    upcoming,
    total: overdue.length + upcoming.length
  };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteInvoice,
  sendReminders
}; 