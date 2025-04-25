import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { jsPDF as JsPDF } from 'jspdf';
import { default as autoTable } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

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
  const [dbStatus, setDbStatus] = useState('unknown');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterType, setFilterType] = useState('preset'); // 'preset' or 'custom'
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Calculate date range based on timeframe
    let startDate, endDate;
    
    // Current date
    const now = new Date();
    endDate = now.toISOString().split('T')[0];
    
    if (filterType === 'preset') {
      if (timeframe === 'month') {
        // First day of current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      } else if (timeframe === 'quarter') {
        // First day of current quarter
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterMonth, 1).toISOString().split('T')[0];
      } else if (timeframe === 'year') {
        // First day of current year
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      } else if (timeframe === 'all_time') {
        // Use a very early date for "all time"
        startDate = "2000-01-01";
      }
    } else {
      // Custom date range
      startDate = customStartDate;
      endDate = customEndDate;
    }
    
    // Fetch data from API with date range
    fetchReportData(startDate, endDate);
  }, [timeframe, filterType, customStartDate, customEndDate, categoryFilter]);

  const fetchReportData = async (startDate, endDate) => {
    try {
      // Build query parameters
      let queryParams = new URLSearchParams();
      
      if (filterType === 'preset') {
        queryParams.append('timeframe', timeframe);
      } else {
        // Custom date range
        queryParams.append('startDate', startDate);
        queryParams.append('endDate', endDate);
      }
      
      // Add category filter if selected - only affects expense data
      if (categoryFilter) {
        queryParams.append('category', categoryFilter);
      }
      
      // Fetch data from API
      const response = await fetch(`/api/reports?${queryParams.toString()}`);
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      // Parse response as JSON
      const responseData = await response.json();
      
      if (responseData && responseData.data) {
        // Preserve previous revenue and client data if category filter is applied
        // This prevents category filters from affecting revenue and client data
        if (categoryFilter && reportData.revenueByMonth?.length > 0 && responseData.data.revenueByMonth?.length === 0) {
          responseData.data.revenueByMonth = reportData.revenueByMonth;
        }
        
        if (categoryFilter && reportData.topClients?.length > 0 && responseData.data.topClients?.length === 0) {
          responseData.data.topClients = reportData.topClients;
        }
        
        setReportData(responseData.data);
        setDbStatus(responseData.database_status || 'unknown');
        
        // Set debug information
        setDebugInfo({
          collectionsFound: responseData.collectionsFound || {},
          fieldsUsed: responseData.fieldsUsed || {},
          dateRange: responseData.dateRange || {},
          dataStats: {
            revenue: responseData.data.revenueByMonth?.length || 0,
            expenses: responseData.data.expensesByCategory?.length || 0,
            profitLoss: responseData.data.profitLoss?.length || 0,
            clients: responseData.data.topClients?.length || 0
          }
        });
        
        // Set available categories for filtering
        if (responseData.data.availableCategories) {
          setAvailableCategories(responseData.data.availableCategories);
        }
        
        // Check if there was an error message
        if (responseData.message) {
          setError(responseData.message);
        } else {
          setError(null);
        }
      } else {
        throw new Error('API returned unexpected data format');
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(`Failed to fetch report data: ${err.message}`);
      // Leave previous data in state if available
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Function to create linear gradient patterns (will be used as placeholders)
  function createGradient(color1, color2) {
    return {
      start: color1,
      end: color2
    };
  }

  // Export to Excel
  const exportToExcel = () => {
    try {
      // Check if we have any data to export
      const hasRevenueData = reportData.revenueByMonth && reportData.revenueByMonth.length > 0;
      const hasExpenseData = reportData.expensesByCategory && reportData.expensesByCategory.length > 0;
      const hasProfitLossData = reportData.profitLoss && reportData.profitLoss.length > 0;
      const hasClientData = reportData.topClients && reportData.topClients.length > 0;
      
      if (!hasRevenueData && !hasExpenseData && !hasProfitLossData && !hasClientData) {
        alert("No data available to export");
        return;
      }
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      let sheetAdded = false;
      
      // Revenue by Month sheet
      if (hasRevenueData) {
        const revenueData = reportData.revenueByMonth.map(item => ({
          Month: item.month,
          Revenue: item.revenue
        }));
        
        if (revenueData.length > 0) {
          const revenueSheet = XLSX.utils.json_to_sheet(revenueData);
          XLSX.utils.book_append_sheet(wb, revenueSheet, "Revenue by Month");
          sheetAdded = true;
        }
      }
      
      // Expenses by Category sheet
      if (hasExpenseData) {
        const expenseData = reportData.expensesByCategory.map(item => ({
          Category: item.category,
          Amount: item.amount
        }));
        
        if (expenseData.length > 0) {
          const expenseSheet = XLSX.utils.json_to_sheet(expenseData);
          XLSX.utils.book_append_sheet(wb, expenseSheet, "Expenses by Category");
          sheetAdded = true;
        }
      }
      
      // Profit/Loss sheet
      if (hasProfitLossData) {
        const plData = reportData.profitLoss.map(item => ({
          Month: item.month,
          Revenue: item.revenue,
          Expenses: item.expenses,
          Profit: item.profit
        }));
        
        if (plData.length > 0) {
          const plSheet = XLSX.utils.json_to_sheet(plData);
          XLSX.utils.book_append_sheet(wb, plSheet, "Profit & Loss");
          sheetAdded = true;
        }
      }
      
      // Top Clients sheet
      if (hasClientData) {
        const clientData = reportData.topClients.map(item => ({
          Client: item.name,
          Revenue: item.revenue
        }));
        
        if (clientData.length > 0) {
          const clientSheet = XLSX.utils.json_to_sheet(clientData);
          XLSX.utils.book_append_sheet(wb, clientSheet, "Top Clients");
          sheetAdded = true;
        }
      }
      
      // If no sheets were added, add an empty sheet
      if (!sheetAdded) {
        const emptySheet = XLSX.utils.json_to_sheet([{Note: "No data available for the selected period"}]);
        XLSX.utils.book_append_sheet(wb, emptySheet, "No Data");
      }
      
      // Create filename
      const timeframeText = filterType === 'preset' ? timeframe : 'custom';
      const filename = `financial_report_${timeframeText}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      
      // Convert workbook to binary string
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
      
      // Convert binary string to array buffer
      function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
          view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
      }
      
      // Create blob and save file using FileSaver
      const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export to Excel. Please try again later.");
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      // Check if we have any data to export
      const hasRevenueData = reportData.revenueByMonth && reportData.revenueByMonth.length > 0;
      const hasExpenseData = reportData.expensesByCategory && reportData.expensesByCategory.length > 0;
      const hasProfitLossData = reportData.profitLoss && reportData.profitLoss.length > 0;
      const hasClientData = reportData.topClients && reportData.topClients.length > 0;
      
      if (!hasRevenueData && !hasExpenseData && !hasProfitLossData && !hasClientData) {
        alert("No data available to export");
        return;
      }
      
      // Create new jsPDF instance
      const doc = new JsPDF();
      
      // Set report title
      const dateRange = filterType === 'preset' 
        ? `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}ly Report` 
        : `Custom Report (${startDate} to ${endDate})`;
      
      doc.setFontSize(18);
      doc.text('Financial Report', 14, 20);
      
      doc.setFontSize(12);
      doc.text(dateRange, 14, 30);
      
      let currentY = 45;
      
      // Add revenue by month table
      if (hasRevenueData) {
        doc.setFontSize(14);
        doc.text('Revenue by Month', 14, currentY);
        
        const revenueData = reportData.revenueByMonth.map(item => [
          item.month,
          formatCurrency(item.revenue)
        ]);
        
        autoTable(doc, {
          startY: currentY + 5,
          head: [['Month', 'Revenue']],
          body: revenueData,
        });
        
        currentY = doc.lastAutoTable.finalY + 15;
      }
      
      // Add expenses by category table
      if (hasExpenseData) {
        // Check if we need a new page
        if (currentY > 210) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.setFontSize(14);
        doc.text('Expenses by Category', 14, currentY);
        
        const expenseData = reportData.expensesByCategory.map(item => [
          item.category,
          formatCurrency(item.amount)
        ]);
        
        autoTable(doc, {
          startY: currentY + 5,
          head: [['Category', 'Amount']],
          body: expenseData,
        });
        
        currentY = doc.lastAutoTable.finalY + 15;
      }
      
      // Add profit/loss table
      if (hasProfitLossData) {
        // Check if we need a new page
        if (currentY > 180) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.setFontSize(14);
        doc.text('Profit & Loss Statement', 14, currentY);
        
        const plData = reportData.profitLoss.map(item => [
          item.month,
          formatCurrency(item.revenue),
          formatCurrency(item.expenses),
          formatCurrency(item.profit)
        ]);
        
        autoTable(doc, {
          startY: currentY + 5,
          head: [['Month', 'Revenue', 'Expenses', 'Profit']],
          body: plData,
        });
        
        currentY = doc.lastAutoTable.finalY + 15;
      }
      
      // Add top clients table
      if (hasClientData) {
        // Check if we need a new page
        if (currentY > 210) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.setFontSize(14);
        doc.text('Top Clients by Revenue', 14, currentY);
        
        const clientData = reportData.topClients.map(item => [
          item.name,
          formatCurrency(item.revenue)
        ]);
        
        autoTable(doc, {
          startY: currentY + 5,
          head: [['Client', 'Revenue']],
          body: clientData,
        });
      }
      
      // If no data was added, add a message
      if (!hasRevenueData && !hasExpenseData && !hasProfitLossData && !hasClientData) {
        doc.setFontSize(12);
        doc.text('No data available for the selected period', 14, 45);
      }
      
      // Create filename and save
      const timeframeText = filterType === 'preset' ? timeframe : 'custom';
      const filename = `financial_report_${timeframeText}_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      try {
        // First try the standard save method
        doc.save(filename);
      } catch (saveError) {
        console.error("Error with standard PDF save:", saveError);
        
        try {
          // Fallback to using Blob and FileSaver
          const pdfBlob = doc.output('blob');
          saveAs(pdfBlob, filename);
        } catch (blobError) {
          console.error("Error with blob PDF save:", blobError);
          
          // Last resort - open in a new window
          window.open(URL.createObjectURL(
            new Blob([doc.output('blob')], { type: 'application/pdf' })
          ));
        }
      }
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export to PDF. Please try again later.");
    }
  };

  // Simple bar chart component
  const BarChart = ({ data = [], valueKey, labelKey, title, color = 'blue' }) => {
    // Make sure data is an array and contains valid entries
    const safeData = Array.isArray(data) 
      ? data.filter(item => item && typeof item[valueKey] === 'number' && !isNaN(item[valueKey]))
      : [];
    
    // Safely calculate maxValue
    const maxValue = safeData.length > 0 
      ? Math.max(...safeData.map(item => (item && item[valueKey]) || 0))
      : 1; // Use 1 as minimum to avoid division by zero
    
    // Map color names to Tailwind classes
    const colorMap = {
      'blue': 'bg-blue-600',
      'green': 'bg-green-600',
      'red': 'bg-red-600',
      'yellow': 'bg-yellow-500',
      'purple': 'bg-purple-600'
    };
    
    const barColor = colorMap[color] || 'bg-blue-600';
    
    // Function to truncate text
    const truncateText = (text, maxLength = 20) => {
      if (!text) return "Unknown";
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>
        {safeData.length > 0 ? (
          <div className="space-y-4">
            {safeData.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex items-center">
                  <div className="w-32 text-sm text-gray-300 truncate" title={item[labelKey] || "Unknown"}>
                    {truncateText(item[labelKey])}
                  </div>
                  <div className="flex-grow">
                    <div className="relative h-8">
                      <div 
                        className={`h-8 ${barColor} rounded-r-sm`}
                        style={{ width: `${Math.max(1, (item[valueKey] / maxValue) * 100)}%` }}
                      >
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-sm font-medium">
                          {formatCurrency(item[valueKey] || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-900/50 rounded text-center text-gray-400">
            No data available
          </div>
        )}
      </div>
    );
  };

  // Pie chart component with hover effects
  const PieChart = ({ data = [], valueKey, labelKey, title, colors = [] }) => {
    // Make sure data is an array and contains valid entries
    const safeData = Array.isArray(data) 
      ? data.filter(item => item && typeof item[valueKey] === 'number' && !isNaN(item[valueKey]))
      : [];
    
    // Modern color palette as simple strings that can be used by Chart.js
    const defaultColors = [
      'rgba(56, 189, 248, 0.9)',
      'rgba(251, 113, 133, 0.9)',
      'rgba(74, 222, 128, 0.9)',
      'rgba(250, 204, 21, 0.9)',
      'rgba(168, 85, 247, 0.9)',
      'rgba(248, 113, 113, 0.9)',
      'rgba(45, 212, 191, 0.9)',
      'rgba(251, 146, 60, 0.9)',
    ];
    
    // Store gradient definitions separately for use in useEffect
    const gradientDefinitions = [
      { start: 'rgba(56, 189, 248, 0.9)', end: 'rgba(59, 130, 246, 0.9)' },
      { start: 'rgba(251, 113, 133, 0.9)', end: 'rgba(244, 63, 94, 0.9)' },
      { start: 'rgba(74, 222, 128, 0.9)', end: 'rgba(34, 197, 94, 0.9)' },
      { start: 'rgba(250, 204, 21, 0.9)', end: 'rgba(234, 179, 8, 0.9)' },
      { start: 'rgba(168, 85, 247, 0.9)', end: 'rgba(126, 34, 206, 0.9)' },
      { start: 'rgba(248, 113, 113, 0.9)', end: 'rgba(220, 38, 38, 0.9)' },
      { start: 'rgba(45, 212, 191, 0.9)', end: 'rgba(20, 184, 166, 0.9)' },
      { start: 'rgba(251, 146, 60, 0.9)', end: 'rgba(234, 88, 12, 0.9)' },
    ];
    
    // Convert any custom gradient colors to simple strings for initial render
    const initialColors = colors.length > 0
      ? colors.map(color => typeof color === 'object' && color.start ? color.start : color)
      : defaultColors;
    
    // Hover colors with increased brightness
    const hoverColors = initialColors.map(color => 
      color.replace(/[\d.]+\)$/, '1)')
    );
    
    // Format the data for Chart.js
    const chartData = {
      labels: safeData.map(item => item[labelKey]),
      datasets: [
        {
          data: safeData.map(item => item[valueKey]),
          backgroundColor: initialColors,
          hoverBackgroundColor: hoverColors,
          borderWidth: 2,
          borderColor: '#1e293b',
          hoverBorderWidth: 0,
          borderRadius: 5,
          spacing: 5,
          offset: 10,
        },
      ],
    };
    
    // Chart options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%', // Make it a donut chart for modern look
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: 'rgba(255, 255, 255, 0.9)',
            padding: 15,
            usePointStyle: true, // Use circle style instead of rectangle
            pointStyleWidth: 10,
            font: {
              size: 12,
              weight: '500'
            },
            generateLabels: (chart) => {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                  const formattedValue = formatCurrency(value);
                  return {
                    text: `${label} (${percentage}% - ${formattedValue})`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i,
                    strokeStyle: '#1e293b',
                    lineWidth: 1
                  };
                });
              }
              return [];
            }
          },
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 12
          },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 5,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: '#1e293b',
          hoverBorderColor: '#fff'
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
        easing: 'easeOutQuart'
      }
    };
    
    // Have a useEffect to create actual canvas gradients after component mount
    const chartRef = React.useRef(null);
    
    React.useEffect(() => {
      const chart = chartRef.current;
      
      if (chart && chart.ctx && chart.chartArea && 
          chart.chartArea.width > 0 && chart.chartArea.height > 0) {
        
        // Get the current gradient definitions (either from props or defaults)
        const gradients = colors.length > 0
          ? colors.map(color => {
              if (typeof color === 'object' && color.start && color.end) {
                return color;
              }
              // If a simple color was passed, create a matching gradient
              return { start: color, end: color };
            })
          : gradientDefinitions;
        
        // Create and apply gradients
        try {
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;
          
          // Replace the backgroundColor with actual gradients
          const backgroundColors = chart.data.datasets[0].data.map((value, i) => {
            const idx = i % gradients.length;
            const gradient = gradients[idx];
            
            try {
              const canvasGradient = ctx.createLinearGradient(
                chartArea.left, chartArea.bottom,
                chartArea.right, chartArea.top
              );
              canvasGradient.addColorStop(0, gradient.start);
              canvasGradient.addColorStop(1, gradient.end || gradient.start);
              return canvasGradient;
            } catch (e) {
              console.error('Error creating gradient:', e);
              return initialColors[idx % initialColors.length]; // Fallback to solid color
            }
          });
          
          chart.data.datasets[0].backgroundColor = backgroundColors;
          chart.update('none'); // Update without animation to prevent flicker
        } catch (err) {
          console.error('Error applying gradients:', err);
        }
      }
    }, [chartRef.current, safeData, colors]);
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>
        {safeData.length > 0 ? (
          <div className="h-80 relative p-2 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 shadow-lg" 
               style={{ 
                 boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
               }}>
            <Pie 
              data={chartData} 
              options={options} 
              ref={chartRef}
            />
          </div>
        ) : (
          <div className="p-4 bg-slate-900/50 rounded text-center text-gray-400">
            No data available
          </div>
        )}
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
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Financial Reports</h1>
            <p className="text-gray-400">View and analyze your financial performance</p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm flex items-center"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Excel
            </button>
            
            <button 
              onClick={exportToPDF}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm flex items-center"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-3">
            <h2 className="text-white font-medium">Filter Reports</h2>
            <div className="flex ml-4">
              <button 
                onClick={() => setFilterType('preset')}
                className={`px-3 py-1 text-xs rounded-l-md ${filterType === 'preset' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Preset Periods
              </button>
              <button 
                onClick={() => setFilterType('custom')}
                className={`px-3 py-1 text-xs rounded-r-md ${filterType === 'custom' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Custom Range
              </button>
            </div>
          </div>
          
          {filterType === 'preset' ? (
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeframe('month')}
                className={`px-4 py-2 rounded-md text-sm ${timeframe === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setTimeframe('quarter')}
                className={`px-4 py-2 rounded-md text-sm ${timeframe === 'quarter' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Quarterly
              </button>
              <button 
                onClick={() => setTimeframe('year')}
                className={`px-4 py-2 rounded-md text-sm ${timeframe === 'year' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Yearly
              </button>
              <button 
                onClick={() => setTimeframe('all_time')}
                className={`px-4 py-2 rounded-md text-sm ${timeframe === 'all_time' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                All Time
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap space-x-3 items-center">
              <div className="flex items-center">
                <label className="text-sm text-gray-400 mr-2">Start Date:</label>
                <input 
                  type="date" 
                  value={customStartDate} 
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                />
              </div>
              
              <div className="flex items-center">
                <label className="text-sm text-gray-400 mr-2">End Date:</label>
                <input 
                  type="date" 
                  value={customEndDate} 
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          )}
          
          {/* Category filter */}
          {availableCategories.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center">
                <label className="text-sm text-gray-400 mr-2">Category Filter:</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm flex-grow max-w-xs"
                >
                  <option value="">All Categories</option>
                  {availableCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                
                {categoryFilter && (
                  <button
                    onClick={() => setCategoryFilter('')}
                    className="ml-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-yellow-500">{error}</p>
            {dbStatus !== 'connected' && (
              <p className="text-gray-400 text-sm mt-1">
                Database status: {dbStatus}
              </p>
            )}
          </div>
        )}
        
        {/* Debug Information Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded"
          >
            {showDebugInfo ? 'Hide' : 'Show'} Database Debug Info
          </button>
          
          {showDebugInfo && debugInfo && (
            <div className="mt-2 p-4 bg-slate-800 rounded-lg border border-gray-700">
              <h3 className="text-sm font-semibold text-white mb-2">Database Debug Information</h3>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="text-gray-400 mb-1">Collections Found:</h4>
                  <ul className="space-y-1">
                    {Object.entries(debugInfo.collectionsFound || {}).map(([key, value]) => (
                      <li key={key} className={value ? "text-green-400" : "text-red-400"}>
                        {key}: {value ? "✓" : "✗"}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-gray-400 mb-1">Fields Used:</h4>
                  <ul className="space-y-1">
                    {Object.entries(debugInfo.fieldsUsed || {}).map(([key, value]) => (
                      <li key={key} className="text-gray-300">
                        {key}: <span className="text-blue-400">{value || "N/A"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-gray-400 mb-1">Date Range:</h4>
                  <p className="text-gray-300">
                    Start: <span className="text-blue-400">{debugInfo.dateRange?.start || "N/A"}</span>
                  </p>
                  <p className="text-gray-300">
                    End: <span className="text-blue-400">{debugInfo.dateRange?.end || "N/A"}</span>
                  </p>
                </div>
                
                <div>
                  <h4 className="text-gray-400 mb-1">Data Statistics:</h4>
                  <ul className="space-y-1">
                    {Object.entries(debugInfo.dataStats || {}).map(([key, value]) => (
                      <li key={key} className={value > 0 ? "text-green-400" : "text-red-400"}>
                        {key}: {value} records
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400">Loading financial reports...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Overview */}
            <div className="bg-slate-800 rounded-lg p-5 shadow-md">
              <h2 className="text-xl font-semibold text-white mb-4">Revenue Overview</h2>
              {reportData.revenueByMonth && reportData.revenueByMonth.length > 0 ? (
                <>
                  {reportData.usingSampleData && (
                    <div className="mb-4 p-2 bg-yellow-500/10 border-l-4 border-yellow-500 text-yellow-500 text-sm">
                      <p>Note: Showing sample data for demonstration purposes.</p>
                    </div>
                  )}
                  <PieChart 
                    data={reportData.revenueByMonth} 
                    valueKey="revenue" 
                    labelKey="month" 
                    title="Monthly Revenue" 
                    colors={[
                      'rgba(56, 189, 248, 0.9)',
                      'rgba(96, 165, 250, 0.9)', 
                      'rgba(129, 140, 248, 0.9)', 
                      'rgba(139, 92, 246, 0.9)', 
                      'rgba(167, 139, 250, 0.9)',
                      'rgba(147, 197, 253, 0.9)'
                    ]} 
                  />
                </>
              ) : (
                <div className="p-8 text-center text-gray-400 bg-slate-900/30 rounded">
                  <p>No revenue data available for the selected period.</p>
                  <p className="mt-2 text-sm">
                    {dbStatus === 'connected' ? 
                      "Try selecting a different time period or check your transaction data." :
                      "Database connection issue. Please try again later."}
                  </p>
                  {/* Debug info for developer */}
                  {showDebugInfo && (
                    <div className="mt-4 text-left text-xs text-gray-500 border-t border-gray-700 pt-4">
                      <p>Debug Info:</p>
                      <p>Time Frame: {timeframe}</p>
                      <p>Collections: {Object.entries(debugInfo.collectionsFound || {})
                          .filter(([k, v]) => v)
                          .map(([k]) => k)
                          .join(', ') || 'None'}</p>
                      <p>Date Field: {debugInfo.fieldsUsed?.date || 'Unknown'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Expense Breakdown */}
            <div className="bg-slate-800 rounded-lg p-5 shadow-md">
              <h2 className="text-xl font-semibold text-white mb-4">Expense Breakdown</h2>
              {reportData.expensesByCategory && reportData.expensesByCategory.length > 0 ? (
                <PieChart 
                  data={reportData.expensesByCategory} 
                  valueKey="amount" 
                  labelKey="category" 
                  title="Expenses by Category" 
                  colors={[
                    'rgba(239, 68, 68, 0.9)',
                    'rgba(248, 113, 113, 0.9)',
                    'rgba(252, 165, 165, 0.9)',
                    'rgba(254, 202, 202, 0.9)',
                    'rgba(254, 226, 226, 0.9)',
                    'rgba(220, 38, 38, 0.9)'
                  ]} 
                />
              ) : (
                <div className="p-8 text-center text-gray-400 bg-slate-900/30 rounded">
                  <p>No expense data available for the selected period.</p>
                </div>
              )}
            </div>
            
            {/* Profit/Loss Analysis */}
            <div className="bg-slate-800 rounded-lg p-5 shadow-md">
              <h2 className="text-xl font-semibold text-white mb-4">Profit/Loss Analysis</h2>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-3 text-white">Monthly Profit/Loss</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="pb-2 text-sm font-medium text-gray-400">Month</th>
                        <th className="pb-2 text-sm font-medium text-gray-400">Revenue</th>
                        <th className="pb-2 text-sm font-medium text-gray-400">Expenses</th>
                        <th className="pb-2 text-sm font-medium text-gray-400">Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.profitLoss && reportData.profitLoss.length > 0 ? (
                        reportData.profitLoss.map((item, index) => (
                          <tr key={index} className="border-b border-gray-700/50">
                            <td className="py-3 text-gray-300">{item.month}</td>
                            <td className="py-3 text-blue-400">{formatCurrency(item.revenue || 0)}</td>
                            <td className="py-3 text-red-400">{formatCurrency(item.expenses || 0)}</td>
                            <td className={`py-3 ${(item.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatCurrency(item.profit || 0)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-3 text-center text-gray-400">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Top Clients */}
            <div className="bg-slate-800 rounded-lg p-5 shadow-md">
              <h2 className="text-xl font-semibold text-white mb-4">Top Clients</h2>
              {reportData.topClients && reportData.topClients.length > 0 && reportData.topClients[0].revenue > 0 ? (
                <>
                  <PieChart 
                    data={reportData.topClients} 
                    valueKey="revenue" 
                    labelKey="name" 
                    title="Revenue by Client" 
                    colors={[
                      'rgba(16, 185, 129, 0.9)',
                      'rgba(52, 211, 153, 0.9)',
                      'rgba(110, 231, 183, 0.9)',
                      'rgba(167, 243, 208, 0.9)',
                      'rgba(209, 250, 229, 0.9)'
                    ]} 
                  />
                  
                  {/* Detailed client table */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 text-white">Top Performing Clients</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-2 text-sm font-medium text-gray-400">Client</th>
                            <th className="pb-2 text-sm font-medium text-gray-400 text-right">Revenue</th>
                            {reportData.topClients[0].invoiceCount !== undefined && (
                              <th className="pb-2 text-sm font-medium text-gray-400 text-right">Invoices</th>
                            )}
                            {reportData.topClients[0].transactionCount !== undefined && (
                              <th className="pb-2 text-sm font-medium text-gray-400 text-right">Transactions</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.topClients.map((client, index) => (
                            <tr key={index} className="border-b border-gray-700/50">
                              <td className="py-3 text-gray-300">{client.name}</td>
                              <td className="py-3 text-green-400 text-right">{formatCurrency(client.revenue)}</td>
                              {client.invoiceCount !== undefined && (
                                <td className="py-3 text-gray-300 text-right">{client.invoiceCount}</td>
                              )}
                              {client.transactionCount !== undefined && (
                                <td className="py-3 text-gray-300 text-right">{client.transactionCount}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-400 bg-slate-900/30 rounded">
                  <p>No client revenue data available for the selected period.</p>
                  <p className="mt-2 text-sm">Try selecting a different time period or check your invoice data.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 