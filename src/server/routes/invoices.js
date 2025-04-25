const express = require('express');
const Invoice = require('../models/Invoice');
const router = express.Router();

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.getAll();
    res.json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve invoices'
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
    
    // In a real implementation, this would fetch from MongoDB
    const mongodb = require('../database/mongodb-config');
    const db = await mongodb.getDb();
    
    // If MongoDB is connected, attempt to fetch from database
    if (mongodb.getConnectionStatus()) {
      try {
        const invoice = await db.collection('invoices').findOne({ _id: id });
        
        if (invoice) {
          return res.json({ success: true, data: invoice });
        }
      } catch (dbError) {
        console.error('Database error when fetching invoice:', dbError);
        // Fall through to mock data
      }
    }
    
    // If we reach here, either MongoDB is not connected or the invoice wasn't found
    // Return mock data
    const mockInvoice = {
      _id: id,
      invoice_number: "INV-2023-" + id.substring(0, 4),
      client_name: "Acme Corporation",
      client_email: "billing@acmecorp.com",
      amount: 2500.00,
      status: "pending",
      due_date: "2023-12-15",
      description: "Website redesign project for Q4 2023",
      items: [
        {
          name: "UI/UX Design",
          quantity: 1,
          price: 1200.00
        },
        {
          name: "Frontend Development",
          quantity: 1,
          price: 800.00
        },
        {
          name: "Backend Integration",
          quantity: 1,
          price: 500.00
        }
      ],
      created_at: "2023-11-15",
      updated_at: "2023-11-15"
    };
    
    return res.json({ 
      success: true, 
      data: mockInvoice,
      source: 'mock',
      database_status: mongodb.getConnectionStatus() ? 'connected but record not found' : 'disconnected'
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ success: false, message: error.message });
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