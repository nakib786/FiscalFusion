"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DashboardPreview = () => {
  // States for animated values and UI
  const [barValues, setBarValues] = useState([60, 45, 75, 50, 65, 40]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('overview');
  
  // Define sidebar items with icons
  const sidebarItems = [
    {
      id: "overview", 
      label: "Dashboard",
      icon: "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
    },
    { 
      id: "clients", 
      label: "Clients",
      icon: "M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
    },
    { 
      id: "invoices", 
      label: "Invoices",
      icon: "M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
    },
    { 
      id: "expenses", 
      label: "Expenses",
      icon: "M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
    },
    { 
      id: "cashflow", 
      label: "Cash Flow",
      icon: "M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
    },
    { 
      id: "reports", 
      label: "Reports",
      icon: "M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"
    }
  ];
  
  // Mock data for dashboard cards
  const dashboardData = {
    overview: {
      title: "Business Overview",
      cards: [
        { title: "Total Revenue", value: "$142,568", trend: "+12.4%", positive: true },
        { title: "Expenses", value: "$58,623", trend: "-2.3%", positive: true },
        { title: "Profit", value: "$83,945", trend: "+15.8%", positive: true },
        { title: "Outstanding Invoices", value: "$24,350", trend: "+5.2%", positive: false }
      ]
    },
    clients: {
      title: "Client Management",
      cards: [
        { title: "Total Clients", value: "19", trend: "+3", positive: true },
        { title: "Active Clients", value: "15", trend: "78.9%", positive: true },
        { title: "New This Month", value: "2", trend: "+1", positive: true },
        { title: "Average Value", value: "$6,405", trend: "+5.7%", positive: true }
      ]
    },
    invoices: {
      title: "Invoice Summary",
      cards: [
        { title: "Total Invoices", value: "46", trend: "+8", positive: true },
        { title: "Paid", value: "37", trend: "80.4%", positive: true },
        { title: "Pending", value: "8", trend: "17.4%", positive: false },
        { title: "Overdue", value: "1", trend: "2.2%", positive: false }
      ]
    },
    expenses: {
      title: "Expense Tracking",
      cards: [
        { title: "Total Expenses", value: "$58,623", trend: "-2.3%", positive: true },
        { title: "This Month", value: "$12,350", trend: "+1.8%", positive: false },
        { title: "Largest Category", value: "Office", trend: "$4,230", positive: null },
        { title: "Recurring", value: "$8,210", trend: "14.0%", positive: null }
      ]
    },
    cashflow: {
      title: "Cash Flow Analysis",
      cards: [
        { title: "Net Cash Flow", value: "$83,945", trend: "+15.8%", positive: true },
        { title: "Current Balance", value: "$156,420", trend: "+8.3%", positive: true },
        { title: "Projected Q4", value: "$210K", trend: "+15%", positive: true },
        { title: "Burn Rate", value: "$14.5K/mo", trend: "-2.8%", positive: true }
      ]
    },
    reports: {
      title: "Financial Reports",
      cards: [
        { title: "Reports Generated", value: "24", trend: "+5", positive: null },
        { title: "Tax Documents", value: "12", trend: "Complete", positive: true },
        { title: "Last Generated", value: "2d ago", trend: "P&L", positive: null },
        { title: "Scheduled", value: "3", trend: "Monthly", positive: null }
      ]
    }
  };
  
  // Set up client-side functionality
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Handle sidebar item clicks
  const handleSidebarItemClick = (id) => {
    setLoading(true);
    setActiveSidebarItem(id);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      
      // Change bar charts on tab change with different values for each section
      switch(id) {
        case 'overview':
          setBarValues([60, 45, 75, 50, 65, 40]);
          break;
        case 'clients':
          setBarValues([30, 45, 55, 60, 75, 65]);
          break;
        case 'invoices':
          setBarValues([70, 65, 75, 80, 85, 90]);
          break;
        case 'expenses':
          setBarValues([50, 55, 45, 60, 50, 40]);
          break;
        case 'cashflow':
          setBarValues([40, 50, 45, 60, 70, 80]);
          break;
        case 'reports':
          setBarValues([55, 60, 50, 65, 70, 65]);
          break;
        default:
          setBarValues([60, 45, 75, 50, 65, 40]);
      }
    }, 500);
  };
  
  // Calculate bar height
  const getBarHeight = (value) => {
    return `${value}%`;
  };
  
  // Render dashboard content based on selected sidebar item
  const renderDashboardContent = () => {
    const currentData = dashboardData[activeSidebarItem];
    
    if (!currentData) return null;
    
    // Different layout for each section
    switch(activeSidebarItem) {
      case 'overview':
        return renderOverviewDashboard();
      case 'clients':
        return renderClientsDashboard();
      case 'invoices':
        return renderInvoicesDashboard();
      case 'expenses':
        return renderExpensesDashboard();
      case 'cashflow':
        return renderCashflowDashboard();
      case 'reports':
        return renderReportsDashboard();
      default:
        return renderOverviewDashboard();
    }
  };
  
  // Overview dashboard layout
  const renderOverviewDashboard = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Business Overview</h2>
        
        {/* KPI Cards - 4 columns */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {dashboardData.overview.cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50"
            >
              <div className="text-xs text-gray-400">{card.title}</div>
              <div className="text-lg font-semibold text-white mt-1">{card.value}</div>
              {card.trend && (
                <div className={`text-xs flex items-center gap-1 mt-1 ${
                  card.positive === true ? 'text-green-400' : 
                  card.positive === false ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {card.positive === true && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  {card.positive === false && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  {card.trend}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Charts - Main Revenue Chart and Secondary Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2 bg-gray-800/50 rounded-lg p-3 hover:bg-gray-700/40 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-white">Revenue Overview</span>
              <div className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                Live Data
              </div>
            </div>
            
            {/* Area Chart */}
            <div className="h-40 relative">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d={`M0,${100-barValues[0]} ${barValues.map((value, i) => `L${(i + 1) * (100/barValues.length)},${100-value}`).join(' ')}`}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                />
                
                <path
                  d={`M0,${100-barValues[0]} ${barValues.map((value, i) => `L${(i + 1) * (100/barValues.length)},${100-value}`).join(' ')} L100,100 L0,100 Z`}
                  fill="url(#areaGradient)"
                  opacity="0.2"
                />
                
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Data points with tooltips */}
              {isClient && barValues.map((value, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className="absolute w-1.5 h-1.5 bg-green-400 rounded-full shadow-md shadow-green-500/30 hover:scale-150 transition-transform duration-200 cursor-pointer"
                  style={{ 
                    bottom: `${value}%`, 
                    left: `${(i + 1) * (100/barValues.length)}%`,
                    transform: 'translate(-50%, 50%)',
                  }}
                  whileHover={{ 
                    scale: 2,
                    boxShadow: "0px 0px 8px rgba(34, 197, 94, 0.5)" 
                  }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 pointer-events-none z-10">
                    <div className="px-1.5 py-1 text-[8px] font-bold rounded-md shadow-lg whitespace-nowrap bg-green-500 text-white">
                      +${(value * 800).toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-between mt-2">
              <div className="text-xs text-gray-500">Jan</div>
              <div className="text-xs text-gray-500">Feb</div>
              <div className="text-xs text-gray-500">Mar</div>
              <div className="text-xs text-gray-500">Apr</div>
              <div className="text-xs text-gray-500">May</div>
              <div className="text-xs text-gray-500">Jun</div>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Metrics Summary Card */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-2">YTD Performance</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Monthly Goal</div>
                  <div className="text-sm text-white font-medium">$50,000</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">YTD Achieved</div>
                  <div className="text-sm text-white font-medium">85%</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xs text-white mb-1">Progress</div>
                <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-2">Quick Stats</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">Active Users</div>
                  <div className="text-xs font-medium text-white">2,451</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">New Clients</div>
                  <div className="text-xs font-medium text-white">+12 <span className="text-green-400">↑</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">Avg. Session</div>
                  <div className="text-xs font-medium text-white">24m 30s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-gray-400">Recent Transactions</span>
            <button className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 group">
              View All
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2">
            {[
              { name: 'Client Payment', amount: '+$2,450', type: 'income', time: '2h ago' },
              { name: 'Office Supplies', amount: '-$350', type: 'expense', time: '1d ago' },
              { name: 'Subscription Renewal', amount: '-$129', type: 'expense', time: '2d ago' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700/30 transition-colors cursor-pointer"
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: 'rgba(75, 85, 99, 0.3)' 
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full ${item.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                    <svg className={`w-3 h-3 ${item.type === 'income' ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.type === 'income' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{item.name}</p>
                    <p className="text-[10px] text-gray-500">{item.time}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold ${item.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {item.amount}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Client dashboard layout
  const renderClientsDashboard = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Client Management</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {dashboardData.clients.cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50"
            >
              <div className="text-xs text-gray-400">{card.title}</div>
              <div className="text-lg font-semibold text-white mt-1">{card.value}</div>
              {card.trend && (
                <div className={`text-xs flex items-center gap-1 mt-1 ${
                  card.positive === true ? 'text-green-400' : 
                  card.positive === false ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {card.positive === true && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  {card.positive === false && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  {card.trend}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Client Table and Distribution */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Client Table */}
          <div className="col-span-2 bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-white">Client Directory</span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input type="text" placeholder="Search clients..." className="text-xs bg-gray-700/50 border border-gray-700 rounded-md py-1 px-2 text-gray-300 w-32" />
                  <svg className="w-3 h-3 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button className="text-[10px] px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">+ Add</button>
              </div>
            </div>
            
            {/* Client List */}
            <div className="space-y-1">
              {[
                { name: 'Acme Corporation', status: 'Active', value: '$24,500', lastActivity: '2 days ago' },
                { name: 'Globex Industries', status: 'Active', value: '$18,200', lastActivity: '5 days ago' },
                { name: 'Stark Enterprises', status: 'Pending', value: '$5,800', lastActivity: 'Today' },
                { name: 'Wayne Industries', status: 'Active', value: '$32,100', lastActivity: 'Yesterday' },
              ].map((client, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.1 }}
                  className="flex items-center justify-between bg-gray-700/30 hover:bg-gray-700/50 p-2 rounded-md cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-blue-400">{client.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">{client.name}</div>
                      <div className="text-[10px] text-gray-400">Last active: {client.lastActivity}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-medium text-white">{client.value}</div>
                      <div className={`text-[10px] ${client.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}`}>{client.status}</div>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Client Distribution */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs font-medium text-white mb-3">Client Distribution</div>
            
            {/* Donut chart replacement */}
            <div className="relative pt-12 pb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">19</div>
                  <div className="text-[10px] text-gray-400">Total Clients</div>
                </div>
              </div>
              
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#374151" strokeWidth="12" />
                
                {/* Active Segment - 78.9% */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent"
                  stroke="#3B82F6" 
                  strokeWidth="12"
                  strokeDasharray="251.2 320"
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                
                {/* New Segment - 10.5% */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent"
                  stroke="#10B981" 
                  strokeWidth="12"
                  strokeDasharray="33.6 320"
                  strokeDashoffset="-251.2"
                  transform="rotate(-90 50 50)"
                />
                
                {/* Inactive Segment - 10.6% */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent"
                  stroke="#9CA3AF" 
                  strokeWidth="12"
                  strokeDasharray="34 320"
                  strokeDashoffset="-284.8"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            
            {/* Legend */}
            <div className="space-y-1 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-[10px] text-gray-300">Active</span>
                </div>
                <span className="text-[10px] font-medium text-white">15 (78.9%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px] text-gray-300">New</span>
                </div>
                <span className="text-[10px] font-medium text-white">2 (10.5%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span className="text-[10px] text-gray-300">Inactive</span>
                </div>
                <span className="text-[10px] font-medium text-white">2 (10.6%)</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Client Activity */}
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-gray-400">Recent Client Activity</span>
            <button className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 group">
              View All
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2">
            {[
              { name: 'Acme Corp', action: 'Invoice Paid', amount: '$2,450', time: '2h ago' },
              { name: 'TechGiant Inc', action: 'New Project', amount: '$5,800', time: '1d ago' },
              { name: 'Startup XYZ', action: 'Meeting Scheduled', amount: '', time: 'Jul 18' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700/30 transition-colors cursor-pointer"
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: 'rgba(75, 85, 99, 0.3)' 
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-blue-400">{item.name.substring(0, 2)}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{item.name}</p>
                    <p className="text-[10px] text-gray-500">{item.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  {item.amount && <span className="text-xs font-semibold text-white">{item.amount}</span>}
                  <p className="text-[10px] text-gray-500">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Invoice dashboard layout
  const renderInvoicesDashboard = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Invoice Summary</h2>
        
        {/* Status Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {dashboardData.invoices.cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50"
            >
              <div className="text-xs text-gray-400">{card.title}</div>
              <div className="text-lg font-semibold text-white mt-1">{card.value}</div>
              {card.trend && (
                <div className={`text-xs flex items-center gap-1 mt-1 ${
                  card.positive === true ? 'text-green-400' : 
                  card.positive === false ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {card.positive === true && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  {card.positive === false && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  {card.trend}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Payment Status and Timeline */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Pie Chart */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-white">Payment Status</span>
              <div className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">July 2023</div>
            </div>
            
            <div className="relative h-40 flex items-center justify-center">
              {/* Simple Pie Chart visualization */}
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Paid segment - 80.4% */}
                  <path 
                    d="M50 10 A40 40 0 0 1 90 50 L50 50 Z" 
                    fill="#10B981" /* Green */
                  />
                  
                  {/* Pending segment - 17.4% */}
                  <path 
                    d="M90 50 A40 40 0 0 1 83.5 74.6 L50 50 Z" 
                    fill="#F59E0B" /* Yellow */
                  />
                  
                  {/* Overdue segment - 2.2% */}
                  <path 
                    d="M83.5 74.6 A40 40 0 0 1 50 90 L50 50 Z" 
                    fill="#EF4444" /* Red */
                  />
                  
                  {/* Hidden segment to complete the circle */}
                  <path 
                    d="M50 90 A40 40 0 0 1 50 10 L50 50 Z" 
                    fill="#4B5563" /* Gray */
                    fillOpacity="0.3"
                  />
                  
                  {/* Inner circle to create a donut */}
                  <circle cx="50" cy="50" r="20" fill="#1F2937" />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-sm font-bold text-white">46</div>
                  <div className="text-[10px] text-gray-400">Invoices</div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="absolute right-4 top-8 space-y-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px] text-gray-300">Paid (80.4%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-[10px] text-gray-300">Pending (17.4%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-[10px] text-gray-300">Overdue (2.2%)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeline */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-white">Upcoming Payments</span>
              <div className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400">$12,850 Due</div>
            </div>
            
            <div className="space-y-3 mt-2">
              {[
                { client: 'Acme Corp', amount: '$3,200', dueDate: 'Jul 22, 2023', daysLeft: 5 },
                { client: 'TechGiant Inc', amount: '$5,400', dueDate: 'Jul 28, 2023', daysLeft: 11 },
                { client: 'Stark Enterprises', amount: '$2,850', dueDate: 'Aug 03, 2023', daysLeft: 17 },
                { client: 'Wayne Industries', amount: '$1,400', dueDate: 'Aug 12, 2023', daysLeft: 26 },
              ].map((payment, i) => (
                <motion.div
                  key={i} 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-center"
                >
                  <div className="mr-2 relative h-12 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 z-10"></div>
                    {i < 3 && <div className="h-full w-0.5 bg-gray-700 absolute top-3"></div>}
                  </div>
                  <div className="bg-gray-700/30 rounded p-2 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-medium text-white">{payment.client}</div>
                        <div className="text-[10px] text-gray-400">Due: {payment.dueDate}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-white">{payment.amount}</div>
                        <div className={`text-[10px] ${
                          payment.daysLeft < 7 ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {payment.daysLeft} days left
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Invoice Table */}
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-gray-400">Recent Invoices</span>
            <div className="flex gap-2">
              <div className="relative">
                <input type="text" placeholder="Search..." className="text-xs bg-gray-700/50 border border-gray-700 rounded-md py-1 px-2 text-gray-300 w-32" />
                <svg className="w-3 h-3 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="text-[10px] px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">+ New</button>
            </div>
          </div>
          
          {/* Table Header */}
          <div className="grid grid-cols-12 text-[10px] font-medium text-gray-400 py-2 border-b border-gray-700">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Client</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>
          
          {/* Table Content */}
          <div className="space-y-1 mt-2">
            {[
              { id: 'INV-2023-056', client: 'Acme Corp', date: 'Jul 15, 2023', amount: '$2,450', status: 'Paid' },
              { id: 'INV-2023-055', client: 'TechGiant Inc', date: 'Jul 12, 2023', amount: '$1,850', status: 'Pending' },
              { id: 'INV-2023-054', client: 'Stark Enterprises', date: 'Jul 10, 2023', amount: '$3,200', status: 'Paid' },
              { id: 'INV-2023-053', client: 'Wayne Industries', date: 'Jul 05, 2023', amount: '$4,100', status: 'Overdue' },
            ].map((invoice, i) => (
              <div key={i} className="grid grid-cols-12 text-xs py-2 hover:bg-gray-700/30 rounded transition-colors cursor-pointer">
                <div className="col-span-1 text-gray-500">{invoice.id.split('-')[2]}</div>
                <div className="col-span-3 font-medium text-white">{invoice.client}</div>
                <div className="col-span-2 text-gray-400">{invoice.date}</div>
                <div className="col-span-2 text-white">{invoice.amount}</div>
                <div className="col-span-2">
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                    invoice.status === 'Paid' ? 'bg-green-500/20 text-green-400' :
                    invoice.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <button className="text-gray-400 hover:text-white">
                    <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Expense dashboard layout
  const renderExpensesDashboard = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Expense Tracking</h2>
        
        {/* Status Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {dashboardData.expenses.cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50"
            >
              <div className="text-xs text-gray-400">{card.title}</div>
              <div className="text-lg font-semibold text-white mt-1">{card.value}</div>
              {card.trend && (
                <div className={`text-xs flex items-center gap-1 mt-1 ${
                  card.positive === true ? 'text-green-400' : 
                  card.positive === false ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {card.positive === true && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  {card.positive === false && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  {card.trend}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Expense Charts and Category Breakdown */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Expense Chart */}
          <div className="col-span-2 bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-white">Monthly Expenses</span>
              <div className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">Last 6 Months</div>
            </div>
            
            <div className="h-48 relative">
              {/* Render bars for expenses */}
              <div className="flex justify-between items-end h-40">
                {barValues.map((value, index) => (
                  <motion.div
                    key={index}
                    className="w-8 bg-red-500/60 hover:bg-red-500/80 rounded-t-sm transition-colors cursor-pointer relative group"
                    initial={{ height: 0 }}
                    animate={{ height: getBarHeight(value) }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="px-1.5 py-1 text-[8px] font-bold rounded-md shadow-lg whitespace-nowrap bg-red-500 text-white">
                        ${(value * 100).toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-between mt-2">
                <div className="text-xs text-gray-500">Jan</div>
                <div className="text-xs text-gray-500">Feb</div>
                <div className="text-xs text-gray-500">Mar</div>
                <div className="text-xs text-gray-500">Apr</div>
                <div className="text-xs text-gray-500">May</div>
                <div className="text-xs text-gray-500">Jun</div>
              </div>
            </div>
          </div>
          
          {/* Category Breakdown */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs font-medium text-white mb-3">Expense Categories</div>
            
            <div className="space-y-3">
              {[
                { category: 'Office Supplies', amount: '$4,230', percent: 34 },
                { category: 'Utilities', amount: '$2,180', percent: 17 },
                { category: 'Software', amount: '$1,850', percent: 15 },
                { category: 'Travel', amount: '$1,650', percent: 13 },
                { category: 'Marketing', amount: '$1,520', percent: 12 },
                { category: 'Others', amount: '$1,120', percent: 9 },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-300">{item.category}</span>
                    <span className="text-white font-medium">{item.amount}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 0.7, delay: i * 0.1 }}
                      className="h-full bg-red-500 rounded-full"
                    ></motion.div>
                  </div>
                  <div className="text-[10px] text-gray-500 text-right mt-0.5">{item.percent}%</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recent Expenses & Recurring */}
        <div className="grid grid-cols-2 gap-4">
          {/* Recent Expenses */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-gray-400">Recent Expenses</span>
              <button className="text-[10px] px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">+ Add</button>
            </div>
            
            <div className="space-y-2">
              {[
                { name: 'Office Supplies', date: 'Jul 15, 2023', amount: '$350', category: 'Office' },
                { name: 'Zoom Subscription', date: 'Jul 12, 2023', amount: '$149', category: 'Software' },
                { name: 'Business Travel', date: 'Jul 10, 2023', amount: '$850', category: 'Travel' },
                { name: 'Marketing Campaign', date: 'Jul 05, 2023', amount: '$1,200', category: 'Marketing' },
              ].map((expense, i) => (
                <motion.div 
                  key={i}
                  className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700/30 transition-colors cursor-pointer"
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: 'rgba(75, 85, 99, 0.3)' 
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">{expense.name}</p>
                      <p className="text-[10px] text-gray-500">{expense.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-red-400">{expense.amount}</span>
                    <p className="text-[10px] text-gray-500">{expense.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button className="w-full mt-3 text-[10px] text-blue-400 hover:underline flex items-center justify-center gap-1 group">
              View All Expenses
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Recurring Expenses */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-gray-400">Recurring Expenses</span>
              <div className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">$8,210 monthly</div>
            </div>
            
            <div className="space-y-2">
              {[
                { name: 'Office Rent', amount: '$3,200', date: '1st of month', status: 'Active' },
                { name: 'Software Subscriptions', amount: '$2,450', date: '5th of month', status: 'Active' },
                { name: 'Internet & Utilities', amount: '$850', date: '10th of month', status: 'Active' },
                { name: 'Cleaning Service', amount: '$450', date: '15th of month', status: 'Active' },
              ].map((expense, i) => (
                <motion.div 
                  key={i}
                  className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700/30 transition-colors cursor-pointer"
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: 'rgba(75, 85, 99, 0.3)' 
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">{expense.name}</p>
                      <p className="text-[10px] text-gray-500">Due: {expense.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-white">{expense.amount}</span>
                    <p className="text-[10px] text-green-400">{expense.status}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-3 text-center">
              <button className="text-[10px] px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors">
                Manage Recurring Expenses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Cashflow dashboard layout
  const renderCashflowDashboard = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Cash Flow Analysis</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {dashboardData.cashflow.cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50"
            >
              <div className="text-xs text-gray-400">{card.title}</div>
              <div className="text-lg font-semibold text-white mt-1">{card.value}</div>
              {card.trend && (
                <div className={`text-xs flex items-center gap-1 mt-1 ${
                  card.positive === true ? 'text-green-400' : 
                  card.positive === false ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {card.positive === true && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  {card.positive === false && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  {card.trend}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Cash Flow Chart */}
        <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-white">Cash Flow History</span>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] text-gray-300">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-[10px] text-gray-300">Expense</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[10px] text-gray-300">Net</span>
              </div>
            </div>
          </div>
          
          {/* Combined bar and line chart for cashflow */}
          <div className="h-48 relative">
            {/* Bars for income and expense */}
            <div className="absolute inset-0 flex items-end justify-between">
              {[
                { income: 18500, expense: 12000, month: 'Jan' },
                { income: 22000, expense: 14500, month: 'Feb' },
                { income: 19800, expense: 13200, month: 'Mar' },
                { income: 24500, expense: 15800, month: 'Apr' },
                { income: 28000, expense: 17200, month: 'May' },
                { income: 32000, expense: 18500, month: 'Jun' },
              ].map((data, i) => (
                <div key={i} className="flex flex-col items-center w-[14%]">
                  {/* Income bar */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${data.income / 400}px` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="w-6 bg-green-500/60 rounded-t-sm hover:bg-green-500/80 cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="px-1.5 py-1 text-[8px] font-bold rounded-md shadow-lg whitespace-nowrap bg-green-500 text-white">
                          ${data.income.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Gap between bars */}
                  <div className="h-[1px] w-full bg-gray-700 my-1"></div>
                  
                  {/* Expense bar */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${data.expense / 400}px` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="w-6 bg-red-500/60 rounded-b-sm hover:bg-red-500/80 cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="mt-1 px-1.5 py-1 text-[8px] font-bold rounded-md shadow-lg whitespace-nowrap bg-red-500 text-white">
                          ${data.expense.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Month label */}
                  <div className="mt-2 text-[10px] text-gray-500">{data.month}</div>
                </div>
              ))}
            </div>
            
            {/* Net line overlay */}
            <div className="absolute inset-0 flex items-center">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M7,40 L20,35 L33,38 L47,30 L60,25 L73,20"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                  strokeDasharray="5,3"
                />
                
                {/* Data points */}
                <circle cx="7" cy="40" r="2" fill="#3B82F6" />
                <circle cx="20" cy="35" r="2" fill="#3B82F6" />
                <circle cx="33" cy="38" r="2" fill="#3B82F6" />
                <circle cx="47" cy="30" r="2" fill="#3B82F6" />
                <circle cx="60" cy="25" r="2" fill="#3B82F6" />
                <circle cx="73" cy="20" r="2" fill="#3B82F6" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Cash Flow Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          {/* Income Breakdown */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-white">Income Sources</span>
              <div className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400">$65,782</div>
            </div>
            
            <div className="space-y-2">
              {[
                { source: 'Product Sales', amount: '$28,450', percent: 43.2 },
                { source: 'Services', amount: '$21,200', percent: 32.3 },
                { source: 'Subscriptions', amount: '$12,850', percent: 19.5 },
                { source: 'Other', amount: '$3,282', percent: 5.0 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-green-500 rounded-sm"></div>
                    <div>
                      <div className="text-xs font-medium text-white">{item.source}</div>
                      <div className="text-[10px] text-gray-400">{item.percent}%</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-white">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Expense Breakdown */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-white">Expense Categories</span>
              <div className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400">$32,650</div>
            </div>
            
            <div className="space-y-2">
              {[
                { category: 'Personnel', amount: '$16,450', percent: 50.4 },
                { category: 'Operations', amount: '$8,200', percent: 25.1 },
                { category: 'Marketing', amount: '$4,500', percent: 13.8 },
                { category: 'Other', amount: '$3,500', percent: 10.7 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-red-500 rounded-sm"></div>
                    <div>
                      <div className="text-xs font-medium text-white">{item.category}</div>
                      <div className="text-[10px] text-gray-400">{item.percent}%</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-white">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Reports dashboard layout
  const renderReportsDashboard = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Reports & Analytics</h2>
        
        {/* Filters */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            {['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map((period, i) => (
              <button 
                key={i}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  period === 'Monthly' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-400">Date Range:</div>
            <button className="flex items-center text-xs bg-gray-700/50 hover:bg-gray-700 transition-colors px-2 py-1 rounded">
              <span className="text-white">Jun 1 - Jul 15, 2023</span>
              <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {dashboardData.reports.cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50"
            >
              <div className="text-xs text-gray-400">{card.title}</div>
              <div className="text-lg font-semibold text-white mt-1">{card.value}</div>
              {card.trend && (
                <div className={`text-xs flex items-center gap-1 mt-1 ${
                  card.positive === true ? 'text-green-400' : 
                  card.positive === false ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {card.positive === true && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  {card.positive === false && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  {card.trend}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Main Chart and Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Main Revenue vs Expenses Chart */}
          <div className="col-span-2 bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-white">Revenue vs Expenses</span>
              <div className="flex space-x-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-[10px] text-gray-300">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-[10px] text-gray-300">Expenses</span>
                </div>
              </div>
            </div>
            
            <div className="h-60 relative">
              {/* Area Chart Visualization */}
              <svg viewBox="0 0 600 200" className="w-full h-full">
                {/* Grid Lines */}
                <g stroke="rgba(75, 85, 99, 0.3)" strokeWidth="0.5">
                  <line x1="0" y1="0" x2="600" y2="0" />
                  <line x1="0" y1="50" x2="600" y2="50" />
                  <line x1="0" y1="100" x2="600" y2="100" />
                  <line x1="0" y1="150" x2="600" y2="150" />
                  <line x1="0" y1="200" x2="600" y2="200" />
                  
                  <line x1="0" y1="0" x2="0" y2="200" />
                  <line x1="100" y1="0" x2="100" y2="200" />
                  <line x1="200" y1="0" x2="200" y2="200" />
                  <line x1="300" y1="0" x2="300" y2="200" />
                  <line x1="400" y1="0" x2="400" y2="200" />
                  <line x1="500" y1="0" x2="500" y2="200" />
                  <line x1="600" y1="0" x2="600" y2="200" />
                </g>
                
                {/* Revenue Area */}
                <path 
                  d="M0 150 C50 120, 100 100, 150 90 S250 70, 300 60 S400 50, 450 30 S550 20, 600 10 V200 H0 Z" 
                  fill="rgba(59, 130, 246, 0.2)" 
                  stroke="#3B82F6" 
                  strokeWidth="2"
                />
                
                {/* Expenses Area */}
                <path 
                  d="M0 170 C50 160, 100 150, 150 140 S250 130, 300 125 S400 120, 450 110 S550 105, 600 95 V200 H0 Z" 
                  fill="rgba(239, 68, 68, 0.2)" 
                  stroke="#EF4444" 
                  strokeWidth="2"
                />
                
                {/* Data Points - Revenue */}
                <g>
                  <circle cx="0" cy="150" r="3" fill="#3B82F6" />
                  <circle cx="100" cy="110" r="3" fill="#3B82F6" />
                  <circle cx="200" cy="80" r="3" fill="#3B82F6" />
                  <circle cx="300" cy="60" r="3" fill="#3B82F6" />
                  <circle cx="400" cy="40" r="3" fill="#3B82F6" />
                  <circle cx="500" cy="20" r="3" fill="#3B82F6" />
                  <circle cx="600" cy="10" r="3" fill="#3B82F6" />
                </g>
                
                {/* Data Points - Expenses */}
                <g>
                  <circle cx="0" cy="170" r="3" fill="#EF4444" />
                  <circle cx="100" cy="155" r="3" fill="#EF4444" />
                  <circle cx="200" cy="145" r="3" fill="#EF4444" />
                  <circle cx="300" cy="125" r="3" fill="#EF4444" />
                  <circle cx="400" cy="115" r="3" fill="#EF4444" />
                  <circle cx="500" cy="100" r="3" fill="#EF4444" />
                  <circle cx="600" cy="95" r="3" fill="#EF4444" />
                </g>
              </svg>
              
              <div className="flex justify-between mt-2 px-1">
                <div className="text-xs text-gray-500">Jan</div>
                <div className="text-xs text-gray-500">Feb</div>
                <div className="text-xs text-gray-500">Mar</div>
                <div className="text-xs text-gray-500">Apr</div>
                <div className="text-xs text-gray-500">May</div>
                <div className="text-xs text-gray-500">Jun</div>
                <div className="text-xs text-gray-500">Jul</div>
              </div>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs font-medium text-white mb-3">Key Metrics</div>
            
            <div className="space-y-4">
              {[
                { 
                  title: 'Profit Margin', 
                  value: '18.4%', 
                  trend: '+2.1% from last month',
                  positive: true,
                  color: 'blue'
                },
                { 
                  title: 'Avg. Revenue per Client', 
                  value: '$2,850', 
                  trend: '+$320 from last month',
                  positive: true,
                  color: 'green'
                },
                { 
                  title: 'Outstanding Invoices', 
                  value: '$34,500', 
                  trend: '-$12,500 from last month',
                  positive: true,
                  color: 'blue' 
                },
                { 
                  title: 'Expense Ratio', 
                  value: '42.6%', 
                  trend: '+0.8% from last month',
                  positive: false,
                  color: 'red'
                },
              ].map((metric, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className={`p-2 rounded-md border-l-2 border-${metric.color}-500 bg-gradient-to-r from-${metric.color}-500/10 to-transparent`}
                >
                  <div className="flex justify-between items-start">
                    <div className="text-xs text-gray-400">{metric.title}</div>
                    <div className="text-sm font-semibold text-white">{metric.value}</div>
                  </div>
                  <div className={`text-[10px] mt-1 flex items-center gap-1 ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.positive ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                      </svg>
                    )}
                    {metric.trend}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-[10px] px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                View Detailed Reports
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Analytics Sections */}
        <div className="grid grid-cols-2 gap-4">
          {/* Top Clients by Revenue */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-gray-400">Top Clients by Revenue</span>
              <div className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">Last 3 Months</div>
            </div>
            
            <div className="space-y-2">
              {[
                { name: 'Acme Corporation', revenue: '$24,500', growth: '+12%', icon: '🏢' },
                { name: 'TechGiant Inc', revenue: '$18,200', growth: '+8%', icon: '💻' },
                { name: 'Global Services Ltd', revenue: '$15,800', growth: '+5%', icon: '🌐' },
                { name: 'Stark Industries', revenue: '$12,400', growth: '+15%', icon: '⚡' },
                { name: 'Wayne Enterprises', revenue: '$10,900', growth: '+3%', icon: '🦇' },
              ].map((client, i) => (
                <motion.div 
                  key={i}
                  className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700/30 transition-colors cursor-pointer"
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: 'rgba(75, 85, 99, 0.3)' 
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-xs">{client.icon}</span>
                    </div>
                    <span className="text-xs font-medium text-white">{client.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-white">{client.revenue}</span>
                    <p className="text-[10px] text-green-400">{client.growth}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Revenue by Category */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-gray-400">Revenue by Service Category</span>
              <div className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">$84,200 total</div>
            </div>
            
            <div className="space-y-3 mt-2">
              {[
                { category: 'Consulting Services', amount: '$32,500', percent: 38.6 },
                { category: 'Software Development', amount: '$24,800', percent: 29.5 },
                { category: 'Maintenance & Support', amount: '$15,400', percent: 18.3 },
                { category: 'Training Services', amount: '$8,200', percent: 9.7 },
                { category: 'Hardware Sales', amount: '$3,300', percent: 3.9 },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-300">{item.category}</span>
                    <span className="text-white font-medium">{item.amount}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 0.7, delay: i * 0.1 }}
                      className="h-full bg-purple-500 rounded-full"
                    ></motion.div>
                  </div>
                  <div className="text-[10px] text-gray-500 text-right mt-0.5">{item.percent}%</div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-3 text-center">
              <button className="text-[10px] px-3 py-1 rounded-full bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors">
                Generate Report PDF
                <svg className="w-3 h-3 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari, Opera */
        }
        
        .sidebar-item:hover {
          background-color: rgba(59, 130, 246, 0.1);
        }
        
        .sidebar-item.active {
          border-left: 2px solid #3b82f6;
          background-color: rgba(59, 130, 246, 0.15);
        }
      `}</style>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full overflow-hidden"
      >
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl overflow-hidden relative">
          {/* Top Bar */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs text-gray-400">fiscalfusion.app/dashboard</div>
          </div>
          
          {/* Dashboard Content */}
          <div className="flex h-[450px]">
            {/* Sidebar */}
            <div className="w-[220px] bg-gray-900 border-r border-gray-800 overflow-y-auto hide-scrollbar">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-bold">F</span>
                  </div>
                  <div className="font-medium text-white">FiscalFusion</div>
                </div>
              </div>
              
              <nav className="p-2">
                {sidebarItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSidebarItemClick(item.id)}
                    className={`sidebar-item w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                      activeSidebarItem === item.id
                        ? 'active text-blue-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              
              <div className="p-3 mt-3">
                <div className="rounded-md bg-blue-500/10 p-3 border border-blue-500/20">
                  <div className="text-xs font-medium text-blue-400 mb-1">Pro Plan</div>
                  <div className="text-xs text-gray-400">
                    Your plan renews on Nov 15, 2023
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-white">Storage: 65% used</div>
                    <div className="h-1.5 w-full bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 bg-gray-900 overflow-y-auto hide-scrollbar relative">
              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-10 backdrop-blur-sm">
                  <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
                </div>
              )}
              
              {renderDashboardContent()}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPreview; 