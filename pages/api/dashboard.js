export default async function handler(req, res) {
  try {
    // Try to get data from backend with improved error handling
    let data;
    
    try {
      // Use a timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); 
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/dashboard`, 
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
    console.error('Dashboard API error:', error.message);
    
    // Fallback to mock data with enhanced structure for the business overview
    const mockCashFlowData = [
      { month: 'Feb', moneyIn: 15000, moneyOut: 10000 },
      { month: 'Mar', moneyIn: 18000, moneyOut: 12000 },
      { month: 'Apr', moneyIn: 17000, moneyOut: 11000 },
      { month: 'May', moneyIn: 19000, moneyOut: 12000 }
    ];
    
    const mockExpensesBreakdown = [
      { category: 'Rent & mortgage', amount: 6500 },
      { category: 'Automotive', amount: 5250 },
      { category: 'Meals & entertainment', amount: 2250 }
    ];
    
    const mockSalesData = [
      { date: 'Mar 2', amount: 1000 },
      { date: 'Mar 10', amount: 1500 },
      { date: 'Mar 18', amount: 1800 },
      { date: 'Mar 25', amount: 2000 },
      { date: 'Mar 31', amount: 3500 }
    ];
    
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
    
    // Calculate summary data from mock
    const totalRevenue = mockInvoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
    
    const totalExpenses = mockExpenses
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    
    const unpaidInvoices = mockInvoices
      .filter(invoice => invoice.status === 'unpaid' || invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
    
    // Generate additional cash flow data
    const mockCashFlowInsights = {
      topIncomeSource: { name: 'Client Services', amount: 8500 },
      topExpense: { name: 'Office Rent', amount: 3200 },
      cashflowTrend: 'increasing'
    };
    
    const mockCashFlowForecast = {
      nextMonth: 18500,
      threeMontAvg: 17500
    };
    
    const mockCashFlowTransactions = generateMockTransactions();
    
    // Helper function to generate transactions
    function generateMockTransactions() {
      const types = ['income', 'expense'];
      const categories = {
        income: ['Client Payment', 'Product Sales', 'Consulting', 'Dividends', 'Royalties'],
        expense: ['Office Rent', 'Utilities', 'Payroll', 'Software Subscriptions', 'Travel', 'Marketing']
      };
      
      const transactions = [];
      for (let i = 0; i < 5; i++) {
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
    
    return res.status(200).json({
      success: true,
      source: 'mock (api fallback)',
      data: {
        // Financial summary data
        totalRevenue,
        totalExpenses,
        netIncome: totalRevenue - totalExpenses,
        unpaidInvoices,
        
        // Lists of invoices and expenses
        latestInvoices: mockInvoices,
        latestExpenses: mockExpenses,
        
        // Business overview specific data
        cashBalance: 16000,
        cashFlowData: mockCashFlowData,
        expensesBreakdown: mockExpensesBreakdown,
        totalIncome: 100000,
        overdueInvoices: 1525.50,
        notDueYetInvoices: 3756.02,
        paidInvoices: 3692.22,
        notDepositedInvoices: 2062.52,
        depositedInvoices: 1629.70,
        totalSales: 3500,
        salesData: mockSalesData,
        checkingBalance: 12435.65,
        checkingInQB: 4987.43,
        mastercardBalance: -3435.65,
        mastercardInQB: 157.72,
        
        // Additional cash flow data for integration
        cashFlowInsights: mockCashFlowInsights,
        cashFlowForecast: mockCashFlowForecast,
        cashFlowTransactions: mockCashFlowTransactions
      }
    });
  }
} 