/**
 * Mock Expense model
 * This is a placeholder until we implement the actual database model
 */

// Mock data
const mockExpenses = [
  {
    id: 1,
    amount: 750.00,
    category: 'Software',
    description: 'Annual subscription for design software',
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    receipt_url: null,
    vendor: 'DesignSoft Inc.',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    amount: 120.00,
    category: 'Office Supplies',
    description: 'Printer paper and ink cartridges',
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    receipt_url: null,
    vendor: 'Office Depot',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    amount: 85.00,
    category: 'Utilities',
    description: 'Internet service',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    receipt_url: null,
    vendor: 'Comcast Business',
    created_at: new Date().toISOString()
  }
];

/**
 * Get all expenses
 * @returns {Promise<Array>} Array of expenses
 */
const getAll = async () => {
  // In a real app, this would query the database
  return [...mockExpenses];
};

/**
 * Get expense by ID
 * @param {number} id - Expense ID
 * @returns {Promise<Object|null>} Expense object or null if not found
 */
const getById = async (id) => {
  // In a real app, this would query the database
  const expense = mockExpenses.find(exp => exp.id === parseInt(id));
  return expense || null;
};

/**
 * Create a new expense
 * @param {Object} data - Expense data
 * @returns {Promise<Object>} Created expense
 */
const create = async (data) => {
  // In a real app, this would insert to the database
  const newExpense = {
    id: mockExpenses.length + 1,
    ...data,
    created_at: new Date().toISOString()
  };
  mockExpenses.push(newExpense);
  return newExpense;
};

/**
 * Update an expense
 * @param {number} id - Expense ID
 * @param {Object} data - Expense data to update
 * @returns {Promise<Object|null>} Updated expense or null if not found
 */
const update = async (id, data) => {
  // In a real app, this would update the database
  const index = mockExpenses.findIndex(exp => exp.id === parseInt(id));
  
  if (index === -1) return null;
  
  mockExpenses[index] = {
    ...mockExpenses[index],
    ...data
  };
  
  return mockExpenses[index];
};

/**
 * Delete an expense
 * @param {number} id - Expense ID
 * @returns {Promise<Object|null>} Deleted expense or null if not found
 */
const deleteExpense = async (id) => {
  // In a real app, this would delete from the database
  const index = mockExpenses.findIndex(exp => exp.id === parseInt(id));
  
  if (index === -1) return null;
  
  const deletedExpense = mockExpenses[index];
  mockExpenses.splice(index, 1);
  
  return deletedExpense;
};

/**
 * Get summary of expenses by category
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Summary of expenses
 */
const getSummary = async (params = {}) => {
  const { startDate, endDate } = params;
  
  // Filter expenses by date range if provided
  let filteredExpenses = [...mockExpenses];
  
  if (startDate) {
    filteredExpenses = filteredExpenses.filter(
      exp => new Date(exp.date) >= new Date(startDate)
    );
  }
  
  if (endDate) {
    filteredExpenses = filteredExpenses.filter(
      exp => new Date(exp.date) <= new Date(endDate)
    );
  }
  
  // Group by category
  const byCategory = {};
  
  for (const expense of filteredExpenses) {
    const category = expense.category || 'Uncategorized';
    
    if (!byCategory[category]) {
      byCategory[category] = {
        category,
        count: 0,
        total: 0
      };
    }
    
    byCategory[category].count++;
    byCategory[category].total += parseFloat(expense.amount);
  }
  
  return {
    total: filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0),
    count: filteredExpenses.length,
    byCategory: Object.values(byCategory)
  };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteExpense,
  getSummary
}; 