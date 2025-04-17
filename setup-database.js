// This file is a convenience wrapper to run the database setup
// It should be executed from the root project directory

// Make sure we're using development configuration
process.env.NODE_ENV = 'development';

// Load and run the database setup
require('./src/server/database/setup'); 