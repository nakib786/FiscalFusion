import React, { useState, useEffect } from 'react';
import styles from '../../styles/Dashboard.module.css';

export default function Dashboard() {
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
  const [useMockData, setUseMockData] = useState(false);

  // Mock data for fallback
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

  useEffect(() => {
    // Function to fetch dashboard data from API
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if API server is running with a more robust approach
        let healthCheck = null;
        try {
          const healthResponse = await fetch('/api/health', { 
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          
          if (!healthResponse.ok) {
            throw new Error(`Health check failed with status: ${healthResponse.status}`);
          }
          
          const contentType = healthResponse.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Health check did not return JSON');
          }
          
          healthCheck = await healthResponse.json();
        } catch (healthError) {
          console.warn('Health check failed:', healthError.message);
          throw new Error('API server health check failed');
        }
        
        if (!healthCheck || healthCheck.status !== 'ok') {
          console.warn('API server not running or unhealthy, using mock data');
          setUseMockData(true);
          throw new Error('API server not available or unhealthy');
        }
        
        // Try to fetch invoices with improved error handling
        let invoicesResponse;
        try {
          const invoicesResult = await fetch(`/api/invoices?timeframe=${timeframe}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          
          if (!invoicesResult.ok) {
            throw new Error(`Failed to fetch invoices: ${invoicesResult.status}`);
          }
          
          const contentType = invoicesResult.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invoices endpoint did not return JSON');
          }
          
          invoicesResponse = await invoicesResult.json();
        } catch (invoiceError) {
          console.error('Invoice fetch failed:', invoiceError.message);
          throw new Error('Failed to fetch invoices data');
        }
          
        // Try to fetch expenses with improved error handling
        let expensesResponse;
        try {
          const expensesResult = await fetch(`/api/expenses?timeframe=${timeframe}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          
          if (!expensesResult.ok) {
            throw new Error(`Failed to fetch expenses: ${expensesResult.status}`);
          }
          
          const contentType = expensesResult.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Expenses endpoint did not return JSON');
          }
          
          expensesResponse = await expensesResult.json();
        } catch (expenseError) {
          console.error('Expense fetch failed:', expenseError.message);
          throw new Error('Failed to fetch expenses data');
        }
        
        // Set the real data from API
        setLatestInvoices(invoicesResponse.data || []);
        setLatestExpenses(expensesResponse.data || []);
        
        // Calculate financial summary from real data
        let totalRevenue = 0;
        let totalExpenses = 0;
        let unpaidInvoices = 0;
        
        if (invoicesResponse.data) {
          totalRevenue = invoicesResponse.data
            .filter(invoice => invoice.status === 'paid')
            .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
            
          unpaidInvoices = invoicesResponse.data
            .filter(invoice => invoice.status === 'unpaid' || invoice.status === 'overdue')
            .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
        }
        
        if (expensesResponse.data) {
          totalExpenses = expensesResponse.data
            .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        }
        
        setFinancialSummary({
          totalRevenue,
          totalExpenses,
          netIncome: totalRevenue - totalExpenses,
          unpaidInvoices
        });
        
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        
        // Fall back to mock data if API fails
        setUseMockData(true);
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
        
        setError('Using demo data - could not connect to database');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h2>Financial Overview</h2>
        <div className={styles.timeframeSelector}>
          <button 
            className={`${styles.btn} ${styles.btnOutline} ${timeframe === 'week' ? styles.btnPrimary : ''}`}
            onClick={() => handleTimeframeChange('week')}
          >
            This Week
          </button>
          <button 
            className={`${styles.btn} ${styles.btnOutline} ${timeframe === 'month' ? styles.btnPrimary : ''}`}
            onClick={() => handleTimeframeChange('month')}
          >
            This Month
          </button>
          <button 
            className={`${styles.btn} ${styles.btnOutline} ${timeframe === 'year' ? styles.btnPrimary : ''}`}
            onClick={() => handleTimeframeChange('year')}
          >
            This Year
          </button>
        </div>
      </div>
      
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <h3>Total Revenue</h3>
          <p className={styles.amount}>${financialSummary.totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className={styles.summaryCard}>
          <h3>Total Expenses</h3>
          <p className={styles.amount}>${financialSummary.totalExpenses.toFixed(2)}</p>
        </div>
        
        <div className={styles.summaryCard}>
          <h3>Net Income</h3>
          <p className={`${styles.amount} ${financialSummary.netIncome >= 0 ? styles.positive : styles.negative}`}>
            ${Math.abs(financialSummary.netIncome).toFixed(2)}
            {financialSummary.netIncome < 0 && ' (Loss)'}
          </p>
        </div>
        
        <div className={styles.summaryCard}>
          <h3>Unpaid Invoices</h3>
          <p className={styles.amount}>${financialSummary.unpaidInvoices.toFixed(2)}</p>
        </div>
      </div>
      
      <div className={styles.dashboardSections}>
        <div className={styles.dashboardSection}>
          <h3>
            Recent Invoices
            <span className={styles.sectionActions}>
              <button className={`${styles.btn} ${styles.btnPrimary}`}>New Invoice</button>
            </span>
          </h3>
          {latestInvoices.length > 0 ? (
            <table className={styles.dataTable}>
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
                    <td><span className={`${styles.status} ${styles[invoice.status]}`}>{invoice.status}</span></td>
                    <td>{new Date(invoice.due_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.noData}>No invoices found</p>
          )}
        </div>
        
        <div className={styles.dashboardSection}>
          <h3>
            Recent Expenses
            <span className={styles.sectionActions}>
              <button className={`${styles.btn} ${styles.btnPrimary}`}>New Expense</button>
            </span>
          </h3>
          {latestExpenses.length > 0 ? (
            <table className={styles.dataTable}>
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
            <p className={styles.noData}>No expenses found</p>
          )}
        </div>
      </div>
    </div>
  );
} 