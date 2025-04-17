const express = require('express');
const FinancialReport = require('../models/FinancialReport');
const router = express.Router();
const db = require('../database/config');

// Mock data for development/testing
const mockReportData = {
  revenueByMonth: [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 10800 },
    { month: 'Mar', revenue: 15200 },
    { month: 'Apr', revenue: 13600 },
    { month: 'May', revenue: 17300 },
    { month: 'Jun', revenue: 14200 }
  ],
  expensesByCategory: [
    { category: 'Office Supplies', amount: 1250 },
    { category: 'Software', amount: 3500 },
    { category: 'Utilities', amount: 1800 },
    { category: 'Travel', amount: 2300 },
    { category: 'Marketing', amount: 4200 }
  ],
  profitLoss: [
    { month: 'Jan', revenue: 12500, expenses: 7800, profit: 4700 },
    { month: 'Feb', revenue: 10800, expenses: 6500, profit: 4300 },
    { month: 'Mar', revenue: 15200, expenses: 9800, profit: 5400 },
    { month: 'Apr', revenue: 13600, expenses: 8900, profit: 4700 },
    { month: 'May', revenue: 17300, expenses: 10500, profit: 6800 },
    { month: 'Jun', revenue: 14200, expenses: 9100, profit: 5100 }
  ],
  topClients: [
    { name: 'Acme Corporation', revenue: 15600 },
    { name: 'Globex Industries', revenue: 12400 },
    { name: 'Wayne Enterprises', revenue: 9800 },
    { name: 'Stark Industries', revenue: 8700 },
    { name: 'Oscorp', revenue: 7500 }
  ]
};

// Generate a balance sheet
router.get('/balance-sheet', async (req, res) => {
  try {
    const { date } = req.query;
    const reportDate = date ? new Date(date) : new Date();
    
    const balanceSheet = await FinancialReport.generateBalanceSheet(reportDate);
    res.json(balanceSheet);
  } catch (error) {
    console.error('Error generating balance sheet:', error);
    res.status(500).json({ error: 'Failed to generate balance sheet' });
  }
});

// Generate an income statement
router.get('/income-statement', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const incomeStatement = await FinancialReport.generateIncomeStatement(startDate, endDate);
    res.json(incomeStatement);
  } catch (error) {
    console.error('Error generating income statement:', error);
    res.status(500).json({ error: 'Failed to generate income statement' });
  }
});

// Generate a cash flow statement
router.get('/cash-flow', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const cashFlowStatement = await FinancialReport.generateCashFlowStatement(startDate, endDate);
    res.json(cashFlowStatement);
  } catch (error) {
    console.error('Error generating cash flow statement:', error);
    res.status(500).json({ error: 'Failed to generate cash flow statement' });
  }
});

// Get asset details
router.get('/assets', async (req, res) => {
  try {
    const { date } = req.query;
    const reportDate = date ? new Date(date) : new Date();
    
    const assets = await FinancialReport.getAssetDetails(reportDate);
    res.json(assets);
  } catch (error) {
    console.error('Error getting asset details:', error);
    res.status(500).json({ error: 'Failed to get asset details' });
  }
});

// Get liability details
router.get('/liabilities', async (req, res) => {
  try {
    const { date } = req.query;
    const reportDate = date ? new Date(date) : new Date();
    
    const liabilities = await FinancialReport.getLiabilityDetails(reportDate);
    res.json(liabilities);
  } catch (error) {
    console.error('Error getting liability details:', error);
    res.status(500).json({ error: 'Failed to get liability details' });
  }
});

// Get revenue details
router.get('/revenue', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const revenue = await FinancialReport.getRevenueDetails(startDate, endDate);
    res.json(revenue);
  } catch (error) {
    console.error('Error getting revenue details:', error);
    res.status(500).json({ error: 'Failed to get revenue details' });
  }
});

// Get expense details
router.get('/expenses', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const expenses = await FinancialReport.getExpenseDetails(startDate, endDate);
    res.json(expenses);
  } catch (error) {
    console.error('Error getting expense details:', error);
    res.status(500).json({ error: 'Failed to get expense details' });
  }
});

// Get all reports
router.get('/', async (req, res) => {
  try {
    const { timeframe } = req.query;
    
    // Check if we should use mock data
    if (process.env.USE_MOCK_DATA === 'true') {
      console.log('Using mock report data (forced by environment variable)');
      return res.status(200).json({ 
        success: true, 
        data: mockReportData,
        timeframe: timeframe || 'month',
        source: 'mock'
      });
    }

    // Try to get data from database
    // In a real app, we would query different tables and aggregate data
    
    // Example query (simplified)
    const revenueResult = await db.query(`
      SELECT to_char(date_trunc('month', created_at), 'Mon') as month, 
             SUM(amount) as revenue 
      FROM invoices 
      WHERE status = 'paid' 
      GROUP BY date_trunc('month', created_at) 
      ORDER BY date_trunc('month', created_at)
    `).catch(err => null);
    
    // If database query failed, use mock data
    if (!revenueResult) {
      console.log('Database query failed, using mock data for reports');
      return res.status(200).json({ 
        success: true, 
        data: mockReportData,
        timeframe: timeframe || 'month',
        source: 'mock (database error fallback)'
      });
    }
    
    // In a real app, we would continue with other queries and construct the full report
    // For now, we'll just use the mock data for simplicity
    return res.status(200).json({ 
      success: true, 
      data: mockReportData,
      timeframe: timeframe || 'month',
      source: 'mock (database integration pending)'
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    // Fall back to mock data on error
    res.status(200).json({ 
      success: true, 
      data: mockReportData,
      source: 'mock (error fallback)'
    });
  }
});

module.exports = router; 