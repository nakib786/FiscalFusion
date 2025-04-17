/**
 * Mock Report model
 * This is a placeholder until we implement the actual database model
 */

// Import other models for data references
const Invoice = require('./Invoice');
const Expense = require('./Expense');

// Mock report templates
const mockReportTemplates = [
  {
    id: 1,
    name: 'Standard Balance Sheet',
    type: 'balance_sheet',
    config: {
      showDetails: true,
      includeZeroBalances: false
    },
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Quarterly Income Statement',
    type: 'income_statement',
    config: {
      showDetails: true,
      categorizeExpenses: true
    },
    created_at: new Date().toISOString()
  }
];

/**
 * Get all report templates
 * @returns {Promise<Array>} Array of report templates
 */
const getAllTemplates = async () => {
  // In a real app, this would query the database
  return [...mockReportTemplates];
};

/**
 * Get report template by ID
 * @param {number} id - Template ID
 * @returns {Promise<Object|null>} Report template or null if not found
 */
const getTemplateById = async (id) => {
  // In a real app, this would query the database
  const template = mockReportTemplates.find(t => t.id === parseInt(id));
  return template || null;
};

/**
 * Create a new report template
 * @param {Object} data - Template data
 * @returns {Promise<Object>} Created template
 */
const createTemplate = async (data) => {
  // In a real app, this would insert to the database
  const newTemplate = {
    id: mockReportTemplates.length + 1,
    ...data,
    created_at: new Date().toISOString()
  };
  mockReportTemplates.push(newTemplate);
  return newTemplate;
};

/**
 * Generate a balance sheet report
 * @param {Object} params - Report parameters
 * @returns {Promise<Object>} Balance sheet report
 */
const generateBalanceSheet = async (params = {}) => {
  // In a real app, this would query the database for actual financial data
  const assets = [
    { name: 'Cash and Cash Equivalents', amount: 15000 },
    { name: 'Accounts Receivable', amount: 7500 },
    { name: 'Office Equipment', amount: 3200 }
  ];
  
  const liabilities = [
    { name: 'Accounts Payable', amount: 2500 },
    { name: 'Credit Card', amount: 1250 }
  ];
  
  const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const equity = totalAssets - totalLiabilities;
  
  return {
    date: new Date().toISOString().split('T')[0],
    assets,
    liabilities,
    totalAssets,
    totalLiabilities,
    equity
  };
};

/**
 * Generate an income statement report
 * @param {Object} params - Report parameters
 * @returns {Promise<Object>} Income statement report
 */
const generateIncomeStatement = async (params = {}) => {
  const { startDate, endDate } = params;
  
  // Get real data from other models
  const invoices = await Invoice.getAll();
  const expenses = await Expense.getAll();
  
  // Filter by date range if provided
  let filteredInvoices = [...invoices];
  let filteredExpenses = [...expenses];
  
  if (startDate) {
    filteredInvoices = filteredInvoices.filter(
      invoice => invoice.payment_date && new Date(invoice.payment_date) >= new Date(startDate)
    );
    filteredExpenses = filteredExpenses.filter(
      expense => new Date(expense.date) >= new Date(startDate)
    );
  }
  
  if (endDate) {
    filteredInvoices = filteredInvoices.filter(
      invoice => invoice.payment_date && new Date(invoice.payment_date) <= new Date(endDate)
    );
    filteredExpenses = filteredExpenses.filter(
      expense => new Date(expense.date) <= new Date(endDate)
    );
  }
  
  // Calculate revenue
  const revenue = filteredInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
  
  // Calculate expenses
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount), 0
  );
  
  // Group expenses by category
  const expensesByCategory = {};
  for (const expense of filteredExpenses) {
    const category = expense.category || 'Uncategorized';
    if (!expensesByCategory[category]) {
      expensesByCategory[category] = 0;
    }
    expensesByCategory[category] += parseFloat(expense.amount);
  }
  
  return {
    period: {
      startDate: startDate || 'All time',
      endDate: endDate || 'Present'
    },
    revenue,
    expenses: {
      total: totalExpenses,
      byCategory: Object.entries(expensesByCategory).map(([category, amount]) => ({
        category,
        amount
      }))
    },
    netIncome: revenue - totalExpenses
  };
};

/**
 * Generate a cash flow report
 * @param {Object} params - Report parameters
 * @returns {Promise<Object>} Cash flow report
 */
const generateCashFlowReport = async (params = {}) => {
  const { startDate, endDate } = params;
  
  // Mock cash flow data
  const cashInflows = [
    { date: '2023-01-15', source: 'Client Payment', amount: 1800, description: 'Invoice #2' },
    { date: '2023-02-01', source: 'Client Payment', amount: 2500, description: 'Invoice #1' }
  ];
  
  const cashOutflows = [
    { date: '2023-01-05', category: 'Software', amount: 750, description: 'Annual subscription' },
    { date: '2023-01-20', category: 'Office Supplies', amount: 120, description: 'Printer supplies' },
    { date: '2023-01-25', category: 'Utilities', amount: 85, description: 'Internet service' }
  ];
  
  // Calculate totals
  const totalInflows = cashInflows.reduce((sum, inflow) => sum + inflow.amount, 0);
  const totalOutflows = cashOutflows.reduce((sum, outflow) => sum + outflow.amount, 0);
  const netCashFlow = totalInflows - totalOutflows;
  
  return {
    period: {
      startDate: startDate || 'All time',
      endDate: endDate || 'Present'
    },
    cashInflows,
    cashOutflows,
    totalInflows,
    totalOutflows,
    netCashFlow
  };
};

module.exports = {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  generateBalanceSheet,
  generateIncomeStatement,
  generateCashFlowReport
}; 