/**
 * Script to migrate mock data to the real database
 * This script reads mock data from model files and imports it into the database
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Create database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fiscalfusion',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
  connectionTimeoutMillis: 5000,
});

// Import mock data from Client model
async function importClients() {
  try {
    // Get mock clients from the source code
    const clientModelPath = path.join(__dirname, 'src', 'server', 'models', 'Client.js');
    const clientModelContent = fs.readFileSync(clientModelPath, 'utf8');
    
    // Extract mock data using regex (this is a simple approach for demonstration)
    const mockClientsRegex = /const mockClients = \[([\s\S]*?)\];/;
    const mockClientsMatch = clientModelContent.match(mockClientsRegex);
    
    if (!mockClientsMatch) {
      console.error('Could not extract mock clients data');
      return;
    }
    
    // Parse the mock clients data (careful with eval - in production you might want a safer approach)
    const mockClientsText = `[${mockClientsMatch[1]}]`;
    const mockClients = eval(mockClientsText);
    
    console.log(`Found ${mockClients.length} mock clients to import`);
    
    // Insert each client into the database
    for (const client of mockClients) {
      await pool.query(
        `INSERT INTO clients (id, name, email, phone, address, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE
         SET name = $2, email = $3, phone = $4, address = $5, notes = $6`,
        [client.id, client.name, client.email, client.phone, client.address, client.notes, client.created_at]
      );
      console.log(`Imported client: ${client.name}`);
    }
    
    // Reset the sequence to the max id + 1
    await pool.query(`
      SELECT setval('clients_id_seq', (SELECT MAX(id) FROM clients));
    `);
    
    console.log('Client import completed');
  } catch (error) {
    console.error('Error importing clients:', error);
  }
}

// Import mock data from Invoice model
async function importInvoices() {
  try {
    // Get mock invoices from the source code
    const invoiceModelPath = path.join(__dirname, 'src', 'server', 'models', 'Invoice.js');
    const invoiceModelContent = fs.readFileSync(invoiceModelPath, 'utf8');
    
    // Extract mock data using regex
    const mockInvoicesRegex = /const mockInvoices = \[([\s\S]*?)\];/;
    const mockInvoicesMatch = invoiceModelContent.match(mockInvoicesRegex);
    
    if (!mockInvoicesMatch) {
      console.error('Could not extract mock invoices data');
      return;
    }
    
    // Parse the mock invoices data
    const mockInvoicesText = `[${mockInvoicesMatch[1]}]`;
    const mockInvoices = eval(mockInvoicesText);
    
    console.log(`Found ${mockInvoices.length} mock invoices to import`);
    
    // Insert each invoice into the database
    for (const invoice of mockInvoices) {
      await pool.query(
        `INSERT INTO invoices (id, client_id, amount, status, due_date, payment_date, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE
         SET client_id = $2, amount = $3, status = $4, due_date = $5, payment_date = $6, notes = $7`,
        [
          invoice.id, 
          invoice.client_id, 
          invoice.amount, 
          invoice.status, 
          invoice.due_date, 
          invoice.payment_date, 
          invoice.notes, 
          invoice.created_at
        ]
      );
      console.log(`Imported invoice: #${invoice.id} for ${invoice.client_name}`);
    }
    
    // Reset the sequence to the max id + 1
    await pool.query(`
      SELECT setval('invoices_id_seq', (SELECT MAX(id) FROM invoices));
    `);
    
    console.log('Invoice import completed');
  } catch (error) {
    console.error('Error importing invoices:', error);
  }
}

// Main function to run all imports
async function migrateAllData() {
  try {
    console.log('Starting migration of mock data to database...');
    
    // Test database connection
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      console.log('Connected to database successfully at:', result.rows[0].now);
      client.release();
    } catch (err) {
      console.error('Database connection error:', err);
      console.error('Make sure PostgreSQL is running and accessible');
      process.exit(1);
    }
    
    // Import all data
    await importClients();
    await importInvoices();
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the migration
migrateAllData(); 