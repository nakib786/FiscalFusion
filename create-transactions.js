/**
 * Script to create sample transactions in the transactions collection
 */
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fiscalfusion';

// Get command line arguments
const args = process.argv.slice(2);
const forceDelete = args.includes('--force') || args.includes('-f');

async function createTransactions() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(mongoURI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db();
    const collection = db.collection('transactions');
    
    // Check if transactions already exist
    const existing = await collection.countDocuments();
    console.log(`Found ${existing} existing transactions`);
    
    if (existing > 0) {
      if (forceDelete) {
        await collection.deleteMany({});
        console.log('Existing transactions deleted due to --force flag');
      } else {
        console.log('Keeping existing transactions. Use --force flag to replace them.');
        return;
      }
    }
    
    // Create sample transactions
    const sampleTransactions = [
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
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        type: 'expense',
        category: 'Marketing',
        status: 'categorized',
        amount: -250.00,
        account: 'Business Credit Card',
        payee: 'Facebook Ads',
        description: 'Social media advertising',
        notes: 'Monthly campaign',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: 'expense',
        category: 'Travel',
        status: 'categorized',
        amount: -320.00,
        account: 'Business Credit Card',
        payee: 'Airlines Inc.',
        description: 'Flight tickets for client meeting',
        notes: 'Trip to New York',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        type: 'income',
        category: 'Consulting',
        status: 'categorized',
        amount: 950.00,
        account: 'Checking Account',
        payee: 'Acme Corporation',
        description: 'Strategy consulting session',
        notes: 'Monthly retainer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert transactions
    const result = await collection.insertMany(sampleTransactions);
    console.log(`${result.insertedCount} sample transactions created successfully`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
createTransactions().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 