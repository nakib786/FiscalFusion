import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    revenueByMonth: [],
    expensesByCategory: [],
    profitLoss: [],
    topClients: []
  });
  const [data, setData] = useState(null);
  const [dbStatus, setDbStatus] = useState('unknown');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/reports');
        const responseText = await response.text();
        
        // Try to parse as JSON
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Invalid JSON from reports API:', responseText);
          throw new Error('Invalid JSON response from API');
        }
        
        if (result && result.data) {
          setData(result.data);
          
          // If using mock data, show a notice
          if (result.source && result.source.includes('mock')) {
            setError(result.message || 'Using mock data - API connection failed');
            setDbStatus(result.database_status || 'disconnected');
          }
        } else {
          // API didn't return expected data format
          throw new Error('API returned unexpected data format');
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Using mock data - API connection failed');
        
        // Mock data is used as fallback
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        // Try to fetch API data
        const response = await fetch(`/api/reports?timeframe=${timeframe}`);
        const data = await response.json();
        
        if (data && data.data) {
          setReportData(data.data);
        } else {
          // Mock data as fallback
          setReportData({
            revenueByMonth: [
              { month: 'Jan', revenue: 12500 },
              { month: 'Feb', revenue: 10800 },
              { month: 'Mar', revenue: 15200 },
              { month: 'Apr', revenue: 13600 },
              { month: 'May', revenue: 17300 },
              { month: 'Jun', revenue: 14200 }
            ],
            expensesByCategory: [
              { category: 'Office Supplies', amount: 1250 },
              { category: 'Software', amount: 3500 },
              { category: 'Utilities', amount: 1800 },
              { category: 'Travel', amount: 2300 },
              { category: 'Marketing', amount: 4200 }
            ],
            profitLoss: [
              { month: 'Jan', revenue: 12500, expenses: 7800, profit: 4700 },
              { month: 'Feb', revenue: 10800, expenses: 6500, profit: 4300 },
              { month: 'Mar', revenue: 15200, expenses: 9800, profit: 5400 },
              { month: 'Apr', revenue: 13600, expenses: 8900, profit: 4700 },
              { month: 'May', revenue: 17300, expenses: 10500, profit: 6800 },
              { month: 'Jun', revenue: 14200, expenses: 9100, profit: 5100 }
            ],
            topClients: [
              { name: 'Acme Corporation', revenue: 15600 },
              { name: 'Globex Industries', revenue: 12400 },
              { name: 'Wayne Enterprises', revenue: 9800 },
              { name: 'Stark Industries', revenue: 8700 },
              { name: 'Oscorp', revenue: 7500 }
            ]
          });
          setError('Using mock data - API connection failed');
        }
      } catch (err) {
        console.error('Error fetching report data:', err);
        // Mock data as fallback
        setReportData({
          revenueByMonth: [
            { month: 'Jan', revenue: 12500 },
            { month: 'Feb', revenue: 10800 },
            { month: 'Mar', revenue: 15200 },
            { month: 'Apr', revenue: 13600 },
            { month: 'May', revenue: 17300 },
            { month: 'Jun', revenue: 14200 }
          ],
          expensesByCategory: [
            { category: 'Office Supplies', amount: 1250 },
            { category: 'Software', amount: 3500 },
            { category: 'Utilities', amount: 1800 },
            { category: 'Travel', amount: 2300 },
            { category: 'Marketing', amount: 4200 }
          ],
          profitLoss: [
            { month: 'Jan', revenue: 12500, expenses: 7800, profit: 4700 },
            { month: 'Feb', revenue: 10800, expenses: 6500, profit: 4300 },
            { month: 'Mar', revenue: 15200, expenses: 9800, profit: 5400 },
            { month: 'Apr', revenue: 13600, expenses: 8900, profit: 4700 },
            { month: 'May', revenue: 17300, expenses: 10500, profit: 6800 },
            { month: 'Jun', revenue: 14200, expenses: 9100, profit: 5100 }
          ],
          topClients: [
            { name: 'Acme Corporation', revenue: 15600 },
            { name: 'Globex Industries', revenue: 12400 },
            { name: 'Wayne Enterprises', revenue: 9800 },
            { name: 'Stark Industries', revenue: 8700 },
            { name: 'Oscorp', revenue: 7500 }
          ]
        });
        setError('Using mock data - API connection failed');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [timeframe]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Simple bar chart component
  const BarChart = ({ data, valueKey, labelKey, title, color = 'blue' }) => {
    const maxValue = Math.max(...data.map(item => item[valueKey]));
    
    // Map color names to Tailwind classes
    const colorMap = {
      'blue': 'bg-blue-600',
      'green': 'bg-green-600',
      'red': 'bg-red-600',
      'yellow': 'bg-yellow-500',
      'purple': 'bg-purple-600'
    };
    
    const barColor = colorMap[color] || 'bg-blue-600';
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="relative">
              <div className="flex items-center">
                <div className="w-24 text-sm text-gray-400">{item[labelKey]}</div>
                <div className="flex-grow">
                  <div 
                    className={`h-6 ${barColor} rounded-r-sm`}
                    style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
                  ></div>
                </div>
                <div className="w-24 text-right text-sm text-gray-400 ml-2">
                  {formatCurrency(item[valueKey])}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Reports - FiscalFusion</title>
        <meta name="description" content="Financial reports and analytics" />
      </Head>
      
      <div id="reports-page" className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Financial Reports</h1>
          <p className="text-gray-400">View and analyze your financial performance</p>
        </div>
        
        <div className="flex space-x-2 mb-6">
          <button 
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 rounded-md text-sm ${timeframe === 'month' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setTimeframe('quarter')}
            className={`px-4 py-2 rounded-md text-sm ${timeframe === 'quarter' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Quarterly
          </button>
          <button 
            onClick={() => setTimeframe('year')}
            className={`px-4 py-2 rounded-md text-sm ${timeframe === 'year' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Yearly
          </button>
        </div>
        
        {error && (
          <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-yellow-200 font-medium">{error}</p>
                {dbStatus && dbStatus !== 'unknown' && (
                  <p className="text-yellow-200/70 text-sm mt-1">
                    Database status: <span className={dbStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>{dbStatus}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-400">Loading reports...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-white">Revenue Trends</h2>
              <BarChart 
                data={reportData.revenueByMonth} 
                valueKey="revenue" 
                labelKey="month" 
                title="Monthly Revenue" 
                color="green"
              />
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-white">Expenses by Category</h2>
              <BarChart 
                data={reportData.expensesByCategory} 
                valueKey="amount" 
                labelKey="category" 
                title="Expense Distribution" 
                color="red"
              />
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-white">Profit & Loss Summary</h2>
              <div className="space-y-4">
                {reportData.profitLoss.map((item, index) => (
                  <div key={index} className="border-b border-gray-700 pb-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-white">{item.month}</span>
                      <span className="text-green-500">{formatCurrency(item.profit)}</span>
                    </div>
                    <div className="flex text-sm">
                      <span className="text-gray-400 w-1/2">Revenue: {formatCurrency(item.revenue)}</span>
                      <span className="text-gray-400 w-1/2">Expenses: {formatCurrency(item.expenses)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-white">Top Clients by Revenue</h2>
              <BarChart 
                data={reportData.topClients} 
                valueKey="revenue" 
                labelKey="name" 
                title="Client Revenue" 
                color="blue"
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 