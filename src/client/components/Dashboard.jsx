import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [latestInvoices, setLatestInvoices] = useState([]);
  const [latestExpenses, setLatestExpenses] = useState([]);
  const [financialSummary, setFinancialSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    unpaidInvoices: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('month'); // 'week', 'month', 'year'

  useEffect(() => {
    // Fetch dashboard data
    setLoading(true);
    
    // In a production app, we would add timeframe to the API query
    // For now we'll simulate the API call
    setTimeout(() => {
      try {
        // This is mock data while the API connection is being set up
        const mockInvoices = [
          { id: 1, client_name: 'Acme Corp', amount: '1500.00', status: 'paid', due_date: '2023-08-15' },
          { id: 2, client_name: 'Globex Inc', amount: '2450.00', status: 'unpaid', due_date: '2023-09-01' },
          { id: 3, client_name: 'Stark Industries', amount: '3200.00', status: 'paid', due_date: '2023-08-20' },
          { id: 4, client_name: 'Wayne Enterprises', amount: '1800.00', status: 'overdue', due_date: '2023-08-10' },
          { id: 5, client_name: 'Oscorp', amount: '950.00', status: 'unpaid', due_date: '2023-09-05' }
        ];
        
        const mockExpenses = [
          { id: 1, category: 'Office Supplies', amount: '120.50', date: '2023-08-18', vendor: 'Staples' },
          { id: 2, category: 'Software', amount: '499.99', date: '2023-08-15', vendor: 'Adobe' },
          { id: 3, category: 'Utilities', amount: '200.00', date: '2023-08-10', vendor: 'Electric Company' },
          { id: 4, category: 'Travel', amount: '350.75', date: '2023-08-05', vendor: 'Airline Inc' },
          { id: 5, category: 'Marketing', amount: '750.00', date: '2023-08-01', vendor: 'Ad Agency' }
        ];
        
        setLatestInvoices(mockInvoices);
        setLatestExpenses(mockExpenses);
        
        // Calculate financial summary from mock data
        const totalRevenue = mockInvoices
          .filter(invoice => invoice.status === 'paid')
          .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
        
        const totalExpenses = mockExpenses
          .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        
        const unpaidInvoices = mockInvoices
          .filter(invoice => invoice.status === 'unpaid' || invoice.status === 'overdue')
          .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
        
        setFinancialSummary({
          totalRevenue,
          totalExpenses,
          netIncome: totalRevenue - totalExpenses,
          unpaidInvoices
        });
        
        setLoading(false);
      } catch (err) {
        setError('Error loading dashboard data');
        setLoading(false);
      }
    }, 1000); // Simulate network delay
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Financial Overview</h2>
        <div className="timeframe-selector">
          <button 
            className={`btn btn-outline ${timeframe === 'week' ? 'btn-primary' : ''}`}
            onClick={() => handleTimeframeChange('week')}
          >
            This Week
          </button>
          <button 
            className={`btn btn-outline ${timeframe === 'month' ? 'btn-primary' : ''}`}
            onClick={() => handleTimeframeChange('month')}
          >
            This Month
          </button>
          <button 
            className={`btn btn-outline ${timeframe === 'year' ? 'btn-primary' : ''}`}
            onClick={() => handleTimeframeChange('year')}
          >
            This Year
          </button>
        </div>
      </div>
      
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p className="amount">${financialSummary.totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="amount">${financialSummary.totalExpenses.toFixed(2)}</p>
        </div>
        
        <div className="summary-card">
          <h3>Net Income</h3>
          <p className={`amount ${financialSummary.netIncome >= 0 ? 'positive' : 'negative'}`}>
            ${Math.abs(financialSummary.netIncome).toFixed(2)}
            {financialSummary.netIncome < 0 && ' (Loss)'}
          </p>
        </div>
        
        <div className="summary-card">
          <h3>Unpaid Invoices</h3>
          <p className="amount">${financialSummary.unpaidInvoices.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>
            Recent Invoices
            <span className="section-actions">
              <button className="btn btn-primary">New Invoice</button>
            </span>
          </h3>
          {latestInvoices.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {latestInvoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td>{invoice.client_name}</td>
                    <td>${parseFloat(invoice.amount).toFixed(2)}</td>
                    <td><span className={`status ${invoice.status}`}>{invoice.status}</span></td>
                    <td>{new Date(invoice.due_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No invoices found</p>
          )}
        </div>
        
        <div className="dashboard-section">
          <h3>
            Recent Expenses
            <span className="section-actions">
              <button className="btn btn-primary">New Expense</button>
            </span>
          </h3>
          {latestExpenses.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Vendor</th>
                </tr>
              </thead>
              <tbody>
                {latestExpenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.category}</td>
                    <td>${parseFloat(expense.amount).toFixed(2)}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>{expense.vendor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No expenses found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 