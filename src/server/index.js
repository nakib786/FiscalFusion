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

// Database connection
const db = require('./database/config');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
db.testConnection()
  .then(connected => {
    if (connected) {
      console.log('Connected to database successfully');
    } else {
      console.warn('Using mock data - database connection failed');
      
      // Set an interval to periodically retry database connection
      const retryInterval = setInterval(async () => {
        const reconnected = await db.testConnection();
        if (reconnected) {
          console.log('Successfully reconnected to database!');
          clearInterval(retryInterval);
        } else {
          console.log('Database reconnection attempt failed, will retry...');
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

// API health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = db.getConnectionStatus() ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok',
    message: 'API is running', 
    database: dbStatus,
    using_mock: !db.getConnectionStatus() || process.env.USE_MOCK_DATA === 'true'
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