import React, { useState, useEffect } from 'react';

function FinancialReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('income');  // 'income', 'balance', 'cashflow'
  const [dateRange, setDateRange] = useState('month');  // 'month', 'quarter', 'year', 'custom'
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Simulate fetching report data
    setLoading(true);
    
    setTimeout(() => {
      try {
        // Mock financial data
        const mockIncomeData = {
          totalRevenue: 8900.00,
          costOfSales: 2500.00,
          grossProfit: 6400.00,
          expenses: [
            { category: 'Rent', amount: 1200.00 },
            { category: 'Utilities', amount: 350.00 },
            { category: 'Salaries', amount: 3500.00 },
            { category: 'Marketing', amount: 750.00 },
            { category: 'Other', amount: 400.00 }
          ],
          totalExpenses: 6200.00,
          netIncome: 200.00
        };
        
        const mockBalanceData = {
          assets: [
            { category: 'Cash', amount: 4500.00 },
            { category: 'Accounts Receivable', amount: 3250.00 },
            { category: 'Equipment', amount: 12000.00 }
          ],
          totalAssets: 19750.00,
          liabilities: [
            { category: 'Accounts Payable', amount: 1800.00 },
            { category: 'Loans', amount: 5000.00 }
          ],
          totalLiabilities: 6800.00,
          equity: 12950.00
        };
        
        const mockCashflowData = {
          operatingActivities: [
            { category: 'Net Income', amount: 200.00 },
            { category: 'Accounts Receivable Change', amount: -1000.00 },
            { category: 'Accounts Payable Change', amount: 500.00 }
          ],
          netOperatingCashflow: -300.00,
          investingActivities: [
            { category: 'Equipment Purchase', amount: -1500.00 }
          ],
          netInvestingCashflow: -1500.00,
          financingActivities: [
            { category: 'Loan Proceeds', amount: 2000.00 }
          ],
          netFinancingCashflow: 2000.00,
          netCashChange: 200.00
        };

        // Set data based on report type
        switch (reportType) {
          case 'balance':
            setReportData(mockBalanceData);
            break;
          case 'cashflow':
            setReportData(mockCashflowData);
            break;
          case 'income':
          default:
            setReportData(mockIncomeData);
            break;
        }
        
        setLoading(false);
      } catch (err) {
        setError('Error loading financial data');
        setLoading(false);
      }
    }, 1000);
  }, [reportType, dateRange]);

  const handleReportTypeChange = (type) => {
    setReportType(type);
  };
  
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const renderIncomeStatement = () => {
    if (!reportData) return null;
    
    return (
      <div className="report-section">
        <h3>Income Statement</h3>
        <div className="report-period">Period: {getDateRangeText()}</div>
        
        <table className="data-table">
          <tbody>
            <tr className="report-header-row">
              <td>Revenue</td>
              <td className="amount">${reportData.totalRevenue.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Cost of Sales</td>
              <td className="amount">${reportData.costOfSales.toFixed(2)}</td>
            </tr>
            <tr className="report-subtotal-row">
              <td>Gross Profit</td>
              <td className="amount">${reportData.grossProfit.toFixed(2)}</td>
            </tr>
            
            <tr className="report-header-row">
              <td>Expenses</td>
              <td></td>
            </tr>
            {reportData.expenses.map((expense, i) => (
              <tr key={i}>
                <td>{expense.category}</td>
                <td className="amount">${expense.amount.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="report-subtotal-row">
              <td>Total Expenses</td>
              <td className="amount">${reportData.totalExpenses.toFixed(2)}</td>
            </tr>
            
            <tr className="report-total-row">
              <td>Net Income</td>
              <td className={`amount ${reportData.netIncome >= 0 ? 'positive' : 'negative'}`}>
                ${Math.abs(reportData.netIncome).toFixed(2)}
                {reportData.netIncome < 0 && ' (Loss)'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderBalanceSheet = () => {
    if (!reportData) return null;
    
    return (
      <div className="report-section">
        <h3>Balance Sheet</h3>
        <div className="report-period">As of: {getCurrentDate()}</div>
        
        <table className="data-table">
          <tbody>
            <tr className="report-header-row">
              <td>Assets</td>
              <td></td>
            </tr>
            {reportData.assets.map((asset, i) => (
              <tr key={i}>
                <td>{asset.category}</td>
                <td className="amount">${asset.amount.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="report-subtotal-row">
              <td>Total Assets</td>
              <td className="amount">${reportData.totalAssets.toFixed(2)}</td>
            </tr>
            
            <tr className="report-header-row">
              <td>Liabilities</td>
              <td></td>
            </tr>
            {reportData.liabilities.map((liability, i) => (
              <tr key={i}>
                <td>{liability.category}</td>
                <td className="amount">${liability.amount.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="report-subtotal-row">
              <td>Total Liabilities</td>
              <td className="amount">${reportData.totalLiabilities.toFixed(2)}</td>
            </tr>
            
            <tr className="report-total-row">
              <td>Equity</td>
              <td className="amount">${reportData.equity.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderCashFlow = () => {
    if (!reportData) return null;
    
    return (
      <div className="report-section">
        <h3>Cash Flow Statement</h3>
        <div className="report-period">Period: {getDateRangeText()}</div>
        
        <table className="data-table">
          <tbody>
            <tr className="report-header-row">
              <td>Operating Activities</td>
              <td></td>
            </tr>
            {reportData.operatingActivities.map((item, i) => (
              <tr key={i}>
                <td>{item.category}</td>
                <td className="amount">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="report-subtotal-row">
              <td>Net Cash from Operations</td>
              <td className={`amount ${reportData.netOperatingCashflow >= 0 ? 'positive' : 'negative'}`}>
                ${Math.abs(reportData.netOperatingCashflow).toFixed(2)}
                {reportData.netOperatingCashflow < 0 && ' (Outflow)'}
              </td>
            </tr>
            
            <tr className="report-header-row">
              <td>Investing Activities</td>
              <td></td>
            </tr>
            {reportData.investingActivities.map((item, i) => (
              <tr key={i}>
                <td>{item.category}</td>
                <td className="amount">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="report-subtotal-row">
              <td>Net Cash from Investing</td>
              <td className={`amount ${reportData.netInvestingCashflow >= 0 ? 'positive' : 'negative'}`}>
                ${Math.abs(reportData.netInvestingCashflow).toFixed(2)}
                {reportData.netInvestingCashflow < 0 && ' (Outflow)'}
              </td>
            </tr>
            
            <tr className="report-header-row">
              <td>Financing Activities</td>
              <td></td>
            </tr>
            {reportData.financingActivities.map((item, i) => (
              <tr key={i}>
                <td>{item.category}</td>
                <td className="amount">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="report-subtotal-row">
              <td>Net Cash from Financing</td>
              <td className={`amount ${reportData.netFinancingCashflow >= 0 ? 'positive' : 'negative'}`}>
                ${Math.abs(reportData.netFinancingCashflow).toFixed(2)}
                {reportData.netFinancingCashflow < 0 && ' (Outflow)'}
              </td>
            </tr>
            
            <tr className="report-total-row">
              <td>Net Change in Cash</td>
              <td className={`amount ${reportData.netCashChange >= 0 ? 'positive' : 'negative'}`}>
                ${Math.abs(reportData.netCashChange).toFixed(2)}
                {reportData.netCashChange < 0 && ' (Decrease)'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString();
  };
  
  const getDateRangeText = () => {
    const today = new Date();
    
    switch (dateRange) {
      case 'quarter':
        return `Q${Math.floor(today.getMonth() / 3) + 1} ${today.getFullYear()}`;
      case 'year':
        return today.getFullYear().toString();
      case 'custom':
        return 'Custom Range';
      case 'month':
      default:
        return `${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}`;
    }
  };

  if (loading) {
    return <div className="loading">Loading financial report data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="financial-reports">
      <div className="report-manager-header">
        <h2>Financial Reports</h2>
        <div className="report-actions">
          <button className="btn btn-outline">Export PDF</button>
          <button className="btn btn-outline">Print</button>
        </div>
      </div>
      
      <div className="report-controls">
        <div className="report-types">
          <button 
            className={`btn ${reportType === 'income' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleReportTypeChange('income')}
          >
            Income Statement
          </button>
          <button 
            className={`btn ${reportType === 'balance' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleReportTypeChange('balance')}
          >
            Balance Sheet
          </button>
          <button 
            className={`btn ${reportType === 'cashflow' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleReportTypeChange('cashflow')}
          >
            Cash Flow
          </button>
        </div>
        
        <div className="date-range-selector">
          <button 
            className={`btn ${dateRange === 'month' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleDateRangeChange('month')}
          >
            This Month
          </button>
          <button 
            className={`btn ${dateRange === 'quarter' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleDateRangeChange('quarter')}
          >
            This Quarter
          </button>
          <button 
            className={`btn ${dateRange === 'year' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleDateRangeChange('year')}
          >
            This Year
          </button>
          <button 
            className={`btn ${dateRange === 'custom' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleDateRangeChange('custom')}
          >
            Custom
          </button>
        </div>
      </div>
      
      <div className="report-content">
        {reportType === 'income' && renderIncomeStatement()}
        {reportType === 'balance' && renderBalanceSheet()}
        {reportType === 'cashflow' && renderCashFlow()}
      </div>
    </div>
  );
}

export default FinancialReports; 