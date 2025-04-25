// Next.js API route for cashflow - connects directly to database
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const { timeframe = 'month' } = req.query;
  
  try {
    // Connect to MongoDB using the shared client
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch data from different collections
    const invoices = await db.collection('invoices').find({}).toArray();
    const expenses = await db.collection('expenses').find({}).toArray();
    const transactions = await db.collection('transactions').find({}).sort({ date: -1 }).toArray();
    
    // Process data based on timeframe
    const data = processDataForTimeframe(invoices, expenses, transactions, timeframe);
    
    // Return the aggregated data
    return res.status(200).json({
      success: true,
      source: 'database',
      data
    });
  } catch (error) {
    console.error('Cash Flow API error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve cash flow data',
      message: error.message
    });
  }
}

// Helper function to process data based on timeframe
function processDataForTimeframe(invoices, expenses, transactions, timeframe) {
  // Calculate current balance
  const totalIncome = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + (parseFloat(invoice.amount) || 0), 0);
  
  const totalExpenses = expenses
    .reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
  
  const balance = totalIncome - totalExpenses;
  
  // Generate monthly data
  const monthlyData = generateMonthlyData(invoices, expenses, timeframe);
  
  // Filter and format transactions based on timeframe
  const filteredTransactions = filterTransactionsByTimeframe(transactions, timeframe);
  
  // Generate forecasts
  const forecast = generateForecast(monthlyData);
  
  // Generate insights
  const insights = generateInsights(invoices, expenses, transactions);
  
  return {
    balance,
    monthlyData,
    transactions: filteredTransactions,
    forecast,
    insights
  };
}

// Helper function to generate monthly data based on timeframe
function generateMonthlyData(invoices, expenses, timeframe) {
  // Define date ranges based on timeframe
  const now = new Date();
  let startDate, endDate;
  let labels = [];
    
    switch(timeframe) {
      case 'week':
      // Past 7 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      endDate = now;
      
      // Create daily labels
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }
      break;
      
      case 'quarter':
      // Past 3 months
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 3);
      endDate = now;
      
      // Create monthly labels
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }
      break;
      
      case 'year':
      // Past 12 months
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      endDate = now;
      
      // Create monthly labels for a year
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }
      break;
      
      case 'month':
      default:
      // Past month, show weekly data
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      endDate = now;
      
      // Create weekly labels
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      break;
  }
  
  // Initialize data structure for the result
  const result = labels.map(label => ({
    month: label,
    moneyIn: 0,
    moneyOut: 0,
    netCashFlow: 0
  }));
  
  // Group and summarize invoices by date period
  invoices.forEach(invoice => {
    const invoiceDate = new Date(invoice.date || invoice.created_at || invoice.due_date);
    
    // Skip if invoice is outside the time range
    if (invoiceDate < startDate || invoiceDate > endDate) return;
    
    if (invoice.status === 'paid') {
      const amount = parseFloat(invoice.amount) || 0;
      const index = getIndexForDate(invoiceDate, startDate, endDate, timeframe, labels.length);
      
      if (index >= 0 && index < result.length) {
        result[index].moneyIn += amount;
      }
    }
  });
  
  // Group and summarize expenses by date period
  expenses.forEach(expense => {
    const expenseDate = new Date(expense.date || expense.created_at);
    
    // Skip if expense is outside the time range
    if (expenseDate < startDate || expenseDate > endDate) return;
    
    const amount = parseFloat(expense.amount) || 0;
    const index = getIndexForDate(expenseDate, startDate, endDate, timeframe, labels.length);
    
    if (index >= 0 && index < result.length) {
      result[index].moneyOut += amount;
    }
  });
  
  // Calculate net cash flow
  result.forEach(item => {
    item.netCashFlow = item.moneyIn - item.moneyOut;
  });
  
  return result;
}

// Helper function to get index for a date within a period
function getIndexForDate(date, startDate, endDate, timeframe, numPeriods) {
  const totalMillis = endDate - startDate;
  const dateMillis = date - startDate;
  const normalizedPosition = dateMillis / totalMillis;
  
  // Special case for month timeframe (using weeks)
  if (timeframe === 'month') {
    // Divide the month into 4 weeks
    const weekNumber = Math.floor(normalizedPosition * 4);
    return Math.min(weekNumber, numPeriods - 1);
  }
  
  // For other timeframes, calculate position based on normalized time
  const periodIndex = Math.floor(normalizedPosition * numPeriods);
  return Math.min(Math.max(0, periodIndex), numPeriods - 1);
}

// Helper function to filter transactions by timeframe
function filterTransactionsByTimeframe(transactions, timeframe) {
  const now = new Date();
  let startDate;
  
  switch(timeframe) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
      
    case 'quarter':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 3);
      break;
      
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
      
    case 'month':
    default:
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
  }
  
  // Filter transactions within the timeframe
  return transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= now;
    })
    .slice(0, 20); // Limit to 20 transactions for performance
}

// Helper function to generate forecast
function generateForecast(monthlyData) {
    // Calculate next month forecast based on average growth
    const sumCurrentData = monthlyData.reduce((sum, item) => sum + item.netCashFlow, 0);
  const avgMonthly = sumCurrentData / monthlyData.length;
  
  // Calculate growth rate (if possible)
  let growthRate = 0;
  if (monthlyData.length >= 2) {
    const recentHalf = monthlyData.slice(Math.floor(monthlyData.length / 2));
    const olderHalf = monthlyData.slice(0, Math.floor(monthlyData.length / 2));
    
    const recentAvg = recentHalf.reduce((sum, item) => sum + item.netCashFlow, 0) / recentHalf.length;
    const olderAvg = olderHalf.reduce((sum, item) => sum + item.netCashFlow, 0) / olderHalf.length;
    
    if (olderAvg !== 0) {
      growthRate = (recentAvg - olderAvg) / Math.abs(olderAvg);
    }
  }
  
  // Apply growth rate to forecast
  const nextMonth = Math.round(avgMonthly * (1 + growthRate));
  
  // 3-month average forecast
  const threeMontAvg = Math.round(avgMonthly * (1 + growthRate * 2));
    
    return {
      nextMonth,
      threeMontAvg
    };
}

// Helper function to generate insights
function generateInsights(invoices, expenses, transactions) {
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
  const totalIncome = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + (parseFloat(invoice.amount) || 0), 0);
  
  const totalExpense = expenses
    .reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
  
  const cashflowTrend = totalIncome > totalExpense ? 'increasing' : 'decreasing';
    
    return {
      topIncomeSource,
      topExpense,
      cashflowTrend
  };
} 