// API endpoint for getting a single expense by ID
export default async function handler(req, res) {
  const { id } = req.query;

  // For demo purpose, return a mock expense
  // In a real application, this would fetch from a database
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock expense data
    const expense = {
      _id: id,
      description: "Office equipment purchase",
      amount: 1299.99,
      date: "2023-11-10",
      category: "Equipment",
      vendor: "TechSupplies Inc.",
      payment_method: "Credit Card",
      status: "paid",
      notes: "New laptops for the design team. 3-year warranty included.",
      receipt_url: "https://example.com/receipts/tech-supplies-123.pdf",
      created_at: "2023-11-10",
      updated_at: "2023-11-10"
    };
    
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
} 