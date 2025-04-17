export default async function handler(req, res) {
  const { timeframe = 'month' } = req.query;
  
  try {
    // Try to get data from backend with improved error handling
    let data;
    
    try {
      // Use a timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); 
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/cashflow?timeframe=${timeframe}`, 
        { 
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        }
      );
      
      clearTimeout(timeoutId);
      
      // First check if response is ok
      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }
      
      // Check if response is JSON before trying to parse
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend did not return valid JSON');
      }
      
      data = await response.json();
    } catch (backendError) {
      console.error('Backend connection error:', backendError.message);
      throw new Error(`Backend connection failed: ${backendError.message}`);
    }

    // Pass through the backend response
    return res.status(200).json(data);
  } catch (error) {
    console.error('Cash Flow API error:', error.message);
    
    // Generate mock data based on timeframe
    const mockData = generateMockData(timeframe);
    
    return res.status(200).json({
      success: true,
      source: 'mock (api fallback)',
      data: mockData
    });
  }
}

// Helper function to generate mock data
function generateMockData(timeframe) {
  // Generate monthly data based on timeframe
  const getMonthlyData = () => {
    let months;
    
    switch(timeframe) {
      case 'week':
        // If timeframe is week, show daily data for the past week
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
          month: day,
          moneyIn: Math.floor(Math.random() * 3000) + 2000,
          moneyOut: Math.floor(Math.random() * 2000) + 1500,
        })).map(item => ({
          ...item,
          netCashFlow: item.moneyIn - item.moneyOut
        }));
      
      case 'quarter':
        // For quarter, show past 3 months + current month
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        return months.slice(Math.max(0, currentMonth - 2), currentMonth + 2).map(month => ({
          month,
          moneyIn: Math.floor(Math.random() * 25000) + 30000,
          moneyOut: Math.floor(Math.random() * 20000) + 25000,
        })).map(item => ({
          ...item,
          netCashFlow: item.moneyIn - item.moneyOut
        }));
      
      case 'year':
        // For year, show all months
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => ({
          month,
          moneyIn: Math.floor(Math.random() * 30000) + 50000,
          moneyOut: Math.floor(Math.random() * 25000) + 40000,
        })).map(item => ({
          ...item,
          netCashFlow: item.moneyIn - item.moneyOut
        }));
      
      case 'month':
      default:
        // Default - show weekly data for current month
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(week => ({
          month: week,
          moneyIn: Math.floor(Math.random() * 15000) + 10000,
          moneyOut: Math.floor(Math.random() * 10000) + 8000,
        })).map(item => ({
          ...item,
          netCashFlow: item.moneyIn - item.moneyOut
        }));
    }
  };
  
  // Generate transactions
  const generateTransactions = () => {
    const types = ['income', 'expense'];
    const categories = {
      income: ['Client Payment', 'Product Sales', 'Consulting', 'Dividends', 'Royalties'],
      expense: ['Office Rent', 'Utilities', 'Payroll', 'Software Subscriptions', 'Travel', 'Marketing']
    };
    
    const transactions = [];
    // Number of transactions depends on timeframe
    const count = timeframe === 'week' ? 7 : 
                  timeframe === 'month' ? 15 : 
                  timeframe === 'quarter' ? 25 : 30;
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const category = categories[type][Math.floor(Math.random() * categories[type].length)];
      
      // Amount depends on type and timeframe multiplier
      const multiplier = timeframe === 'week' ? 1 : 
                          timeframe === 'month' ? 2 : 
                          timeframe === 'quarter' ? 3 : 4;
      
      const amount = type === 'income' 
        ? Math.floor(Math.random() * 5000 * multiplier) + (1000 * multiplier)
        : -(Math.floor(Math.random() * 3000 * multiplier) + (500 * multiplier));
      
      // Date range depends on timeframe
      const date = new Date();
      const maxDaysBack = timeframe === 'week' ? 7 : 
                          timeframe === 'month' ? 30 : 
                          timeframe === 'quarter' ? 90 : 365;
      
      date.setDate(date.getDate() - Math.floor(Math.random() * maxDaysBack));
      
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
  };
  
  // Calculate forecasts
  const calculateForecasts = (monthlyData) => {
    // Calculate next month forecast based on average growth
    const sumCurrentData = monthlyData.reduce((sum, item) => sum + item.netCashFlow, 0);
    
    // Add some random variation
    const nextMonthVariation = Math.random() * 0.2 - 0.1; // -10% to +10%
    const nextMonth = Math.round(sumCurrentData * (1 + nextMonthVariation));
    
    // 3-month average with some random variation
    const threeMonthVariation = Math.random() * 0.15 - 0.05; // -5% to +10%
    const threeMontAvg = Math.round(sumCurrentData * (1 + threeMonthVariation));
    
    return {
      nextMonth,
      threeMontAvg
    };
  };
  
  // Generate insights
  const generateInsights = (transactions) => {
    // Group transactions by category
    const incomeByCategory = {};
    const expensesByCategory = {};
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        incomeByCategory[transaction.category] = (incomeByCategory[transaction.category] || 0) + transaction.amount;
      } else {
        expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + Math.abs(transaction.amount);
      }
    });
    
    // Find top income source
    let topIncomeSource = { name: 'Unknown', amount: 0 };
    Object.entries(incomeByCategory).forEach(([category, amount]) => {
      if (amount > topIncomeSource.amount) {
        topIncomeSource = { name: category, amount };
      }
    });
    
    // Find top expense
    let topExpense = { name: 'Unknown', amount: 0 };
    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      if (amount > topExpense.amount) {
        topExpense = { name: category, amount };
      }
    });
    
    // Determine cash flow trend
    const cashflowTrend = Math.random() > 0.3 ? 'increasing' : 'decreasing';
    
    return {
      topIncomeSource,
      topExpense,
      cashflowTrend
    };
  };
  
  // Generate monthly data
  const monthlyData = getMonthlyData();
  
  // Generate transactions
  const transactions = generateTransactions();
  
  // Calculate total income and expense
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Calculate cash balance
  const balance = 16000 + (totalIncome - totalExpense);
  
  // Generate forecasts
  const forecast = calculateForecasts(monthlyData);
  
  // Generate insights
  const insights = generateInsights(transactions);
  
  return {
    balance,
    monthlyData,
    transactions,
    forecast,
    insights,
    totalIncome,
    totalExpense
  };
} 