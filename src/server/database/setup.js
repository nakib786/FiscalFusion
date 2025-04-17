const { pool, testConnection } = require('./config');
const migrations = require('./migrations');

/**
 * Sets up the database with tables and sample data
 */
async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      console.error('Could not connect to database. Please check your database configuration.');
      console.error('Expected configuration:');
      console.error(`- Host: ${process.env.DB_HOST || 'localhost'}`);
      console.error(`- Port: ${process.env.DB_PORT || 5432}`);
      console.error(`- Database: ${process.env.DB_NAME || 'fiscalfusion'}`);
      console.error(`- User: ${process.env.DB_USER || 'postgres'}`);
      console.error('Make sure PostgreSQL is running and accessible.');
      process.exit(1);
    }
    
    // Create all tables
    await migrations.createTables();
    
    // Seed the database with test data
    await migrations.seedData();
    
    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase(); 