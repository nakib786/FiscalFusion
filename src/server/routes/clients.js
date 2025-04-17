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
    const client = await Client.getById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(client);
  } catch (error) {
    console.error(`Error getting client ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to get client' });
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