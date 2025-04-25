const express = require('express');
const Client = require('../models/Client');
const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.getAll();
    res.json(clients);
  } catch (error) {
    console.error('Error getting clients:', error);
    res.status(500).json({ error: 'Failed to get clients' });
  }
});

// Get a specific client by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, this would fetch from MongoDB
    const mongodb = require('../database/mongodb-config');
    const db = await mongodb.getDb();
    
    // If MongoDB is connected, attempt to fetch from database
    if (mongodb.getConnectionStatus()) {
      try {
        const client = await db.collection('clients').findOne({ _id: id });
        
        if (client) {
          return res.json({ success: true, data: client });
        }
      } catch (dbError) {
        console.error('Database error when fetching client:', dbError);
        // Fall through to mock data
      }
    }
    
    // If we reach here, either MongoDB is not connected or the client wasn't found
    // Return mock data
    const mockClient = {
      _id: id,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      company: "Acme Corporation",
      address: "123 Business Ave, Suite 101, New York, NY 10001",
      industry: "Technology",
      website: "https://acmecorp.example.com",
      notes: "Key client for our enterprise services. Prefers communication via email. Quarterly review meetings scheduled.",
      total_invoices: 12,
      total_revenue: 15750.00,
      last_invoice_date: "2023-11-05",
      status: "active",
      created_at: "2022-05-10",
      updated_at: "2023-11-10"
    };
    
    return res.json({ 
      success: true, 
      data: mockClient,
      source: 'mock',
      database_status: mongodb.getConnectionStatus() ? 'connected but record not found' : 'disconnected'
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all invoices for a client
router.get('/:id/invoices', async (req, res) => {
  try {
    const client = await Client.getById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    const invoices = await Client.getInvoices(req.params.id);
    res.json(invoices);
  } catch (error) {
    console.error(`Error getting invoices for client ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to get client invoices' });
  }
});

// Create a new client
router.post('/', async (req, res) => {
  try {
    const requiredFields = ['name'];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update a client
router.put('/:id', async (req, res) => {
  try {
    const client = await Client.update(req.params.id, req.body);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found or no valid updates provided' });
    }
    
    res.json(client);
  } catch (error) {
    console.error(`Error updating client ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete a client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.delete(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json({ message: 'Client deleted successfully', client });
  } catch (error) {
    console.error(`Error deleting client ${req.params.id}:`, error);
    
    if (error.message && error.message.includes('Cannot delete client')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router; 