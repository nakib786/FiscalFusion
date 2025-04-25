// GET a single transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, this would fetch from MongoDB
    const mongodb = require('../database/mongodb-config');
    const db = await mongodb.getDb();
    
    // If MongoDB is connected, attempt to fetch from database
    if (mongodb.getConnectionStatus()) {
      try {
        const transaction = await db.collection('transactions').findOne({ _id: id });
        
        if (transaction) {
          return res.json({ success: true, data: transaction });
        }
      } catch (dbError) {
        console.error('Database error when fetching transaction:', dbError);
        // Fall through to mock data
      }
    }
    
    // If we reach here, either MongoDB is not connected or the transaction wasn't found
    // Return mock data
    const mockTransaction = {
      _id: id,
      description: "Client payment for Project Alpha",
      amount: 5000.00,
      date: "2023-11-12",
      type: "income",
      category: "Client Payment",
      account: "Business Checking",
      payment_method: "Bank Transfer",
      reference: "INV-2023-456",
      notes: "Final payment for Phase 1 of Project Alpha",
      attachment_url: "https://example.com/attachments/payment-confirmation.pdf",
      created_at: "2023-11-12",
      updated_at: "2023-11-12"
    };
    
    return res.json({ 
      success: true, 
      data: mockTransaction,
      source: 'mock',
      database_status: mongodb.getConnectionStatus() ? 'connected but record not found' : 'disconnected'
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}); 