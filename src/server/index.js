const express = require('express');
const path = require('path');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const invoicesRoutes = require('./routes/invoices');
const expensesRoutes = require('./routes/expenses');
const clientsRoutes = require('./routes/clients');
const reportsRoutes = require('./routes/reports');
const adminRoutes = require('./routes/adminRoutes');

// Database connection
const mongodb = require('./database/mongodb-config');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
mongodb.testConnection()
  .then(connected => {
    if (connected) {
      console.log('Connected to MongoDB successfully');
    } else {
      console.error('Failed to connect to MongoDB');
      console.error('Please ensure MongoDB is running and accessible');
      console.error('Check your database configuration in .env file');
      console.error('Expected configuration:');
      console.error(`- URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/fiscalfusion'}`);
      
      // Set an interval to periodically retry database connection
      const retryInterval = setInterval(async () => {
        const reconnected = await mongodb.testConnection();
        if (reconnected) {
          console.log('Successfully reconnected to MongoDB!');
          clearInterval(retryInterval);
        } else {
          console.log('MongoDB reconnection attempt failed, will retry...');
        }
      }, 60000); // Retry every minute
    }
  });

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../../dist')));
app.use(express.static(path.join(__dirname, '../client')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes);

// API health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongodb.getConnectionStatus() ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok',
    message: 'API is running', 
    database: dbStatus,
    database_type: 'MongoDB'
  });
});

// Sample API endpoint for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint is working' });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the application`);
}); 