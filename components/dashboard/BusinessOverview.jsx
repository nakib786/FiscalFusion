import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function BusinessOverview() {
  const [overviewData, setOverviewData] = useState({
    cashFlow: {
      balance: 16000,
      monthlyData: [],
      insights: {
        topIncomeSource: { name: 'Client Services', amount: 8500 },
        topExpense: { name: 'Office Rent', amount: 3200 },
        cashflowTrend: 'increasing'
      },
      recentTransactions: []
    },
    expenses: {
      total: 14000,
      breakdown: []
    },
    profitAndLoss: {
      netIncome: 20000,
      income: 100000,
      expenses: 80000
    },
    invoices: {
      unpaid: 5281.52,
      overdue: 1525.50,
      notDueYet: 3756.02,
      paid: 3692.22,
      notDeposited: 2062.52,
      deposited: 1629.70
    },
    sales: {
      total: 3500,
      monthlyData: []
    },
    bankAccounts: {
      checking: {
        balance: 12435.65,
        inQB: 4987.43
      },
      mastercard: {
        balance: -3435.65,
        inQB: 157.72
      }
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessOverview = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to get data from backend with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        console.log('Fetching dashboard data...');
        const response = await fetch('/api/dashboard', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dashboard data received:', data.success);
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch data');
        }
        
        // Format the data to match our state structure
        const formattedData = {
          cashFlow: {
            balance: data.data?.cashBalance || 16000,
            monthlyData: data.data?.cashFlowData || generateMockCashFlowData(),
            insights: data.data?.cashFlowInsights || {
              topIncomeSource: { name: 'Client Services', amount: 8500 },
              topExpense: { name: 'Office Rent', amount: 3200 },
              cashflowTrend: 'increasing'
            },
            recentTransactions: data.data?.cashFlowTransactions || []
          },
          expenses: {
            total: data.data?.totalExpenses || 14000,
            breakdown: data.data?.expensesBreakdown || generateMockExpensesBreakdown()
          },
          profitAndLoss: {
            netIncome: data.data?.netIncome || 20000,
            income: data.data?.totalIncome || 100000,
            expenses: data.data?.totalExpenses || 80000
          },
          invoices: {
            unpaid: data.data?.unpaidInvoices || 5281.52,
            overdue: data.data?.overdueInvoices || 1525.50,
            notDueYet: data.data?.notDueYetInvoices || 3756.02,
            paid: data.data?.paidInvoices || 3692.22,
            notDeposited: data.data?.notDepositedInvoices || 2062.52,
            deposited: data.data?.depositedInvoices || 1629.70
          },
          sales: {
            total: data.data?.totalSales || 3500,
            monthlyData: data.data?.salesData || generateMockSalesData()
          },
          bankAccounts: {
            checking: {
              balance: data.data?.checkingBalance || 12435.65,
              inQB: data.data?.checkingInQB || 4987.43
            },
            mastercard: {
              balance: data.data?.mastercardBalance || -3435.65,
              inQB: data.data?.mastercardInQB || 157.72
            }
          }
        };
        
        setOverviewData(formattedData);
      } catch (err) {
        console.error('Failed to fetch business overview data:', err);
        setError(`Could not load business overview data: ${err.message}`);
        
        // Set mock data as fallback
        setOverviewData({
          cashFlow: {
            balance: 16000,
            monthlyData: generateMockCashFlowData(),
            insights: {
              topIncomeSource: { name: 'Client Services', amount: 8500 },
              topExpense: { name: 'Office Rent', amount: 3200 },
              cashflowTrend: 'increasing'
            },
            recentTransactions: []
          },
          expenses: {
            total: 14000,
            breakdown: generateMockExpensesBreakdown()
          },
          profitAndLoss: {
            netIncome: 20000,
            income: 100000,
            expenses: 80000
          },
          invoices: {
            unpaid: 5281.52,
            overdue: 1525.50,
            notDueYet: 3756.02,
            paid: 3692.22,
            notDeposited: 2062.52,
            deposited: 1629.70
          },
          sales: {
            total: 3500,
            monthlyData: generateMockSalesData()
          },
          bankAccounts: {
            checking: {
              balance: 12435.65,
              inQB: 4987.43
            },
            mastercard: {
              balance: -3435.65,
              inQB: 157.72
            }
          }
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinessOverview();
  }, []);

  // Helper functions to generate mock data
  function generateMockCashFlowData() {
    return [
      { month: 'Feb', moneyIn: 15000, moneyOut: 10000 },
      { month: 'Mar', moneyIn: 18000, moneyOut: 12000 },
      { month: 'Apr', moneyIn: 17000, moneyOut: 11000 },
      { month: 'May', moneyIn: 19000, moneyOut: 12000 }
    ];
  }
  
  function generateMockExpensesBreakdown() {
    return [
      { category: 'Rent & mortgage', amount: 6500 },
      { category: 'Automotive', amount: 5250 },
      { category: 'Meals & entertainment', amount: 2250 }
    ];
  }
  
  function generateMockSalesData() {
    return [
      { date: 'Mar 2', amount: 1000 },
      { date: 'Mar 10', amount: 1500 },
      { date: 'Mar 18', amount: 1800 },
      { date: 'Mar 25', amount: 2000 },
      { date: 'Mar 31', amount: 3500 }
    ];
  }
  
  // Prepare chart data
  const cashFlowChartData = {
    labels: overviewData.cashFlow.monthlyData.map(item => item.month),
    datasets: [
      {
        type: 'bar',
        label: 'Money in',
        backgroundColor: '#4CAF50',
        data: overviewData.cashFlow.monthlyData.map(item => item.moneyIn),
        borderWidth: 0,
        borderRadius: 4,
      },
      {
        type: 'bar',
        label: 'Money out',
        backgroundColor: '#2196F3',
        data: overviewData.cashFlow.monthlyData.map(item => item.moneyOut),
        borderWidth: 0,
        borderRadius: 4,
      }
    ]
  };
  
  const expensesChartData = {
    labels: overviewData.expenses.breakdown.map(item => item.category),
    datasets: [
      {
        data: overviewData.expenses.breakdown.map(item => item.amount),
        backgroundColor: ['#00BCD4', '#9C27B0', '#FF9800'],
        borderWidth: 0,
      }
    ]
  };
  
  const salesChartData = {
    labels: overviewData.sales.monthlyData.map(item => item.date),
    datasets: [
      {
        label: 'Sales',
        data: overviewData.sales.monthlyData.map(item => item.amount),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#FFF',
        pointBorderColor: '#4CAF50',
        pointBorderWidth: 2,
        fill: true,
      }
    ]
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading business overview...</div>;
  }

  return (
    <div className="bg-transparent backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Business overview</h1>
        <div className="flex items-center">
          <span className="mr-2 text-gray-200">Privacy</span>
          <div className="w-12 h-6 bg-slate-800/50 rounded-full p-1 flex items-center">
            <div className="bg-blue-500 w-4 h-4 rounded-full shadow-md transform translate-x-6"></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CASH FLOW */}
        <div className="dashboard-card p-5">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">CASH FLOW</h2>
            <div className="flex items-center">
              <a href="/cashflow" className="text-blue-500 hover:text-blue-700 mr-3 text-sm">View Details</a>
              <button className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
          
          <h3 className="dashboard-card-value">${overviewData.cashFlow.balance.toLocaleString()}</h3>
          <p className="dashboard-card-subtitle mb-4">Current cash balance</p>
          
          <div className="h-44">
            <Bar 
              data={cashFlowChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                      boxWidth: 10,
                      padding: 10
                    }
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => '$ ' + value
                    }
                  }
                }
              }}
            />
          </div>
          
          {overviewData.cashFlow.recentTransactions && overviewData.cashFlow.recentTransactions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Recent Transaction</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{overviewData.cashFlow.recentTransactions[0]?.category || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{new Date(overviewData.cashFlow.recentTransactions[0]?.date || new Date()).toLocaleDateString()}</p>
                </div>
                <p className={`font-medium ${overviewData.cashFlow.recentTransactions[0]?.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {overviewData.cashFlow.recentTransactions[0]?.type === 'income' ? '+' : '-'}
                  ${Math.abs(overviewData.cashFlow.recentTransactions[0]?.amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* EXPENSES */}
        <div className="dashboard-card p-5">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">EXPENSES</h2>
            <div className="flex items-center">
              <a href="/expenses" className="text-blue-500 hover:text-blue-700 mr-3 text-sm">View Details</a>
              <span className="text-sm text-gray-500 mr-1">Last month</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <h3 className="dashboard-card-value">${overviewData.expenses.total.toLocaleString()}</h3>
          <p className="dashboard-card-subtitle mb-4">Last month</p>
          
          <div className="h-44 flex justify-center">
            <Doughnut 
              data={expensesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
          
          <div className="mt-4">
            {overviewData.expenses.breakdown.map((item, index) => (
              <div key={index} className="flex items-center py-1">
                <span className={`w-3 h-3 rounded-full mr-2`} style={{ 
                  backgroundColor: ['#00BCD4', '#9C27B0', '#FF9800'][index % 3] 
                }}></span>
                <span className="text-sm">{item.category}</span>
                <span className="ml-auto text-sm">${item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* PROFIT AND LOSS */}
        <div className="dashboard-card p-5">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">PROFIT AND LOSS</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-1">Last month</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <h3 className="dashboard-card-value">${overviewData.profitAndLoss.netIncome.toLocaleString()}</h3>
          <p className="dashboard-card-subtitle mb-6">Net income for March</p>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Income</span>
              <div className="flex items-center">
                <span className="text-sm mr-1">${overviewData.profitAndLoss.income.toLocaleString()}</span>
                <span className="status-badge status-badge-green">8 to review</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill progress-bar-fill-green" style={{ width: '90%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Expenses</span>
              <div className="flex items-center">
                <span className="text-sm mr-1">${overviewData.profitAndLoss.expenses.toLocaleString()}</span>
                <span className="status-badge status-badge-green">15 to review</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill progress-bar-fill-blue" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
        
        {/* INVOICES */}
        <div className="dashboard-card p-5">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">INVOICES</h2>
          </div>
          
          <div className="mb-4">
            <p className="text-sm">
              <span className="font-semibold">${overviewData.invoices.unpaid.toLocaleString()} Unpaid</span>
              <span className="text-gray-500 ml-2">Last 365 days</span>
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold text-orange-500">${overviewData.invoices.overdue.toLocaleString()}</h3>
              <p className="dashboard-card-subtitle">Overdue</p>
              <div className="progress-bar mt-2">
                <div className="progress-bar-fill progress-bar-fill-orange" style={{ width: '40%' }}></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-400">${overviewData.invoices.notDueYet.toLocaleString()}</h3>
              <p className="dashboard-card-subtitle">Not due yet</p>
              <div className="progress-bar mt-2">
                <div className="progress-bar-fill progress-bar-fill-gray" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm">
              <span className="font-semibold">${overviewData.invoices.paid.toLocaleString()} Paid</span>
              <span className="text-gray-500 ml-2">Last 30 days</span>
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-700">${overviewData.invoices.notDeposited.toLocaleString()}</h3>
              <p className="dashboard-card-subtitle">Not deposited</p>
              <div className="progress-bar mt-2">
                <div className="progress-bar-fill progress-bar-fill-orange" style={{ width: '55%' }}></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-green-500">${overviewData.invoices.deposited.toLocaleString()}</h3>
              <p className="dashboard-card-subtitle">Deposited</p>
              <div className="progress-bar mt-2">
                <div className="progress-bar-fill progress-bar-fill-green" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* SALES */}
        <div className="dashboard-card p-5">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">SALES</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-1">Last month</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <h3 className="dashboard-card-value">${overviewData.sales.total.toLocaleString()}</h3>
          <p className="dashboard-card-subtitle mb-4">Last month</p>
          
          <div className="h-56">
            <Line 
              data={salesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => '$ ' + value
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* BANK ACCOUNTS */}
        <div className="dashboard-card p-5">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">BANK ACCOUNTS</h2>
            <button className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Checking</span>
              <div className="flex items-center">
                <span className="status-badge status-badge-blue mr-2">94 to review</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Bank balance</p>
                <p className="text-sm text-gray-500">in QuickBooks</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${overviewData.bankAccounts.checking.balance.toLocaleString()}</p>
                <p className="text-gray-500">${overviewData.bankAccounts.checking.inQB.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Updated 4 days ago</p>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Mastercard</span>
              <div className="flex items-center">
                <span className="status-badge status-badge-blue mr-2">94 to review</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Bank balance</p>
                <p className="text-sm text-gray-500">in QuickBooks</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-500">-${Math.abs(overviewData.bankAccounts.mastercard.balance).toLocaleString()}</p>
                <p className="text-gray-500">${overviewData.bankAccounts.mastercard.inQB.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Updated moments ago</p>
          </div>
          
          <div className="mt-6">
            <button className="text-blue-500 text-sm">Connect accounts</button>
          </div>
        </div>
      </div>
    </div>
  );
} 