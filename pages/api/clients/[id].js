// API endpoint for getting a single client by ID
export default async function handler(req, res) {
  const { id } = req.query;

  // For demo purpose, return a mock client
  // In a real application, this would fetch from a database
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock client data
    const client = {
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
    
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
} 