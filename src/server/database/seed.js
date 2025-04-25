/**
 * Seed script for MongoDB database
 */
const mongodb = require('./mongodb-config');
const { ObjectId } = require('mongodb');

// Sample data
const invoices = [
  {
    _id: new ObjectId().toString(),
    invoice_number: "INV-2023-001",
    client_name: "Acme Corporation",
    client_email: "billing@acmecorp.com",
    amount: 2500.00,
    status: "paid",
    payment_date: new Date("2023-01-15"),
    due_date: new Date("2023-01-15"),
    description: "Website redesign project - Phase 1",
    items: [
      { name: "UI/UX Design", quantity: 1, price: 1200.00 },
      { name: "Frontend Development", quantity: 1, price: 800.00 },
      { name: "Backend Integration", quantity: 1, price: 500.00 }
    ],
    created_at: new Date("2023-01-01"),
    updated_at: new Date("2023-01-15")
  },
  {
    _id: new ObjectId().toString(),
    invoice_number: "INV-2023-002",
    client_name: "Globex Industries",
    client_email: "accounting@globex.com",
    amount: 1800.00,
    status: "paid",
    payment_date: new Date("2023-02-20"),
    due_date: new Date("2023-02-15"),
    description: "Mobile app development",
    items: [
      { name: "App Design", quantity: 1, price: 600.00 },
      { name: "Development", quantity: 1, price: 1200.00 }
    ],
    created_at: new Date("2023-02-01"),
    updated_at: new Date("2023-02-20")
  },
  {
    _id: new ObjectId().toString(),
    invoice_number: "INV-2023-003",
    client_name: "Wayne Enterprises",
    client_email: "finance@wayne.com",
    amount: 3500.00,
    status: "paid",
    payment_date: new Date("2023-03-10"),
    due_date: new Date("2023-03-15"),
    description: "Security system upgrade",
    items: [
      { name: "Security Audit", quantity: 1, price: 1000.00 },
      { name: "System Implementation", quantity: 1, price: 2500.00 }
    ],
    created_at: new Date("2023-03-01"),
    updated_at: new Date("2023-03-10")
  },
  {
    _id: new ObjectId().toString(),
    invoice_number: "INV-2023-004",
    client_name: "Stark Industries",
    client_email: "billing@stark.com",
    amount: 4200.00,
    status: "paid",
    payment_date: new Date("2023-04-25"),
    due_date: new Date("2023-04-20"),
    description: "Energy efficiency consultation",
    items: [
      { name: "Energy Audit", quantity: 1, price: 1200.00 },
      { name: "Consultation", quantity: 10, price: 300.00 }
    ],
    created_at: new Date("2023-04-05"),
    updated_at: new Date("2023-04-25")
  },
  {
    _id: new ObjectId().toString(),
    invoice_number: "INV-2023-005",
    client_name: "Oscorp",
    client_email: "finance@oscorp.com",
    amount: 5000.00,
    status: "paid",
    payment_date: new Date("2023-05-15"),
    due_date: new Date("2023-05-15"),
    description: "Biotech research partnership",
    items: [
      { name: "Research Collaboration", quantity: 1, price: 5000.00 }
    ],
    created_at: new Date("2023-05-01"),
    updated_at: new Date("2023-05-15")
  },
  {
    _id: new ObjectId().toString(),
    invoice_number: "INV-2023-006",
    client_name: "Acme Corporation",
    client_email: "billing@acmecorp.com",
    amount: 3000.00,
    status: "pending",
    due_date: new Date("2023-12-15"),
    description: "Website redesign project - Phase 2",
    items: [
      { name: "Advanced Features", quantity: 1, price: 1500.00 },
      { name: "Performance Optimization", quantity: 1, price: 1500.00 }
    ],
    created_at: new Date("2023-11-15"),
    updated_at: new Date("2023-11-15")
  }
];

const expenses = [
  {
    _id: new ObjectId().toString(),
    description: "Office supplies",
    amount: 250.00,
    date: new Date("2023-01-15"),
    category: "Office Supplies",
    vendor: "Office Depot",
    payment_method: "Credit Card",
    status: "paid",
    created_at: new Date("2023-01-15"),
    updated_at: new Date("2023-01-15")
  },
  {
    _id: new ObjectId().toString(),
    description: "Software subscriptions",
    amount: 800.00,
    date: new Date("2023-02-05"),
    category: "Software",
    vendor: "Adobe",
    payment_method: "Credit Card",
    status: "paid",
    created_at: new Date("2023-02-05"),
    updated_at: new Date("2023-02-05")
  },
  {
    _id: new ObjectId().toString(),
    description: "Client meeting lunch",
    amount: 120.00,
    date: new Date("2023-03-12"),
    category: "Meals",
    vendor: "Restaurant",
    payment_method: "Credit Card",
    status: "paid",
    created_at: new Date("2023-03-12"),
    updated_at: new Date("2023-03-12")
  },
  {
    _id: new ObjectId().toString(),
    description: "Office utilities",
    amount: 350.00,
    date: new Date("2023-04-01"),
    category: "Utilities",
    vendor: "Electric Company",
    payment_method: "Bank Transfer",
    status: "paid",
    created_at: new Date("2023-04-01"),
    updated_at: new Date("2023-04-01")
  },
  {
    _id: new ObjectId().toString(),
    description: "Marketing campaign",
    amount: 1200.00,
    date: new Date("2023-05-10"),
    category: "Marketing",
    vendor: "Marketing Agency",
    payment_method: "Bank Transfer",
    status: "paid",
    created_at: new Date("2023-05-10"),
    updated_at: new Date("2023-05-10")
  },
  {
    _id: new ObjectId().toString(),
    description: "Office equipment purchase",
    amount: 1299.99,
    date: new Date("2023-11-10"),
    category: "Equipment",
    vendor: "TechSupplies Inc.",
    payment_method: "Credit Card",
    status: "paid",
    receipt_url: "https://example.com/receipts/tech-supplies-123.pdf",
    notes: "New laptops for the design team. 3-year warranty included.",
    created_at: new Date("2023-11-10"),
    updated_at: new Date("2023-11-10")
  }
];

const clients = [
  {
    _id: new ObjectId().toString(),
    name: "John Smith",
    email: "john.smith@acmecorp.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corporation",
    address: "123 Business Ave, Suite 101, New York, NY 10001",
    industry: "Technology",
    website: "https://acmecorp.example.com",
    notes: "Key client for our enterprise services. Prefers communication via email. Quarterly review meetings scheduled.",
    total_invoices: 2,
    total_revenue: 5500.00,
    last_invoice_date: new Date("2023-11-15"),
    status: "active",
    created_at: new Date("2022-05-10"),
    updated_at: new Date("2023-11-10")
  },
  {
    _id: new ObjectId().toString(),
    name: "Jane Doe",
    email: "jane.doe@globex.com",
    phone: "+1 (555) 987-6543",
    company: "Globex Industries",
    address: "456 Corporate Blvd, Chicago, IL 60601",
    industry: "Manufacturing",
    website: "https://globex.example.com",
    total_invoices: 1,
    total_revenue: 1800.00,
    last_invoice_date: new Date("2023-02-20"),
    status: "active",
    created_at: new Date("2022-06-15"),
    updated_at: new Date("2023-02-20")
  },
  {
    _id: new ObjectId().toString(),
    name: "Bruce Wayne",
    email: "bruce.wayne@wayne.com",
    phone: "+1 (555) 456-7890",
    company: "Wayne Enterprises",
    address: "1007 Mountain Drive, Gotham City, NJ 08302",
    industry: "Technology",
    website: "https://wayne.example.com",
    total_invoices: 1,
    total_revenue: 3500.00,
    last_invoice_date: new Date("2023-03-10"),
    status: "active",
    created_at: new Date("2022-07-20"),
    updated_at: new Date("2023-03-10")
  },
  {
    _id: new ObjectId().toString(),
    name: "Tony Stark",
    email: "tony.stark@stark.com",
    phone: "+1 (555) 234-5678",
    company: "Stark Industries",
    address: "10880 Malibu Point, Malibu, CA 90265",
    industry: "Energy",
    website: "https://stark.example.com",
    total_invoices: 1,
    total_revenue: 4200.00,
    last_invoice_date: new Date("2023-04-25"),
    status: "active",
    created_at: new Date("2022-08-30"),
    updated_at: new Date("2023-04-25")
  },
  {
    _id: new ObjectId().toString(),
    name: "Norman Osborn",
    email: "norman.osborn@oscorp.com",
    phone: "+1 (555) 345-6789",
    company: "Oscorp",
    address: "1200 Corporate Headquarters, New York, NY 10001",
    industry: "Biotechnology",
    website: "https://oscorp.example.com",
    total_invoices: 1,
    total_revenue: 5000.00,
    last_invoice_date: new Date("2023-05-15"),
    status: "active",
    created_at: new Date("2022-09-10"),
    updated_at: new Date("2023-05-15")
  }
];

const transactions = [
  {
    _id: new ObjectId().toString(),
    description: "Client payment for Project Alpha",
    amount: 5000.00,
    date: new Date("2023-11-12"),
    type: "income",
    category: "Client Payment",
    account: "Business Checking",
    payment_method: "Bank Transfer",
    reference: "INV-2023-456",
    notes: "Final payment for Phase 1 of Project Alpha",
    created_at: new Date("2023-11-12"),
    updated_at: new Date("2023-11-12")
  },
  {
    _id: new ObjectId().toString(),
    description: "Office rent payment",
    amount: 2000.00,
    date: new Date("2023-11-01"),
    type: "expense",
    category: "Rent",
    account: "Business Checking",
    payment_method: "Bank Transfer",
    reference: "RENT-NOV-2023",
    created_at: new Date("2023-11-01"),
    updated_at: new Date("2023-11-01")
  },
  {
    _id: new ObjectId().toString(),
    description: "Software subscription payment",
    amount: 50.00,
    date: new Date("2023-11-05"),
    type: "expense",
    category: "Software",
    account: "Business Credit Card",
    payment_method: "Credit Card",
    reference: "SUB-123456",
    created_at: new Date("2023-11-05"),
    updated_at: new Date("2023-11-05")
  }
];

// Seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    const db = await mongodb.connect();
    console.log('Connected to MongoDB. Starting data seeding...');
    
    // Drop existing collections (if they exist)
    console.log('Dropping existing collections...');
    try {
      await db.collection('invoices').drop();
      await db.collection('expenses').drop();
      await db.collection('clients').drop();
      await db.collection('transactions').drop();
    } catch (error) {
      // Ignore errors if collections don't exist
      console.log('Some collections might not exist yet, continuing...');
    }
    
    // Insert the seed data
    console.log('Inserting invoices...');
    await db.collection('invoices').insertMany(invoices);
    
    console.log('Inserting expenses...');
    await db.collection('expenses').insertMany(expenses);
    
    console.log('Inserting clients...');
    await db.collection('clients').insertMany(clients);
    
    console.log('Inserting transactions...');
    await db.collection('transactions').insertMany(transactions);
    
    console.log('Database seeded successfully!');
    console.log(`Added ${invoices.length} invoices`);
    console.log(`Added ${expenses.length} expenses`);
    console.log(`Added ${clients.length} clients`);
    console.log(`Added ${transactions.length} transactions`);
    
    // Close the connection
    await mongodb.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 