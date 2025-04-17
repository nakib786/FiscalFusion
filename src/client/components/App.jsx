import React, { useState, useEffect } from 'react';
import InvoiceManager from './invoices/InvoiceManager';
import ExpenseTracker from './expenses/ExpenseTracker';
import FinancialReports from './reports/FinancialReports';
import ClientManager from './clients/ClientManager';
import Dashboard from './Dashboard';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [apiStatus, setApiStatus] = useState('Loading...');

  useEffect(() => {
    // Check API health when component mounts
    fetch('http://localhost:8080/api/health')
      .then(response => response.json())
      .then(data => {
        setApiStatus(data.message);
      })
      .catch(error => {
        console.error('Error checking API health:', error);
        setApiStatus('Error connecting to API');
      });
  }, []);

  // Render the current view based on navigation
  const renderView = () => {
    switch (currentView) {
      case 'invoices':
        return <InvoiceManager />;
      case 'expenses':
        return <ExpenseTracker />;
      case 'reports':
        return <FinancialReports />;
      case 'clients':
        return <ClientManager />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">FiscalFusion</h1>
      </header>

      <nav className="main-nav">
        <ul>
          <li className={currentView === 'dashboard' ? 'active' : ''}>
            <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
          </li>
          <li className={currentView === 'invoices' ? 'active' : ''}>
            <button onClick={() => setCurrentView('invoices')}>Invoices</button>
          </li>
          <li className={currentView === 'expenses' ? 'active' : ''}>
            <button onClick={() => setCurrentView('expenses')}>Expenses</button>
          </li>
          <li className={currentView === 'reports' ? 'active' : ''}>
            <button onClick={() => setCurrentView('reports')}>Reports</button>
          </li>
          <li className={currentView === 'clients' ? 'active' : ''}>
            <button onClick={() => setCurrentView('clients')}>Clients</button>
          </li>
        </ul>
        <div className="api-status">
          API Status: <span className={apiStatus.includes('Error') ? 'error' : 'success'}>{apiStatus}</span>
        </div>
      </nav>

      <div className="content-container">
        {renderView()}
      </div>
    </div>
  );
}

export default App; 