const express = require('express');
const Invoice = require('../models/Invoice');
const router = express.Router();
const db = require('../database/config');

// Mock data for development/testing
const mockInvoices = [
  { id: 1, client_name: 'Acme Corp', amount: '1500.00', status: 'paid', due_date: '2023-08-15' },
  { id: 2, client_name: 'Globex Inc', amount: '2450.00', status: 'unpaid', due_date: '2023-09-01' },
  { id: 3, client_name: 'Stark Industries', amount: '3200.00', status: 'paid', due_date: '2023-08-20' },
  { id: 4, client_name: 'Wayne Enterprises', amount: '1800.00', status: 'overdue', due_date: '2023-08-10' },
  { id: 5, client_name: 'Oscorp', amount: '950.00', status: 'unpaid', due_date: '2023-09-05' }
];

// Get all invoices
router.get('/', async (req, res) => {
  try {
    // Check if we should use mock data
    if (process.env.USE_MOCK_DATA === 'true') {
      console.log('Using mock invoice data (forced by environment variable)');
      return res.status(200).json({ 
        success: true, 
        data: mockInvoices,
        source: 'mock'
      });
    }

    // Try to get data from database
    const result = await db.query('SELECT * FROM invoices ORDER BY created_at DESC LIMIT 10');
    
    // If no results or empty, use mock data
    if (!result || !result.rows || result.rows.length === 0) {
      console.log('No invoices found in database, using mock data');
      return res.status(200).json({ 
        success: true, 
        data: mockInvoices,
        source: 'mock'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows,
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    // Fall back to mock data on error
    res.status(200).json({ 
      success: true, 
      data: mockInvoices,
      source: 'mock (database error fallback)'
    });
  }
});

// Get overdue and upcoming invoice reminders
// This specific route needs to come before the more generic /:id route
router.get('/reminders/all', async (req, res) => {
  try {
    const reminders = await Invoice.sendReminders();
    res.json(reminders);
  } catch (error) {
    console.error('Error getting invoice reminders:', error);
    res.status(500).json({ error: 'Failed to get invoice reminders' });
  }
});

// Get a specific invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if we should use mock data
    if (process.env.USE_MOCK_DATA === 'true') {
      const mockInvoice = mockInvoices.find(inv => inv.id === parseInt(id));
      if (mockInvoice) {
        return res.status(200).json({ 
          success: true, 
          data: mockInvoice,
          source: 'mock'
        });
      }
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const result = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
    
    if (!result.rows.length) {
      // Try mock data if not found in database
      const mockInvoice = mockInvoices.find(inv => inv.id === parseInt(id));
      if (mockInvoice) {
        return res.status(200).json({ 
          success: true, 
          data: mockInvoice,
          source: 'mock'
        });
      }
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0],
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    // Check if we can find the invoice in mock data
    const { id } = req.params;
    const mockInvoice = mockInvoices.find(inv => inv.id === parseInt(id));
    if (mockInvoice) {
      return res.status(200).json({ 
        success: true, 
        data: mockInvoice,
        source: 'mock (database error fallback)'
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new invoice
router.post('/', async (req, res) => {
  try {
    const requiredFields = ['client_id', 'amount', 'due_date'];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Update an invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.update(req.params.id, req.body);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found or no valid updates provided' });
    }
    
    res.json(invoice);
  } catch (error) {
    console.error(`Error updating invoice ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Delete an invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.delete(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json({ message: 'Invoice deleted successfully', invoice });
  } catch (error) {
    console.error(`Error deleting invoice ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

module.exports = router; 