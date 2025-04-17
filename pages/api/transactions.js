import { mockCashFlowData } from '../../data/mockData';

// Simple in-memory database for transactions
// In a production app, this would be replaced with a real database
let transactionsDB = [];
let isInitialized = false;

// Initialize the database with mock data if it's empty
function initializeDB(dateRange) {
  if (!isInitialized) {
    transactionsDB = generateTransactions(dateRange);
    isInitialized = true;
  }
  return transactionsDB;
}

export default function handler(req, res) {
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'PUT':
      return handleUpdate(req, res);
    case 'POST':
      return handleCreate(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

function handleGet(req, res) {
  const { dateRange = 'month', status, type, category, search, page = 1, limit = 50 } = req.query;
  
  try {
    // Initialize or get the transactions
    let transactions = initializeDB(dateRange);
    
    // Apply filters if provided
    if (status) {
      transactions = transactions.filter(t => t.status === status);
    }
    
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }
    
    if (category) {
      if (category === 'uncategorized') {
        transactions = transactions.filter(t => !t.category);
      } else {
        transactions = transactions.filter(t => t.category === category);
      }
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      transactions = transactions.filter(t => 
        t.description.toLowerCase().includes(searchLower) ||
        t.payee.toLowerCase().includes(searchLower)
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);
    
    // Return data with pagination metadata
    res.status(200).json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        total: transactions.length,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(transactions.length / limit)
      }
    });
  } catch (error) {
    console.error('Error in transactions API:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
}

function handleUpdate(req, res) {
  try {
    // Get ID from the URL path (/api/transactions/[id])
    const { id } = req.query;
    const updateData = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction ID is required'
      });
    }
    
    // Find the transaction by ID (support both id and _id for compatibility)
    const index = transactionsDB.findIndex(t => t.id === id || t._id === id);
    
    if (index === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found'
      });
    }
    
    // Update the transaction
    transactionsDB[index] = {
      ...transactionsDB[index],
      ...updateData,
      // Add updated timestamp
      updatedAt: new Date().toISOString()
    };
    
    return res.status(200).json({ 
      success: true, 
      data: transactionsDB[index],
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

function handleCreate(req, res) {
  try {
    const transactionData = req.body;
    
    if (!transactionData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction data is required'
      });
    }
    
    // Generate a new ID
    const newId = `tr-${Date.now()}`;
    
    // Create the new transaction
    const newTransaction = {
      id: newId,
      ...transactionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to the database
    transactionsDB.push(newTransaction);
    
    return res.status(201).json({ 
      success: true, 
      data: newTransaction,
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

function generateTransactions(dateRange) {
  const types = ['income', 'expense'];
  const statuses = ['categorized', 'uncategorized', 'reviewed'];
  const categories = {
    income: ['Client Payment', 'Product Sales', 'Consulting', 'Dividends', 'Royalties', 'Other Income'],
    expense: ['Office Rent', 'Utilities', 'Payroll', 'Software Subscriptions', 'Travel', 'Marketing', 'Equipment', 'Supplies', 'Other Expense']
  };
  
  const accounts = ['Checking Account', 'Savings Account', 'Business Credit Card'];
  const payees = ['ABC Client', 'XYZ Supplier', 'Utility Company', 'Office Supply Store', 'Software Vendor', 'Marketing Agency'];
  
  let daysToInclude = 30; // default to month
  
  switch (dateRange) {
    case 'week':
      daysToInclude = 7;
      break;
    case 'month':
      daysToInclude = 30;
      break;
    case 'quarter':
      daysToInclude = 90;
      break;
    case 'year':
      daysToInclude = 365;
      break;
    default:
      daysToInclude = 30;
  }
  
  const transactions = [];
  // Generate more transactions for longer date ranges
  const numTransactions = Math.min(Math.max(daysToInclude, 20), 100);
  
  for (let i = 0; i < numTransactions; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[type][Math.floor(Math.random() * categories[type].length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const account = accounts[Math.floor(Math.random() * accounts.length)];
    const payee = payees[Math.floor(Math.random() * payees.length)];
    
    const amount = type === 'income' 
      ? Math.floor(Math.random() * 5000) + 500 
      : -(Math.floor(Math.random() * 3000) + 200);
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysToInclude));
    
    transactions.push({
      id: `tr-${i + 1}`,
      date: date.toISOString().split('T')[0],
      type,
      category: status === 'uncategorized' ? null : category,
      status,
      amount,
      account,
      payee,
      description: `${type === 'income' ? 'Payment from' : 'Payment to'} ${payee}`,
      notes: Math.random() > 0.7 ? 'Custom note for this transaction' : '',
      attachments: Math.random() > 0.8 ? [{ name: 'receipt.pdf', url: '#' }] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  // Import some transactions from mockCashFlowData if available
  if (mockCashFlowData && mockCashFlowData.recentTransactions) {
    mockCashFlowData.recentTransactions.forEach((t, index) => {
      transactions.push({
        id: `mock-${index}`,
        date: t.date,
        type: t.amount > 0 ? 'income' : 'expense',
        category: t.category,
        status: 'categorized',
        amount: t.amount,
        account: 'Primary Account',
        payee: t.merchant || t.category,
        description: t.description || `${t.amount > 0 ? 'Income' : 'Expense'} - ${t.category}`,
        notes: '',
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
} 