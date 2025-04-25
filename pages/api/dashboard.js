// Next.js API route for dashboard - connects directly to database
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    console.log('Dashboard API: Connecting to MongoDB Atlas...');
    
    // Connect to MongoDB using the shared client
    const client = await clientPromise;
    console.log('Dashboard API: MongoDB connection established');
    
    const db = client.db();
    console.log('Dashboard API: Database accessed');
    
    // Fetch data from different collections with proper error handling
    console.log('Dashboard API: Fetching collections data...');
    
    let invoices = [], expenses = [], clients = [], transactions = [];
    
    try {
      invoices = await db.collection('invoices').find({}).toArray();
      console.log(`Dashboard API: Fetched ${invoices.length} invoices`);
    } catch (err) {
      console.error('Dashboard API: Error fetching invoices:', err);
      invoices = [];
    }
    
    try {
      expenses = await db.collection('expenses').find({}).toArray();
      console.log(`Dashboard API: Fetched ${expenses.length} expenses`);
    } catch (err) {
      console.error('Dashboard API: Error fetching expenses:', err);
      expenses = [];
    }
    
    try {
      clients = await db.collection('clients').find({}).toArray();
      console.log(`Dashboard API: Fetched ${clients.length} clients`);
    } catch (err) {
      console.error('Dashboard API: Error fetching clients:', err);
      clients = [];
    }
    
    try {
      transactions = await db.collection('transactions').find({}).sort({ date: -1 }).limit(10).toArray();
      console.log(`Dashboard API: Fetched ${transactions.length} transactions`);
    } catch (err) {
      console.error('Dashboard API: Error fetching transactions:', err);
      transactions = [];
    }
    
    // Process the invoices data
    console.log('Dashboard API: Processing data...');
    const currentDate = new Date();
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
    const unpaidInvoices = invoices.filter(invoice => invoice.status === 'unpaid' || invoice.status === 'overdue');
    const overdueInvoices = invoices.filter(invoice => {
      const dueDate = new Date(invoice.due_date);
      return invoice.status !== 'paid' && dueDate < currentDate;
    });
    const notDueYetInvoices = invoices.filter(invoice => {
      const dueDate = new Date(invoice.due_date);
      return invoice.status !== 'paid' && dueDate >= currentDate;
    });
    
    // Calculate totals
    const totalRevenue = paidInvoices.reduce((sum, invoice) => 
      sum + (parseFloat(invoice.amount) || 0), 0);
    
    const totalExpenses = expenses.reduce((sum, expense) => 
      sum + (parseFloat(expense.amount) || 0), 0);
    
    const unpaidTotal = unpaidInvoices.reduce((sum, invoice) => 
      sum + (parseFloat(invoice.amount) || 0), 0);
    
    const overdueTotal = overdueInvoices.reduce((sum, invoice) => 
      sum + (parseFloat(invoice.amount) || 0), 0);
    
    const notDueYetTotal = notDueYetInvoices.reduce((sum, invoice) => 
      sum + (parseFloat(invoice.amount) || 0), 0);
    
    const paidTotal = paidInvoices.reduce((sum, invoice) => 
      sum + (parseFloat(invoice.amount) || 0), 0);
    
    // Calculate deposited vs not deposited (for simplicity, consider 60% deposited)
    const depositedTotal = paidTotal * 0.6;
    const notDepositedTotal = paidTotal * 0.4;
    
    // Generate cash flow data (last 4 months)
    const cashFlowData = generateCashFlowData(invoices, expenses);
    
    // Generate expenses breakdown by category
    const expensesBreakdown = generateExpensesBreakdown(expenses);
    
    // Generate sales data
    const salesData = generateSalesData(invoices);
    
    // Return the aggregated data
    console.log('Dashboard API: Returning successful response');
    return res.status(200).json({
      success: true,
      source: 'database',
      data: {
        // Financial summary data
        totalRevenue,
        totalExpenses,
        netIncome: totalRevenue - totalExpenses,
        unpaidInvoices: unpaidTotal,
        
        // Lists of recent invoices and expenses
        latestInvoices: invoices.slice(0, 5),
        latestExpenses: expenses.slice(0, 5),
        
        // Business overview specific data
        cashBalance: totalRevenue - totalExpenses,
        cashFlowData,
        expensesBreakdown,
        totalIncome: totalRevenue,
        overdueInvoices: overdueTotal,
        notDueYetInvoices: notDueYetTotal,
        paidInvoices: paidTotal,
        notDepositedInvoices: notDepositedTotal,
        depositedInvoices: depositedTotal,
        totalSales: totalRevenue,
        salesData,
        
        // Bank accounts (placeholder values - can be updated with real data if available)
        checkingBalance: totalRevenue - totalExpenses * 0.8,
        checkingInQB: (totalRevenue - totalExpenses * 0.8) * 0.4,
        mastercardBalance: -totalExpenses * 0.2,
        mastercardInQB: -totalExpenses * 0.2 * 0.05,
        
        // Additional cash flow data
        cashFlowInsights: generateCashFlowInsights(invoices, expenses, transactions),
        cashFlowTransactions: transactions
      }
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve dashboard data',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Helper function to generate cash flow data based on real invoices and expenses
function generateCashFlowData(invoices, expenses) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Create data for the last 4 months
  const cashFlowData = [];
  
  for (let i = 3; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const monthName = months[monthIndex];
    
    // Get invoices and expenses for this month
    const monthInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date || invoice.created_at || invoice.due_date);
      return invoiceDate.getMonth() === monthIndex;
    });
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date || expense.created_at);
      return expenseDate.getMonth() === monthIndex;
    });
    
    // Calculate totals
    const moneyIn = monthInvoices.reduce((sum, invoice) => 
      sum + (parseFloat(invoice.amount) || 0), 0);
    
    const moneyOut = monthExpenses.reduce((sum, expense) => 
      sum + (parseFloat(expense.amount) || 0), 0);
    
    cashFlowData.push({
      month: monthName,
      moneyIn,
      moneyOut
    });
  }
  
  return cashFlowData;
}

// Helper function to generate expenses breakdown by category
function generateExpensesBreakdown(expenses) {
  const categoryMap = {};
  
  // Group expenses by category
  expenses.forEach(expense => {
    const category = expense.category || 'Uncategorized';
    const amount = parseFloat(expense.amount) || 0;
    
    if (categoryMap[category]) {
      categoryMap[category] += amount;
    } else {
      categoryMap[category] = amount;
    }
  });
  
  // Convert to array and sort by amount
  const breakdown = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount
  })).sort((a, b) => b.amount - a.amount);
  
  // Return top 3 categories
  return breakdown.slice(0, 3);
}

// Helper function to generate sales data
function generateSalesData(invoices) {
  // Sort invoices by date
  const sortedInvoices = [...invoices].sort((a, b) => {
    const dateA = new Date(a.date || a.created_at || a.due_date);
    const dateB = new Date(b.date || b.created_at || b.due_date);
    return dateB - dateA;
  });
  
  // Take most recent 5 invoices with paid status
  const recentPaidInvoices = sortedInvoices
    .filter(invoice => invoice.status === 'paid')
    .slice(0, 5);
  
  // Format the data
  return recentPaidInvoices.map(invoice => {
    const invoiceDate = new Date(invoice.date || invoice.created_at || invoice.due_date);
    const month = invoiceDate.toLocaleString('default', { month: 'short' });
    const day = invoiceDate.getDate();
    
    return {
      date: `${month} ${day}`,
      amount: parseFloat(invoice.amount) || 0
    };
  });
}

// Helper function to generate cash flow insights
function generateCashFlowInsights(invoices, expenses, transactions) {
  // Find top income source
  const incomeBySource = {};
  invoices.forEach(invoice => {
    const source = invoice.client_name || 'Unknown';
    const amount = parseFloat(invoice.amount) || 0;
    
    if (incomeBySource[source]) {
      incomeBySource[source] += amount;
    } else {
      incomeBySource[source] = amount;
    }
  });
  
  let topIncomeSource = { name: 'Unknown', amount: 0 };
  Object.entries(incomeBySource).forEach(([source, amount]) => {
    if (amount > topIncomeSource.amount) {
      topIncomeSource = { name: source, amount };
    }
  });
  
  // Find top expense
  const expensesByCategory = {};
  expenses.forEach(expense => {
    const category = expense.category || 'Uncategorized';
    const amount = parseFloat(expense.amount) || 0;
    
    if (expensesByCategory[category]) {
      expensesByCategory[category] += amount;
    } else {
      expensesByCategory[category] = amount;
    }
  });
  
  let topExpense = { name: 'Unknown', amount: 0 };
  Object.entries(expensesByCategory).forEach(([category, amount]) => {
    if (amount > topExpense.amount) {
      topExpense = { name: category, amount };
    }
  });
  
  // Determine cashflow trend
  const totalIncome = invoices.reduce((sum, invoice) => sum + (parseFloat(invoice.amount) || 0), 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
  const cashflowTrend = totalIncome > totalExpense ? 'increasing' : 'decreasing';
  
  return {
    topIncomeSource,
    topExpense,
    cashflowTrend
  };
} 