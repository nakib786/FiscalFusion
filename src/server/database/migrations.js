const db = require('./config');

async function createTables() {
  try {
    // Create clients table
    await db.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('Clients table created or already exists');
    
    // Create invoices table
    await db.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id),
        amount DECIMAL(12,2) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'unpaid',
        due_date DATE NOT NULL,
        payment_date DATE,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('Invoices table created or already exists');
    
    // Create invoice_items table
    await db.query(`
      CREATE TABLE IF NOT EXISTS invoice_items (
        id SERIAL PRIMARY KEY,
        invoice_id INTEGER REFERENCES invoices(id),
        description TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(12,2) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('Invoice items table created or already exists');
    
    // Create expenses table
    await db.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        amount DECIMAL(12,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        receipt_url TEXT,
        vendor VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('Expenses table created or already exists');
    
    // Create assets table
    await db.query(`
      CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('Assets table created or already exists');
    
    // Create liabilities table
    await db.query(`
      CREATE TABLE IF NOT EXISTS liabilities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('Liabilities table created or already exists');
    
    // Create cash_transactions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS cash_transactions (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL, -- 'inflow' or 'outflow'
        amount DECIMAL(12,2) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        category VARCHAR(100),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('Cash transactions table created or already exists');
    
    // Create report_templates table
    await db.query(`
      CREATE TABLE IF NOT EXISTS report_templates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL, -- 'balance_sheet', 'income_statement', 'cash_flow'
        config JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('Report templates table created or already exists');
    
    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function dropTables() {
  try {
    // Drop tables in reverse order due to foreign key constraints
    await db.query('DROP TABLE IF EXISTS report_templates CASCADE');
    await db.query('DROP TABLE IF EXISTS cash_transactions CASCADE');
    await db.query('DROP TABLE IF EXISTS liabilities CASCADE');
    await db.query('DROP TABLE IF EXISTS assets CASCADE');
    await db.query('DROP TABLE IF EXISTS invoice_items CASCADE');
    await db.query('DROP TABLE IF EXISTS expenses CASCADE');
    await db.query('DROP TABLE IF EXISTS invoices CASCADE');
    await db.query('DROP TABLE IF EXISTS clients CASCADE');
    
    console.log('All tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
}

// Create seed data for testing
async function seedData() {
  try {
    // Insert sample clients
    const client1 = await db.query(
      `INSERT INTO clients (name, email, phone, address, notes)
       VALUES ('Acme Corporation', 'contact@acme.com', '555-123-4567', '123 Main St, Business City', 'Regular client')
       RETURNING id`
    );
    
    const client2 = await db.query(
      `INSERT INTO clients (name, email, phone, address, notes)
       VALUES ('TechStart Inc.', 'info@techstart.com', '555-987-6543', '456 Tech Ave, Innovation District', 'New client, high priority')
       RETURNING id`
    );
    
    // Insert sample invoices
    const invoice1 = await db.query(
      `INSERT INTO invoices (client_id, amount, status, due_date, notes)
       VALUES ($1, 2500.00, 'unpaid', CURRENT_DATE + INTERVAL '30 days', 'Website development project')
       RETURNING id`,
      [client1.rows[0].id]
    );
    
    const invoice2 = await db.query(
      `INSERT INTO invoices (client_id, amount, status, due_date, payment_date, notes)
       VALUES ($1, 1800.00, 'paid', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '10 days', 'Consulting services')
       RETURNING id`,
      [client2.rows[0].id]
    );
    
    // Insert invoice items
    await db.query(
      `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, amount)
       VALUES ($1, 'Website Design', 1, 1500.00, 1500.00)`,
      [invoice1.rows[0].id]
    );
    
    await db.query(
      `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, amount)
       VALUES ($1, 'Website Development', 10, 100.00, 1000.00)`,
      [invoice1.rows[0].id]
    );
    
    await db.query(
      `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, amount)
       VALUES ($1, 'Consulting Hours', 12, 150.00, 1800.00)`,
      [invoice2.rows[0].id]
    );
    
    // Insert sample expenses
    await db.query(
      `INSERT INTO expenses (amount, category, description, date, vendor)
       VALUES (750.00, 'Software', 'Annual subscription for design software', CURRENT_DATE - INTERVAL '45 days', 'DesignSoft Inc.')`
    );
    
    await db.query(
      `INSERT INTO expenses (amount, category, description, date, vendor)
       VALUES (120.00, 'Office Supplies', 'Printer paper and ink cartridges', CURRENT_DATE - INTERVAL '20 days', 'Office Depot')`
    );
    
    await db.query(
      `INSERT INTO expenses (amount, category, description, date, vendor)
       VALUES (85.00, 'Utilities', 'Internet service', CURRENT_DATE - INTERVAL '15 days', 'Comcast Business')`
    );
    
    // Insert sample assets
    await db.query(
      `INSERT INTO assets (name, category, amount, date, notes)
       VALUES ('Business Checking Account', 'Cash', 8500.00, CURRENT_DATE, 'Main operating account')`
    );
    
    await db.query(
      `INSERT INTO assets (name, category, amount, date, notes)
       VALUES ('Office Equipment', 'Fixed Assets', 3200.00, CURRENT_DATE - INTERVAL '90 days', 'Computers and furniture')`
    );
    
    // Insert sample liabilities
    await db.query(
      `INSERT INTO liabilities (name, category, amount, date, notes)
       VALUES ('Business Credit Card', 'Credit Card', 1250.00, CURRENT_DATE, 'Monthly payment due on 15th')`
    );
    
    // Insert sample cash transactions
    await db.query(
      `INSERT INTO cash_transactions (type, amount, description, date, category)
       VALUES ('inflow', 1800.00, 'Payment from TechStart Inc.', CURRENT_DATE - INTERVAL '10 days', 'Revenue')`
    );
    
    await db.query(
      `INSERT INTO cash_transactions (type, amount, description, date, category)
       VALUES ('outflow', 750.00, 'Software subscription payment', CURRENT_DATE - INTERVAL '45 days', 'Software')`
    );
    
    // Insert sample report templates
    await db.query(
      `INSERT INTO report_templates (name, type, config)
       VALUES ('Standard Balance Sheet', 'balance_sheet', '{"showDetails": true, "includeZeroBalances": false}')`
    );
    
    await db.query(
      `INSERT INTO report_templates (name, type, config)
       VALUES ('Quarterly Income Statement', 'income_statement', '{"showDetails": true, "categorizeExpenses": true}')`
    );
    
    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

// Initialize database with tables and seed data
async function initDatabase() {
  try {
    // Create tables
    await createTables();
    
    // Check if we should seed with data
    const shouldSeed = process.env.SEED_DATABASE !== 'false';
    
    if (shouldSeed) {
      // Get count of clients to check if data already exists
      const clientsResult = await db.query('SELECT COUNT(*) FROM clients');
      const clientCount = parseInt(clientsResult.rows[0].count, 10);
      
      // Only seed if no data exists
      if (clientCount === 0) {
        console.log('No existing data found, seeding database with sample data...');
        await seedData();
      } else {
        console.log('Database already contains data, skipping seed process');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

// Export functions for command-line usage
module.exports = {
  createTables,
  dropTables,
  seedData,
  initDatabase
};

// If this script is run directly (not imported), initialize the database
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--drop')) {
    dropTables().catch(console.error);
  } else if (args.includes('--seed')) {
    seedData().catch(console.error);
  } else if (args.includes('--reset')) {
    dropTables()
      .then(createTables)
      .then(() => {
        if (args.includes('--with-seed')) {
          return seedData();
        }
      })
      .catch(console.error);
  } else {
    initDatabase().catch(console.error);
  }
} 