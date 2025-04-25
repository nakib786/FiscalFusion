// API endpoint for getting a single transaction by ID
export default async function handler(req, res) {
  const { id } = req.query;

  // For demo purpose, return a mock transaction
  // In a real application, this would fetch from a database
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock transaction data
    const transaction = {
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
    
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
} 