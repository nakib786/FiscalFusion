// Script to add financial data for reporting purposes
// Run with: node scripts/add-financial-data.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fiscalfusion';

async function addFinancialData() {
  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Collections
    const transactionsCollection = db.collection('transactions');
    const expensesCollection = db.collection('expenses');
    const clientsCollection = db.collection('clients');
    
    // 1. Get existing clients for reference
    const clients = await clientsCollection.find({}).toArray();
    console.log(`Found ${clients.length} clients`);
    
    if (clients.length === 0) {
      throw new Error('No clients found. Please run add-mock-data.js first.');
    }
    
    // 2. Categories for transactions and expenses
    const expenseCategories = [
      'Rent', 'Utilities', 'Office Supplies', 'Software', 'Hardware',
      'Marketing', 'Travel', 'Meals', 'Insurance', 'Equipment', 'Internet'
    ];
    
    const incomeCategories = [
      'Client Payment', 'Consulting', 'Service Fee', 'Product Sale', 'Retainer'
    ];
    
    const accounts = [
      'Business Checking', 'Business Savings', 'Business Credit Card'
    ];
    
    const paymentMethods = [
      'Bank Transfer', 'Credit Card', 'PayPal', 'Cash', 'Check'
    ];
    
    // 3. Helper functions
    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
    const getRandomClient = () => getRandomElement(clients);
    
    const getRandomAmount = (min, max) => {
      return Number((Math.random() * (max - min) + min).toFixed(2));
    };
    
    // Get random date within Jan-Apr 2025
    const getRandomDate = (month) => {
      // If month is specified (1-4 for Jan-Apr), use that month, otherwise random
      const monthToUse = month || Math.floor(Math.random() * 4) + 1;
      const days = [31, 28, 31, 30][monthToUse - 1]; // Days in each month
      const day = Math.floor(Math.random() * days) + 1;
      
      return new Date(`2025-${monthToUse.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T12:00:00.000Z`);
    };
    
    // 4. Generate transactions
    const transactions = [];
    
    // Income transactions - make more in Jan and April, less in Feb and March
    const incomeDistribution = [80, 35, 45, 90]; // Number of transactions per month
    
    for (let month = 1; month <= 4; month++) {
      for (let i = 0; i < incomeDistribution[month - 1]; i++) {
        const client = getRandomClient();
        const date = getRandomDate(month);
        
        // Higher income transactions in the first and last month of quarter
        const baseAmount = (month === 1 || month === 4) ? 
          getRandomAmount(500, 5000) : getRandomAmount(300, 2000);
        
        transactions.push({
          description: `Payment from ${client.name}`,
          amount: baseAmount,
          date: date,
          type: 'income',
          category: getRandomElement(incomeCategories),
          account: getRandomElement(accounts),
          payment_method: getRandomElement(paymentMethods),
          reference: `INV-${date.getFullYear()}-${Math.floor(Math.random() * 10000)}`,
          notes: `Payment for services from ${client.name}`,
          created_at: date,
          updated_at: date
        });
      }
    }
    
    // Expense transactions
    const expenses = [];
    const expenseDistribution = [45, 55, 60, 40]; // Number of transactions per month
    
    for (let month = 1; month <= 4; month++) {
      for (let i = 0; i < expenseDistribution[month - 1]; i++) {
        const date = getRandomDate(month);
        const category = getRandomElement(expenseCategories);
        let amount;
        
        // Set realistic amounts based on category
        switch(category) {
          case 'Rent':
            amount = getRandomAmount(1500, 3000);
            break;
          case 'Marketing':
            amount = getRandomAmount(300, 2000);
            break;
          case 'Software':
            amount = getRandomAmount(50, 500);
            break;
          case 'Hardware':
            amount = getRandomAmount(200, 1500);
            break;
          case 'Travel':
            amount = getRandomAmount(100, 1000);
            break;
          case 'Equipment':
            amount = getRandomAmount(200, 2000);
            break;
          default:
            amount = getRandomAmount(50, 500);
        }
        
        expenses.push({
          description: `${category} expense`,
          amount: amount,
          date: date,
          type: 'expense',
          category: category,
          account: getRandomElement(accounts),
          payment_method: getRandomElement(paymentMethods),
          reference: `EXP-${date.getFullYear()}-${Math.floor(Math.random() * 10000)}`,
          created_at: date,
          updated_at: date
        });
        
        // Add corresponding transaction record
        transactions.push({
          description: `${category} expense payment`,
          amount: amount,
          date: date,
          type: 'expense',
          category: category,
          account: getRandomElement(accounts),
          payment_method: getRandomElement(paymentMethods),
          reference: `EXP-${date.getFullYear()}-${Math.floor(Math.random() * 10000)}`,
          created_at: date,
          updated_at: date
        });
      }
    }
    
    // 5. Insert the financial data
    if (transactions.length > 0) {
      const result = await transactionsCollection.insertMany(transactions);
      console.log(`Added ${result.insertedCount} new transactions`);
    }
    
    if (expenses.length > 0) {
      const result = await expensesCollection.insertMany(expenses);
      console.log(`Added ${result.insertedCount} new expenses`);
    }
    
    console.log('Financial data added successfully!');
    
    // 6. Show summary of data by month
    for (let month = 1; month <= 4; month++) {
      const monthNames = ['January', 'February', 'March', 'April'];
      const monthlyIncome = transactions.filter(t => 
        t.type === 'income' && t.date.getMonth() === month - 1
      ).reduce((sum, t) => sum + t.amount, 0);
      
      const monthlyExpenses = transactions.filter(t => 
        t.type === 'expense' && t.date.getMonth() === month - 1
      ).reduce((sum, t) => sum + t.amount, 0);
      
      console.log(`${monthNames[month - 1]} 2025 Summary:`);
      console.log(`  Income: $${monthlyIncome.toFixed(2)}`);
      console.log(`  Expenses: $${monthlyExpenses.toFixed(2)}`);
      console.log(`  Profit/Loss: $${(monthlyIncome - monthlyExpenses).toFixed(2)}`);
      console.log('------------------------------------');
    }
    
  } catch (error) {
    console.error('Error adding financial data:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB');
    }
    process.exit(0);
  }
}

// Run the function
addFinancialData(); 