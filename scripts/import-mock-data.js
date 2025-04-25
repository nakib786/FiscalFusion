/**
 * Script to import mock data into MongoDB database
 * This script will create sample invoices and clients for testing purposes
 */

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

// Mock data to import
const mockData = {
  invoices: [
    { client_name: 'Acme Corp', amount: 1500.00, status: 'paid', due_date: '2023-08-15', notes: 'Website development' },
    { client_name: 'Globex Inc', amount: 2450.00, status: 'unpaid', due_date: '2023-09-01', notes: 'Mobile app design' },
    { client_name: 'Stark Industries', amount: 3200.00, status: 'paid', due_date: '2023-08-20', notes: 'Security system upgrade' },
    { client_name: 'Wayne Enterprises', amount: 1800.00, status: 'overdue', due_date: '2023-08-10', notes: 'Consulting services' },
    { client_name: 'Oscorp', amount: 950.00, status: 'unpaid', due_date: '2023-09-05', notes: 'Marketing campaign' },
    { client_name: 'Umbrella Corp', amount: 2750.00, status: 'paid', due_date: '2023-09-15', notes: 'Research services' },
    { client_name: 'Cyberdyne Systems', amount: 5500.00, status: 'unpaid', due_date: '2023-10-01', notes: 'AI development' },
    { client_name: 'Aperture Science', amount: 1200.00, status: 'overdue', due_date: '2023-08-05', notes: 'Testing services' },
    { client_name: 'Tyrell Corporation', amount: 3800.00, status: 'paid', due_date: '2023-09-10', notes: 'Hardware prototyping' },
    { client_name: 'Massive Dynamic', amount: 2100.00, status: 'unpaid', due_date: '2023-09-20', notes: 'Strategic consulting' }
  ],
  
  clients: [
    { name: 'Acme Corporation', email: 'contact@acme.com', phone: '555-123-4567', address: '123 Main St, Anytown, CA 90210' },
    { name: 'Globex Inc', email: 'info@globex.com', phone: '555-987-6543', address: '456 Market St, Business City, NY 10001' },
    { name: 'Stark Industries', email: 'sales@stark.com', phone: '555-467-8901', address: '789 Innovation Way, Tech Valley, CA 94025' },
    { name: 'Wayne Enterprises', email: 'info@wayne.com', phone: '555-234-5678', address: '1007 Mountain Dr, Gotham City, NJ 07101' },
    { name: 'Oscorp', email: 'contact@oscorp.com', phone: '555-345-6789', address: '888 Science Blvd, Research Park, MA 02142' },
    { name: 'Umbrella Corp', email: 'info@umbrella.com', phone: '555-456-7890', address: '777 Pharma Dr, Raccoon City, WA 98101' },
    { name: 'Cyberdyne Systems', email: 'sales@cyberdyne.com', phone: '555-567-8901', address: '101 Future Ave, Silicon Valley, CA 94301' },
    { name: 'Aperture Science', email: 'testing@aperture.com', phone: '555-678-9012', address: '404 Lab Way, Test Facility, MI 49931' },
    { name: 'Tyrell Corporation', email: 'contact@tyrell.com', phone: '555-789-0123', address: '555 Replicant Rd, Los Angeles, CA 90017' },
    { name: 'Massive Dynamic', email: 'info@massivedynamic.com', phone: '555-890-1234', address: '303 Corporate Plaza, New York, NY 10013' }
  ],
  
  expenses: [
    { category: 'Office Supplies', amount: 250.00, date: '2023-07-25', vendor: 'Office Depot', notes: 'Paper, pens, and folders' },
    { category: 'Travel', amount: 850.00, date: '2023-08-03', vendor: 'Delta Airlines', notes: 'Flight to client meeting' },
    { category: 'Software', amount: 120.00, date: '2023-08-10', vendor: 'Adobe', notes: 'Monthly subscription' },
    { category: 'Meals', amount: 75.00, date: '2023-08-15', vendor: 'Restaurant', notes: 'Client lunch' },
    { category: 'Hardware', amount: 1200.00, date: '2023-08-20', vendor: 'Apple', notes: 'New laptop' },
    { category: 'Utilities', amount: 180.00, date: '2023-08-25', vendor: 'Power Company', notes: 'Monthly bill' },
    { category: 'Internet', amount: 90.00, date: '2023-08-28', vendor: 'ISP Provider', notes: 'Monthly service' },
    { category: 'Rent', amount: 2200.00, date: '2023-09-01', vendor: 'Property Management', notes: 'Office space' },
    { category: 'Insurance', amount: 350.00, date: '2023-09-05', vendor: 'Insurance Co', notes: 'Business insurance' },
    { category: 'Marketing', amount: 500.00, date: '2023-09-10', vendor: 'Facebook', notes: 'Ad campaign' }
  ]
};

// Add created_at and updated_at timestamps and IDs to all data
const now = new Date();
mockData.invoices = mockData.invoices.map(invoice => ({
  ...invoice,
  created_at: now,
  updated_at: now,
  invoice_number: `INV-${Math.floor(1000 + Math.random() * 9000)}`
}));

mockData.clients = mockData.clients.map(client => ({
  ...client,
  created_at: now,
  updated_at: now,
  client_id: `CLI-${uuidv4().substring(0, 5)}`
}));

mockData.expenses = mockData.expenses.map(expense => ({
  ...expense,
  created_at: now,
  updated_at: now,
  expense_id: `EXP-${Math.floor(1000 + Math.random() * 9000)}`
}));

async function importData() {
  console.log('Connecting to MongoDB...');
  const client = await MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', { useUnifiedTopology: true });
  
  try {
    const db = client.db('fiscalfusion');
    console.log('Connected to database');
    
    // Import clients
    console.log('Importing clients...');
    const clientsCollection = db.collection('clients');
    const clientResult = await clientsCollection.insertMany(mockData.clients);
    console.log(`${clientResult.insertedCount} clients inserted`);
    
    // Import invoices
    console.log('Importing invoices...');
    const invoicesCollection = db.collection('invoices');
    const invoiceResult = await invoicesCollection.insertMany(mockData.invoices);
    console.log(`${invoiceResult.insertedCount} invoices inserted`);
    
    // Import expenses
    console.log('Importing expenses...');
    const expensesCollection = db.collection('expenses');
    const expenseResult = await expensesCollection.insertMany(mockData.expenses);
    console.log(`${expenseResult.insertedCount} expenses inserted`);
    
    console.log('All data imported successfully!');
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the import
importData().catch(console.error); 