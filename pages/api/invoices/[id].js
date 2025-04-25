// API endpoint for getting a single invoice by ID
export default async function handler(req, res) {
  const { id } = req.query;

  // For demo purpose, return a mock invoice
  // In a real application, this would fetch from a database
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock invoice data
    const invoice = {
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
    
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
} 