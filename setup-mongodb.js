/**
 * Setup script for MongoDB database
 * Creates collections and imports initial data
 */
const mongodb = require('./src/server/database/mongodb-config');
const { ObjectId } = require('mongodb');

// Create collections and add indexes
async function setupCollections() {
  try {
    const db = await mongodb.getDb();
    
    // Create clients collection
    await db.createCollection('clients');
    await db.collection('clients').createIndex({ email: 1 }, { unique: true, sparse: true });
    console.log('Created clients collection');
    
    // Create invoices collection
    await db.createCollection('invoices');
    await db.collection('invoices').createIndex({ client_id: 1 });
    await db.collection('invoices').createIndex({ status: 1 });
    await db.collection('invoices').createIndex({ due_date: 1 });
    console.log('Created invoices collection');
    
    // Create invoice_items collection
    await db.createCollection('invoice_items');
    await db.collection('invoice_items').createIndex({ invoice_id: 1 });
    console.log('Created invoice_items collection');
    
    // Create expenses collection
    await db.createCollection('expenses');
    await db.collection('expenses').createIndex({ category: 1 });
    await db.collection('expenses').createIndex({ date: 1 });
    console.log('Created expenses collection');
    
    // Create assets collection
    await db.createCollection('assets');
    await db.collection('assets').createIndex({ category: 1 });
    console.log('Created assets collection');
    
    // Create liabilities collection
    await db.createCollection('liabilities');
    await db.collection('liabilities').createIndex({ category: 1 });
    console.log('Created liabilities collection');
    
    // Create cash_transactions collection
    await db.createCollection('cash_transactions');
    await db.collection('cash_transactions').createIndex({ type: 1 });
    await db.collection('cash_transactions').createIndex({ date: 1 });
    console.log('Created cash_transactions collection');
    
    // Create transactions collection (for the cashflow and business overview pages)
    await db.createCollection('transactions');
    await db.collection('transactions').createIndex({ date: 1 });
    await db.collection('transactions').createIndex({ type: 1 });
    await db.collection('transactions').createIndex({ category: 1 });
    await db.collection('transactions').createIndex({ status: 1 });
    console.log('Created transactions collection');
    
    // Create report_templates collection
    await db.createCollection('report_templates');
    await db.collection('report_templates').createIndex({ type: 1 });
    console.log('Created report_templates collection');
    
    console.log('All collections created successfully');
  } catch (error) {
    console.error('Error creating collections:', error);
    throw error;
  }
}

// Seed the database with sample data
async function seedData() {
  try {
    const db = await mongodb.getDb();
    
    // Check if data already exists
    const clientCount = await db.collection('clients').countDocuments();
    if (clientCount > 0) {
      console.log('Data already exists, skipping seed');
      return;
    }
    
    // Insert sample clients
    const clientsResult = await db.collection('clients').insertMany([
      {
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '555-123-4567',
        address: '123 Main St, Business City',
        notes: 'Regular client',
        created_at: new Date()
      },
      {
        name: 'TechStart Inc.',
        email: 'info@techstart.com',
        phone: '555-987-6543',
        address: '456 Tech Ave, Innovation District',
        notes: 'New client, high priority',
        created_at: new Date()
      }
    ]);
    console.log(`Inserted ${clientsResult.insertedCount} clients`);
    
    // Get client IDs for reference
    const acmeId = clientsResult.insertedIds[0];
    const techStartId = clientsResult.insertedIds[1];
    
    // Insert sample invoices
    const invoicesResult = await db.collection('invoices').insertMany([
      {
        client_id: acmeId,
        amount: 2500.00,
        status: 'unpaid',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        payment_date: null,
        notes: 'Website development project',
        created_at: new Date()
      },
      {
        client_id: techStartId,
        amount: 1800.00,
        status: 'paid',
        due_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        payment_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        notes: 'Consulting services',
        created_at: new Date()
      }
    ]);
    console.log(`Inserted ${invoicesResult.insertedCount} invoices`);
    
    // Get invoice IDs for reference
    const invoice1Id = invoicesResult.insertedIds[0];
    const invoice2Id = invoicesResult.insertedIds[1];
    
    // Insert invoice items
    await db.collection('invoice_items').insertMany([
      {
        invoice_id: invoice1Id,
        description: 'Website Design',
        quantity: 1,
        unit_price: 1500.00,
        amount: 1500.00,
        created_at: new Date()
      },
      {
        invoice_id: invoice1Id,
        description: 'Website Development',
        quantity: 10,
        unit_price: 100.00,
        amount: 1000.00,
        created_at: new Date()
      },
      {
        invoice_id: invoice2Id,
        description: 'Consulting Hours',
        quantity: 12,
        unit_price: 150.00,
        amount: 1800.00,
        created_at: new Date()
      }
    ]);
    console.log('Inserted invoice items');
    
    // Insert sample expenses
    await db.collection('expenses').insertMany([
      {
        amount: 750.00,
        category: 'Software',
        description: 'Annual subscription for design software',
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        vendor: 'DesignSoft Inc.',
        created_at: new Date()
      },
      {
        amount: 120.00,
        category: 'Office Supplies',
        description: 'Printer paper and ink cartridges',
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        vendor: 'Office Depot',
        created_at: new Date()
      },
      {
        amount: 85.00,
        category: 'Utilities',
        description: 'Internet service',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        vendor: 'Comcast Business',
        created_at: new Date()
      }
    ]);
    console.log('Inserted expenses');
    
    // Insert sample transactions
    await db.collection('transactions').insertMany([
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        type: 'income',
        category: 'Client Payment',
        status: 'categorized',
        amount: 1800.00,
        account: 'Checking Account',
        payee: 'TechStart Inc.',
        description: 'Payment received for consulting services',
        notes: 'Invoice #2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        type: 'expense',
        category: 'Software',
        status: 'categorized',
        amount: -750.00,
        account: 'Business Credit Card',
        payee: 'DesignSoft Inc.',
        description: 'Annual subscription for design software',
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        type: 'expense',
        category: 'Office Supplies',
        status: 'categorized',
        amount: -120.00,
        account: 'Checking Account',
        payee: 'Office Depot',
        description: 'Printer paper and ink cartridges',
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        type: 'expense',
        category: 'Utilities',
        status: 'categorized',
        amount: -85.00,
        account: 'Checking Account',
        payee: 'Comcast Business',
        description: 'Internet service',
        notes: 'Monthly bill',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        type: 'income',
        category: 'Product Sales',
        status: 'categorized',
        amount: 350.00,
        account: 'Checking Account',
        payee: 'Walk-in Customer',
        description: 'Product sale - Item #123',
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('Inserted transactions');
    
    // Insert sample assets
    await db.collection('assets').insertMany([
      {
        name: 'Business Checking Account',
        category: 'Cash',
        amount: 8500.00,
        date: new Date(),
        notes: 'Main operating account',
        created_at: new Date()
      },
      {
        name: 'Office Equipment',
        category: 'Fixed Assets',
        amount: 3200.00,
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        notes: 'Computers, printers, etc.',
        created_at: new Date()
      }
    ]);
    console.log('Inserted assets');
    
    // Insert sample liabilities
    await db.collection('liabilities').insertMany([
      {
        name: 'Business Credit Card',
        category: 'Credit Card',
        amount: 1250.00,
        date: new Date(),
        notes: 'Monthly expenses',
        created_at: new Date()
      },
      {
        name: 'Office Lease',
        category: 'Long-term Liabilities',
        amount: 12000.00,
        date: new Date(),
        notes: '12-month lease contract',
        created_at: new Date()
      }
    ]);
    console.log('Inserted liabilities');
    
    // Insert sample cash transactions
    await db.collection('cash_transactions').insertMany([
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        type: 'deposit',
        amount: 1800.00,
        account: 'Business Checking Account',
        description: 'Client payment - TechStart Inc.',
        created_at: new Date()
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: 'withdrawal',
        amount: 500.00,
        account: 'Business Checking Account',
        description: 'Office rent payment',
        created_at: new Date()
      }
    ]);
    console.log('Inserted cash transactions');
    
    // Insert sample report templates
    await db.collection('report_templates').insertMany([
      {
        name: 'Standard Balance Sheet',
        type: 'balance_sheet',
        config: { showDetails: true, includeZeroBalances: false },
        created_at: new Date()
      },
      {
        name: 'Quarterly Income Statement',
        type: 'income_statement',
        config: { showDetails: true, categorizeExpenses: true },
        created_at: new Date()
      }
    ]);
    console.log('Inserted report templates');
    
    console.log('Database successfully seeded with initial data');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Main function to setup the database
async function setupDatabase() {
  try {
    console.log('Starting MongoDB database setup...');
    
    // Initialize connection
    await mongodb.connect();
    console.log('Connected to MongoDB');
    
    // Setup collections with indexes
    await setupCollections();
    
    // Seed initial data
    await seedData();
    
    console.log('MongoDB setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    // Close connection
    await mongodb.close();
  }
}

// Run the setup if the file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = {
  setupDatabase,
  setupCollections,
  seedData
}; 
setupDatabase(); 