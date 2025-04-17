const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();
const db = require('../database/config');

// Mock data for development/testing
const mockExpenses = [
  { id: 1, category: 'Office Supplies', amount: '120.50', date: '2023-08-18', vendor: 'Staples' },
  { id: 2, category: 'Software', amount: '499.99', date: '2023-08-15', vendor: 'Adobe' },
  { id: 3, category: 'Utilities', amount: '200.00', date: '2023-08-10', vendor: 'Electric Company' },
  { id: 4, category: 'Travel', amount: '350.75', date: '2023-08-05', vendor: 'Airline Inc' },
  { id: 5, category: 'Marketing', amount: '750.00', date: '2023-08-01', vendor: 'Ad Agency' }
];

// Get all expenses
router.get('/', async (req, res) => {
  try {
    // Check if we should use mock data
    if (process.env.USE_MOCK_DATA === 'true') {
      console.log('Using mock expense data (forced by environment variable)');
      return res.status(200).json({ 
        success: true, 
        data: mockExpenses,
        source: 'mock'
      });
    }

    // Try to get data from database
    const result = await db.query('SELECT * FROM expenses ORDER BY date DESC LIMIT 10');
    
    // If no results or empty, use mock data
    if (!result || !result.rows || result.rows.length === 0) {
      console.log('No expenses found in database, using mock data');
      return res.status(200).json({ 
        success: true, 
        data: mockExpenses,
        source: 'mock'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows,
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    // Fall back to mock data on error
    res.status(200).json({ 
      success: true, 
      data: mockExpenses,
      source: 'mock (database error fallback)'
    });
  }
});

// Get expenses by category
router.get('/by-category', async (req, res) => {
  try {
    const expensesByCategory = await Expense.getByCategory();
    res.json(expensesByCategory);
  } catch (error) {
    console.error('Error getting expenses by category:', error);
    res.status(500).json({ error: 'Failed to get expenses by category' });
  }
});

// Get expenses by date range
router.get('/by-date-range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const expenses = await Expense.getByDateRange(startDate, endDate);
    res.json(expenses);
  } catch (error) {
    console.error('Error getting expenses by date range:', error);
    res.status(500).json({ error: 'Failed to get expenses by date range' });
  }
});

// Get a specific expense by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if we should use mock data
    if (process.env.USE_MOCK_DATA === 'true') {
      const mockExpense = mockExpenses.find(exp => exp.id === parseInt(id));
      if (mockExpense) {
        return res.status(200).json({ 
          success: true, 
          data: mockExpense,
          source: 'mock'
        });
      }
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const result = await db.query('SELECT * FROM expenses WHERE id = $1', [id]);
    
    if (!result.rows.length) {
      // Try mock data if not found in database
      const mockExpense = mockExpenses.find(exp => exp.id === parseInt(id));
      if (mockExpense) {
        return res.status(200).json({ 
          success: true, 
          data: mockExpense,
          source: 'mock'
        });
      }
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0],
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching expense:', error);
    // Check if we can find the expense in mock data
    const { id } = req.params;
    const mockExpense = mockExpenses.find(exp => exp.id === parseInt(id));
    if (mockExpense) {
      return res.status(200).json({ 
        success: true, 
        data: mockExpense,
        source: 'mock (database error fallback)'
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new expense
router.post('/', async (req, res) => {
  try {
    const requiredFields = ['amount', 'category', 'date'];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Update an expense
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.update(req.params.id, req.body);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found or no valid updates provided' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error(`Error updating expense ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.delete(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully', expense });
  } catch (error) {
    console.error(`Error deleting expense ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router; 