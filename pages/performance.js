import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

// Mock data for performance metrics
const mockPerformanceData = {
  revenueGrowth: {
    current: 24.5,
    previous: 18.2,
    trend: 'up',
  },
  profitMargin: {
    current: 32.7,
    previous: 30.5,
    trend: 'up',
  },
  customerAcquisition: {
    current: 45,
    previous: 38,
    trend: 'up',
  },
  averageOrderValue: {
    current: 1850,
    previous: 1720,
    trend: 'up',
  },
  monthlyData: [
    { month: 'Jan', revenue: 28500, expenses: 18400, profit: 10100 },
    { month: 'Feb', revenue: 31200, expenses: 19500, profit: 11700 },
    { month: 'Mar', revenue: 34800, expenses: 21300, profit: 13500 },
    { month: 'Apr', revenue: 38700, expenses: 22800, profit: 15900 },
    { month: 'May', revenue: 42100, expenses: 24600, profit: 17500 },
    { month: 'Jun', revenue: 46500, expenses: 26100, profit: 20400 },
  ]
};

export default function PerformancePage() {
  const [performanceData, setPerformanceData] = useState(mockPerformanceData);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6m');
  const [loading, setLoading] = useState(false);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Performance metric card component
  const MetricCard = ({ title, value, change, trend }) => {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
        <div className="flex items-end">
          <p className="text-2xl font-bold text-white">
            {title.includes('Margin') || title.includes('Growth') ? `${value}%` : value}
          </p>
          {change && (
            <p className={`ml-2 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
              {trend === 'up' ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Performance Center - FiscalFusion</title>
        <meta name="description" content="Monitor and analyze your business performance metrics" />
      </Head>
      
      <div id="performance-page" className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Performance Center</h1>
          <p className="text-gray-400">Monitor key metrics and business analytics</p>
        </div>
        
        {/* Time range selector */}
        <div className="flex space-x-2 mb-8">
          {['1m', '3m', '6m', '1y', 'All'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-md text-sm ${
                selectedTimeframe === timeframe
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
        
        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Revenue Growth"
            value={performanceData.revenueGrowth.current}
            change={performanceData.revenueGrowth.current - performanceData.revenueGrowth.previous}
            trend={performanceData.revenueGrowth.trend}
          />
          <MetricCard
            title="Profit Margin"
            value={performanceData.profitMargin.current}
            change={performanceData.profitMargin.current - performanceData.profitMargin.previous}
            trend={performanceData.profitMargin.trend}
          />
          <MetricCard
            title="New Customers"
            value={performanceData.customerAcquisition.current}
            change={(performanceData.customerAcquisition.current / performanceData.customerAcquisition.previous - 1) * 100}
            trend={performanceData.customerAcquisition.trend}
          />
          <MetricCard
            title="Avg. Order Value"
            value={formatCurrency(performanceData.averageOrderValue.current)}
            change={(performanceData.averageOrderValue.current / performanceData.averageOrderValue.previous - 1) * 100}
            trend={performanceData.averageOrderValue.trend}
          />
        </div>
        
        {/* Revenue & Expenses chart */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Revenue & Expenses</h2>
          
          <div className="relative h-64">
            {/* Chart placeholder - in a real app, use a chart library */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-4 w-full">
                {performanceData.monthlyData.map((month) => (
                  <div key={month.month} className="flex items-center space-x-2">
                    <div className="w-8 text-gray-400 text-sm">{month.month}</div>
                    <div className="flex-1 h-8 bg-gray-800 rounded-md overflow-hidden flex">
                      <div 
                        className="bg-blue-600 h-full" 
                        style={{ width: `${(month.revenue / 50000) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-right text-white text-sm">{formatCurrency(month.revenue)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Expenses</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Profit</span>
            </div>
          </div>
        </div>
        
        {/* Performance by category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Top Performing Products</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">P</div>
                  <span className="ml-3 text-white">Product A</span>
                </div>
                <span className="text-green-500">+24.8%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center text-white font-bold">P</div>
                  <span className="ml-3 text-white">Product B</span>
                </div>
                <span className="text-green-500">+18.3%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center text-white font-bold">P</div>
                  <span className="ml-3 text-white">Product C</span>
                </div>
                <span className="text-green-500">+15.7%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Highest Revenue Clients</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center text-white font-bold">A</div>
                  <span className="ml-3 text-white">Acme Corp</span>
                </div>
                <span className="text-white">{formatCurrency(28500)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center text-white font-bold">G</div>
                  <span className="ml-3 text-white">Globex Industries</span>
                </div>
                <span className="text-white">{formatCurrency(21300)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">W</div>
                  <span className="ml-3 text-white">Wayne Enterprises</span>
                </div>
                <span className="text-white">{formatCurrency(19700)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 