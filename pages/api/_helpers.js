/**
 * Helper function to handle API errors and return mock data with status info
 * @param {Error} error - The error that occurred
 * @param {Array} mockData - Mock data to return as fallback
 * @param {string} source - Short description of the error source
 * @returns {Object} - Response object with mock data and status info
 */
export async function handleApiError(error, mockData, source = 'API Error') {
  console.error(`Error in ${source}:`, error);
  
  // Get database status from health endpoint
  let dbStatus = 'unknown';
  try {
    const healthResponse = await fetch(`${process.env.API_BASE_URL || 'http://localhost:8080'}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      dbStatus = healthData.database || 'unknown';
    }
  } catch (healthErr) {
    console.error('Could not check database status:', healthErr);
  }
  
  return {
    success: true,
    data: mockData,
    source: 'mock',
    database_status: dbStatus,
    message: 'Using mock data - Database connection is unavailable'
  };
}

/**
 * Common mock data for different API endpoints
 */
export const mockData = {
  invoices: [
    { id: 1, client_name: 'Acme Corp', amount: '1500.00', status: 'paid', due_date: '2023-08-15' },
    { id: 2, client_name: 'Globex Inc', amount: '2450.00', status: 'unpaid', due_date: '2023-09-01' },
    { id: 3, client_name: 'Stark Industries', amount: '3200.00', status: 'paid', due_date: '2023-08-20' },
    { id: 4, client_name: 'Wayne Enterprises', amount: '1800.00', status: 'overdue', due_date: '2023-08-10' },
    { id: 5, client_name: 'Oscorp', amount: '950.00', status: 'unpaid', due_date: '2023-09-05' }
  ],
  
  expenses: [
    { id: 1, category: 'Office Supplies', amount: '250.00', date: '2023-07-25', vendor: 'Office Depot' },
    { id: 2, category: 'Travel', amount: '850.00', date: '2023-08-03', vendor: 'Delta Airlines' },
    { id: 3, category: 'Software', amount: '120.00', date: '2023-08-10', vendor: 'Adobe' },
    { id: 4, category: 'Meals', amount: '75.00', date: '2023-08-15', vendor: 'Restaurant' },
    { id: 5, category: 'Hardware', amount: '1200.00', date: '2023-08-20', vendor: 'Apple' }
  ],
  
  clients: [
    { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', phone: '555-123-4567' },
    { id: 2, name: 'Globex Inc', email: 'info@globex.com', phone: '555-987-6543' },
    { id: 3, name: 'Stark Industries', email: 'sales@stark.com', phone: '555-467-8901' },
    { id: 4, name: 'Wayne Enterprises', email: 'info@wayne.com', phone: '555-234-5678' },
    { id: 5, name: 'Oscorp', email: 'contact@oscorp.com', phone: '555-345-6789' }
  ],
  
  reports: {
    income: [
      { month: 'Jan', amount: 4500 },
      { month: 'Feb', amount: 5200 },
      { month: 'Mar', amount: 4800 },
      { month: 'Apr', amount: 5800 },
      { month: 'May', amount: 6200 },
      { month: 'Jun', amount: 5600 },
      { month: 'Jul', amount: 6800 },
      { month: 'Aug', amount: 7200 },
      { month: 'Sep', amount: 6400 },
      { month: 'Oct', amount: 7500 },
      { month: 'Nov', amount: 8200 },
      { month: 'Dec', amount: 9000 }
    ],
    expenses: [
      { month: 'Jan', amount: 2200 },
      { month: 'Feb', amount: 2400 },
      { month: 'Mar', amount: 2100 },
      { month: 'Apr', amount: 2600 },
      { month: 'May', amount: 2800 },
      { month: 'Jun', amount: 2500 },
      { month: 'Jul', amount: 3000 },
      { month: 'Aug', amount: 3200 },
      { month: 'Sep', amount: 2900 },
      { month: 'Oct', amount: 3400 },
      { month: 'Nov', amount: 3600 },
      { month: 'Dec', amount: 3800 }
    ]
  }
}; 