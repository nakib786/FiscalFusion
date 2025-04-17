import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import CashFlowNav from './CashFlowNav';
import Link from 'next/link';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function CashFlow() {
  const [cashFlowData, setCashFlowData] = useState({
    balance: 16000,
    monthlyData: [],
    transactions: [],
    forecast: {
      nextMonth: 18500,
      threeMontAvg: 17500
    },
    insights: {
      topIncomeSource: { name: 'Client Services', amount: 8500 },
      topExpense: { name: 'Office Rent', amount: 3200 },
      cashflowTrend: 'increasing'
    }
  });
  const [timeframe, setTimeframe] = useState('month'); // 'week', 'month', 'quarter', 'year'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCashFlowData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to get data from backend
        const response = await fetch(`/api/cashflow?timeframe=${timeframe}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format the data to match our state structure
        const formattedData = {
          balance: data.data?.balance || 16000,
          monthlyData: data.data?.monthlyData || generateMockMonthlyData(),
          transactions: data.data?.transactions || generateMockTransactions(),
          forecast: data.data?.forecast || {
            nextMonth: 18500,
            threeMontAvg: 17500
          },
          insights: data.data?.insights || {
            topIncomeSource: { name: 'Client Services', amount: 8500 },
            topExpense: { name: 'Office Rent', amount: 3200 },
            cashflowTrend: 'increasing'
          }
        };
        
        setCashFlowData(formattedData);
      } catch (err) {
        console.error('Failed to fetch cash flow data:', err);
        setError('Could not load cash flow data');
        
        // Set mock data
        setCashFlowData({
          balance: 16000,
          monthlyData: generateMockMonthlyData(),
          transactions: generateMockTransactions(),
          forecast: {
            nextMonth: 18500,
            threeMontAvg: 17500
          },
          insights: {
            topIncomeSource: { name: 'Client Services', amount: 8500 },
            topExpense: { name: 'Office Rent', amount: 3200 },
            cashflowTrend: 'increasing'
          }
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCashFlowData();
  }, [timeframe]);

  // Helper functions to generate mock data
  function generateMockMonthlyData() {
    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    return months.map(month => ({
      month,
      moneyIn: Math.floor(Math.random() * 10000) + 10000,
      moneyOut: Math.floor(Math.random() * 8000) + 7000,
      netCashFlow: 0 // Will be calculated below
    })).map(item => ({
      ...item,
      netCashFlow: item.moneyIn - item.moneyOut
    }));
  }
  
  function generateMockTransactions() {
    const types = ['income', 'expense'];
    const categories = {
      income: ['Client Payment', 'Product Sales', 'Consulting', 'Dividends', 'Royalties'],
      expense: ['Office Rent', 'Utilities', 'Payroll', 'Software Subscriptions', 'Travel', 'Marketing']
    };
    
    const transactions = [];
    for (let i = 0; i < 10; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const category = categories[type][Math.floor(Math.random() * categories[type].length)];
      const amount = type === 'income' 
        ? Math.floor(Math.random() * 5000) + 1000 
        : -(Math.floor(Math.random() * 3000) + 500);
      
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      transactions.push({
        id: i + 1,
        date: date.toISOString().split('T')[0],
        type,
        category,
        amount,
        description: `${type === 'income' ? 'Payment received' : 'Payment made'} for ${category}`
      });
    }
    
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Calculate total income, expense, and net cash flow
  const totalIncome = cashFlowData.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = cashFlowData.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const netCashFlow = totalIncome - totalExpense;
  
  // Prepare chart data
  const barChartData = {
    labels: cashFlowData.monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Income',
        data: cashFlowData.monthlyData.map(data => data.moneyIn),
        backgroundColor: '#4CAF50',
        borderRadius: 4
      },
      {
        label: 'Expenses',
        data: cashFlowData.monthlyData.map(data => data.moneyOut),
        backgroundColor: '#F44336',
        borderRadius: 4
      }
    ]
  };
  
  const lineChartData = {
    labels: cashFlowData.monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Net Cash Flow',
        data: cashFlowData.monthlyData.map(data => data.netCashFlow),
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading cash flow data...</div>;
  }

  return (
    <div className="p-6 bg-transparent backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl font-semibold mb-4 md:mb-0">Cash Flow</h1>
        <div className="inline-flex space-x-2 rounded-md shadow-sm">
          <button 
            onClick={() => setTimeframe('week')} 
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${timeframe === 'week' 
              ? 'bg-blue-600 text-white' 
              : 'bg-transparent backdrop-blur-sm text-gray-700 hover:bg-gray-50/30 border border-gray-300'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimeframe('month')} 
            className={`px-4 py-2 text-sm font-medium ${timeframe === 'month' 
              ? 'bg-blue-600 text-white' 
              : 'bg-transparent backdrop-blur-sm text-gray-700 hover:bg-gray-50/30 border-t border-b border-gray-300'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimeframe('quarter')} 
            className={`px-4 py-2 text-sm font-medium ${timeframe === 'quarter' 
              ? 'bg-blue-600 text-white' 
              : 'bg-transparent backdrop-blur-sm text-gray-700 hover:bg-gray-50/30 border-t border-b border-gray-300'}`}
          >
            Quarter
          </button>
          <button 
            onClick={() => setTimeframe('year')} 
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${timeframe === 'year' 
              ? 'bg-blue-600 text-white' 
              : 'bg-transparent backdrop-blur-sm text-gray-700 hover:bg-gray-50/30 border border-gray-300'}`}
          >
            Year
          </button>
        </div>
      </div>
      
      <CashFlowNav />
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="dashboard-card p-5">
          <p className="dashboard-card-subtitle">Current Cash Balance</p>
          <h3 className="dashboard-card-value text-3xl">{formatCurrency(cashFlowData.balance)}</h3>
          <div className="flex items-center mt-1">
            <span className={`text-sm ${netCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {netCashFlow >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(netCashFlow))} 
            </span>
            <span className="text-sm text-gray-500 ml-1">in last {timeframe}</span>
          </div>
        </div>
        
        <div className="dashboard-card p-5">
          <p className="dashboard-card-subtitle">Total Income</p>
          <h3 className="dashboard-card-value text-3xl text-green-600">{formatCurrency(totalIncome)}</h3>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-500">
              Top source: {cashFlowData.insights.topIncomeSource.name} ({formatCurrency(cashFlowData.insights.topIncomeSource.amount)})
            </span>
          </div>
        </div>
        
        <div className="dashboard-card p-5">
          <p className="dashboard-card-subtitle">Total Expenses</p>
          <h3 className="dashboard-card-value text-3xl text-red-600">{formatCurrency(totalExpense)}</h3>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-500">
              Top expense: {cashFlowData.insights.topExpense.name} ({formatCurrency(cashFlowData.insights.topExpense.amount)})
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="dashboard-card p-5">
          <h2 className="dashboard-card-title mb-6">INCOME VS EXPENSES</h2>
          <div className="h-64">
            <Bar 
              data={barChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => '$' + value.toLocaleString()
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }} 
            />
          </div>
        </div>
        
        <div className="dashboard-card p-5">
          <h2 className="dashboard-card-title mb-6">NET CASH FLOW TREND</h2>
          <div className="h-64">
            <Line 
              data={lineChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    ticks: {
                      callback: (value) => '$' + value.toLocaleString()
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
      
      <div className="dashboard-card p-5 mb-8">
        <h2 className="dashboard-card-title mb-6">CASH FLOW FORECAST</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-100 rounded-lg">
            <p className="text-gray-500 text-sm mb-1">Projected Next Month</p>
            <p className="text-2xl font-bold">{formatCurrency(cashFlowData.forecast.nextMonth)}</p>
            <p className={`text-sm mt-1 ${cashFlowData.forecast.nextMonth > cashFlowData.balance ? 'text-green-500' : 'text-red-500'}`}>
              {cashFlowData.forecast.nextMonth > cashFlowData.balance ? '↑' : '↓'} {formatCurrency(Math.abs(cashFlowData.forecast.nextMonth - cashFlowData.balance))} from current
            </p>
          </div>
          
          <div className="p-4 border border-gray-100 rounded-lg">
            <p className="text-gray-500 text-sm mb-1">3-Month Average</p>
            <p className="text-2xl font-bold">{formatCurrency(cashFlowData.forecast.threeMontAvg)}</p>
            <p className="text-sm text-gray-500 mt-1">Based on historical data</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-card p-5">
        <h2 className="dashboard-card-title mb-6">RECENT TRANSACTIONS</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cashFlowData.transactions.slice(0, 5).map(transaction => (
                <tr key={transaction.id} className="text-sm">
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(transaction.date)}</td>
                  <td className="px-4 py-3">{transaction.description}</td>
                  <td className="px-4 py-3">{transaction.category}</td>
                  <td className={`px-4 py-3 text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-center">
          <Link href="/transactions">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All Transactions</button>
          </Link>
        </div>
      </div>
    </div>
  );
} 