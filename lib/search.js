// Search utility for FiscalFusion
// This helps perform searches across the entire application's data

/**
 * Track search query in database
 * @param {string} query - The search query
 * @param {string} userId - The user ID (optional)
 * @param {string} username - The username (optional)
 */
async function trackSearchQuery(query, userId = null, username = null) {
  try {
    await fetch('/api/search-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        userId,
        username
      }),
    });
  } catch (error) {
    console.error('Failed to track search query:', error);
    // Non-blocking - we don't want to interrupt search if tracking fails
  }
}

/**
 * Search through data from various endpoints
 * @param {string} query - The search query
 * @param {string} userId - The user ID (optional)
 * @param {string} username - The username (optional)
 * @returns {Array} - Array of search results
 */
export async function performSearch(query, userId = null, username = null) {
  if (!query || query.trim() === '') {
    return [];
  }

  try {
    // Track the search query
    trackSearchQuery(query, userId, username);

    // Fetch data from various endpoints
    const [
      dashboardResponse,
      invoicesResponse,
      clientsResponse,
      expensesResponse,
      transactionsResponse
    ] = await Promise.all([
      fetch('/api/dashboard'),
      fetch('/api/invoices'),
      fetch('/api/clients'),
      fetch('/api/expenses'),
      fetch('/api/transactions')
    ]);

    const dashboardData = await dashboardResponse.json();
    const invoicesData = await invoicesResponse.json();
    const clientsData = await clientsResponse.json();
    const expensesData = await expensesResponse.json();
    const transactionsData = await transactionsResponse.json();

    // Normalize the search query
    const normalizedQuery = query.toLowerCase().trim();

    // Search results container
    const results = [];

    // Search in invoices
    if (invoicesData.success && invoicesData.data) {
      const matches = invoicesData.data.filter(invoice => 
        (invoice.invoice_number && invoice.invoice_number.toLowerCase().includes(normalizedQuery)) ||
        (invoice.client_name && invoice.client_name.toLowerCase().includes(normalizedQuery)) ||
        (invoice.description && invoice.description.toLowerCase().includes(normalizedQuery)) ||
        (invoice.status && invoice.status.toLowerCase().includes(normalizedQuery))
      ).map(invoice => ({
        type: 'invoice',
        id: invoice._id,
        title: `Invoice #${invoice.invoice_number}`,
        subtitle: `${invoice.client_name} - $${invoice.amount}`,
        status: invoice.status,
        url: `/invoices/${invoice._id}`,
        data: invoice
      }));
      
      results.push(...matches);
    }

    // Search in clients
    if (clientsData.success && clientsData.data) {
      const matches = clientsData.data.filter(client => 
        (client.name && client.name.toLowerCase().includes(normalizedQuery)) ||
        (client.email && client.email.toLowerCase().includes(normalizedQuery)) ||
        (client.company && client.company.toLowerCase().includes(normalizedQuery)) ||
        (client.phone && client.phone.includes(normalizedQuery))
      ).map(client => ({
        type: 'client',
        id: client._id,
        title: client.name,
        subtitle: client.company || client.email,
        url: `/clients/${client._id}`,
        data: client
      }));
      
      results.push(...matches);
    }

    // Search in expenses
    if (expensesData.success && expensesData.data) {
      const matches = expensesData.data.filter(expense => 
        (expense.description && expense.description.toLowerCase().includes(normalizedQuery)) ||
        (expense.category && expense.category.toLowerCase().includes(normalizedQuery)) ||
        (expense.vendor && expense.vendor.toLowerCase().includes(normalizedQuery))
      ).map(expense => ({
        type: 'expense',
        id: expense._id,
        title: expense.description,
        subtitle: `${expense.category} - $${expense.amount}`,
        url: `/expenses/${expense._id}`,
        data: expense
      }));
      
      results.push(...matches);
    }

    // Search in transactions
    if (transactionsData.success && transactionsData.data) {
      const matches = transactionsData.data.filter(transaction => 
        (transaction.description && transaction.description.toLowerCase().includes(normalizedQuery)) ||
        (transaction.type && transaction.type.toLowerCase().includes(normalizedQuery)) ||
        (transaction.category && transaction.category.toLowerCase().includes(normalizedQuery))
      ).map(transaction => ({
        type: 'transaction',
        id: transaction._id,
        title: transaction.description,
        subtitle: `${transaction.type} - $${transaction.amount}`,
        url: `/transactions/${transaction._id}`,
        data: transaction
      }));
      
      results.push(...matches);
    }

    return results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
} 