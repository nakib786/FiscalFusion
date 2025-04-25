/**
 * Admin routes for the CMS
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const Client = require('../models/Client');
const Invoice = require('../models/Invoice');

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await adminController.getDashboardStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics'
    });
  }
});

// Get recent activity
router.get('/activity', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const activity = await adminController.getRecentActivity(limit);
    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent activity'
    });
  }
});

// Update invoice status
router.patch('/invoices/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['paid', 'unpaid', 'overdue', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const updatedInvoice = await adminController.updateInvoiceStatus(id, status);
    res.json({
      success: true,
      data: updatedInvoice
    });
  } catch (error) {
    console.error(`Error updating invoice status for invoice ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice status'
    });
  }
});

// Generic entity listing route for admin tables
router.get('/entities/:collectionName', async (req, res) => {
  try {
    const { collectionName } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    
    // Extract filters from query params (exclude limit and offset)
    const filters = { ...req.query };
    delete filters.limit;
    delete filters.offset;
    
    // Security check - only allow specific collections
    const allowedCollections = ['clients', 'invoices', 'expenses', 'assets', 'liabilities', 'cash_transactions'];
    if (!allowedCollections.includes(collectionName)) {
      return res.status(403).json({
        success: false,
        message: `Access to collection '${collectionName}' is not allowed`
      });
    }
    
    const entities = await adminController.getAllEntities(collectionName, filters, limit, offset);
    res.json({
      success: true,
      data: entities
    });
  } catch (error) {
    console.error(`Error getting entities from ${req.params.collectionName}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to get entities'
    });
  }
});

module.exports = router; 