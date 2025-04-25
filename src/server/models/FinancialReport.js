/**
 * FinancialReport model - MongoDB implementation
 */
const mongodb = require('../database/mongodb-config');

class FinancialReport {
  // Generate a balance sheet report
  static async generateBalanceSheet(date = new Date()) {
    try {
      const db = await mongodb.getDb();
      
      // Assets - aggregate data from invoices (receivables) and any asset records
      const assetsCollection = db.collection('assets');
      const invoicesCollection = db.collection('invoices');
      
      // Get paid receivables (assets)
      const receivablesResult = await invoicesCollection.aggregate([
        { $match: { status: { $ne: 'paid' }, due_date: { $lte: new Date(date) } } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
      ]).toArray();
      
      // Get other assets
      const assetsResult = await assetsCollection.aggregate([
        { $match: { date: { $lte: new Date(date) } } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
      ]).toArray();
      
      // Liabilities - aggregate from expenses and other liabilities
      const liabilitiesCollection = db.collection('liabilities');
      const expensesCollection = db.collection('expenses');
      
      // Get unpaid expenses (liabilities)
      const unpaidExpensesResult = await expensesCollection.aggregate([
        { $match: { paid: false, date: { $lte: new Date(date) } } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
      ]).toArray();
      
      // Get other liabilities
      const liabilitiesResult = await liabilitiesCollection.aggregate([
        { $match: { date: { $lte: new Date(date) } } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
      ]).toArray();
      
      // Calculate totals
      const receivables = receivablesResult.length > 0 ? receivablesResult[0].total : 0;
      const assets = assetsResult.length > 0 ? assetsResult[0].total : 0;
      const unpaidExpenses = unpaidExpensesResult.length > 0 ? unpaidExpensesResult[0].total : 0;
      const liabilities = liabilitiesResult.length > 0 ? liabilitiesResult[0].total : 0;
      
      const totalAssets = receivables + assets;
      const totalLiabilities = unpaidExpenses + liabilities;
      const equity = totalAssets - totalLiabilities;
      
      return {
        date,
        assets: totalAssets,
        liabilities: totalLiabilities,
        equity,
        details: {
          assets: await this.getAssetDetails(date),
          liabilities: await this.getLiabilityDetails(date)
        }
      };
    } catch (error) {
      console.error('Error generating balance sheet:', error);
      throw error;
    }
  }

  // Get detailed asset breakdown
  static async getAssetDetails(date) {
    try {
      const db = await mongodb.getDb();
      const assetsCollection = db.collection('assets');
      
      const result = await assetsCollection.aggregate([
        { $match: { date: { $lte: new Date(date) } } },
        { $group: { 
            _id: "$category", 
            total: { $sum: { $toDouble: "$amount" } } 
          }
        },
        { $project: { _id: 0, category: "$_id", total: 1 } },
        { $sort: { total: -1 } }
      ]).toArray();
      
      return result;
    } catch (error) {
      console.error('Error getting asset details:', error);
      throw error;
    }
  }

  // Get detailed liability breakdown
  static async getLiabilityDetails(date) {
    try {
      const db = await mongodb.getDb();
      const liabilitiesCollection = db.collection('liabilities');
      
      const result = await liabilitiesCollection.aggregate([
        { $match: { date: { $lte: new Date(date) } } },
        { $group: { 
            _id: "$category", 
            total: { $sum: { $toDouble: "$amount" } } 
          }
        },
        { $project: { _id: 0, category: "$_id", total: 1 } },
        { $sort: { total: -1 } }
      ]).toArray();
      
      return result;
    } catch (error) {
      console.error('Error getting liability details:', error);
      throw error;
    }
  }

  // Generate an income statement (profit & loss)
  static async generateIncomeStatement(startDate, endDate) {
    try {
      const db = await mongodb.getDb();
      const invoicesCollection = db.collection('invoices');
      const expensesCollection = db.collection('expenses');
      
      // Convert string dates to Date objects if needed
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Revenue
      const revenueResult = await invoicesCollection.aggregate([
        { $match: { 
            status: 'paid', 
            payment_date: { 
              $gte: start, 
              $lte: end 
            } 
          } 
        },
        { $group: { 
            _id: null, 
            total: { $sum: { $toDouble: "$amount" } } 
          } 
        }
      ]).toArray();
      
      // Expenses
      const expenseResult = await expensesCollection.aggregate([
        { $match: { 
            date: { 
              $gte: start, 
              $lte: end 
            } 
          } 
        },
        { $group: { 
            _id: null, 
            total: { $sum: { $toDouble: "$amount" } } 
          } 
        }
      ]).toArray();
      
      const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
      const expenses = expenseResult.length > 0 ? expenseResult[0].total : 0;
      const netIncome = revenue - expenses;
      
      return {
        startDate,
        endDate,
        revenue,
        expenses,
        netIncome,
        details: {
          revenue: await this.getRevenueDetails(startDate, endDate),
          expenses: await this.getExpenseDetails(startDate, endDate)
        }
      };
    } catch (error) {
      console.error('Error generating income statement:', error);
      throw error;
    }
  }

  // Get detailed revenue breakdown
  static async getRevenueDetails(startDate, endDate) {
    try {
      const db = await mongodb.getDb();
      const invoicesCollection = db.collection('invoices');
      
      // Convert string dates to Date objects if needed
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const result = await invoicesCollection.aggregate([
        { $match: { 
            status: 'paid', 
            payment_date: { 
              $gte: start, 
              $lte: end 
            } 
          } 
        },
        { $group: { 
            _id: "$client_name", 
            total: { $sum: { $toDouble: "$amount" } } 
          } 
        },
        { $project: { 
            _id: 0, 
            client_name: "$_id", 
            total: 1 
          } 
        },
        { $sort: { total: -1 } }
      ]).toArray();
      
      return result;
    } catch (error) {
      console.error('Error getting revenue details:', error);
      throw error;
    }
  }

  // Get detailed expense breakdown
  static async getExpenseDetails(startDate, endDate) {
    try {
      const db = await mongodb.getDb();
      const expensesCollection = db.collection('expenses');
      
      // Convert string dates to Date objects if needed
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const result = await expensesCollection.aggregate([
        { $match: { 
            date: { 
              $gte: start, 
              $lte: end 
            } 
          } 
        },
        { $group: { 
            _id: "$category", 
            total: { $sum: { $toDouble: "$amount" } } 
          } 
        },
        { $project: { 
            _id: 0, 
            category: "$_id", 
            total: 1 
          } 
        },
        { $sort: { total: -1 } }
      ]).toArray();
      
      return result;
    } catch (error) {
      console.error('Error getting expense details:', error);
      throw error;
    }
  }

  // Generate a cash flow statement
  static async generateCashFlowStatement(startDate, endDate) {
    try {
      const db = await mongodb.getDb();
      const invoicesCollection = db.collection('invoices');
      const expensesCollection = db.collection('expenses');
      const cashTransactionsCollection = db.collection('cash_transactions');
      
      // Convert string dates to Date objects if needed
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Cash inflows (payments received)
      const inFlowResult = await invoicesCollection.aggregate([
        { $match: { 
            status: 'paid', 
            payment_date: { 
              $gte: start, 
              $lte: end 
            } 
          } 
        },
        { $group: { 
            _id: null, 
            total: { $sum: { $toDouble: "$amount" } } 
          } 
        }
      ]).toArray();
      
      // Cash outflows (expenses paid)
      const outFlowResult = await expensesCollection.aggregate([
        { $match: { 
            paid: true,
            date: { 
              $gte: start, 
              $lte: end 
            } 
          } 
        },
        { $group: { 
            _id: null, 
            total: { $sum: { $toDouble: "$amount" } } 
          } 
        }
      ]).toArray();
      
      // Beginning cash balance
      const beginBalanceResult = await cashTransactionsCollection.aggregate([
        { $match: { 
            date: { $lt: start } 
          } 
        },
        { $group: { 
            _id: null, 
            total: { $sum: { $toDouble: "$amount" } } 
          } 
        }
      ]).toArray();
      
      const inflows = inFlowResult.length > 0 ? inFlowResult[0].total : 0;
      const outflows = outFlowResult.length > 0 ? outFlowResult[0].total : 0;
      const beginningBalance = beginBalanceResult.length > 0 ? beginBalanceResult[0].total : 0;
      const netCashFlow = inflows - outflows;
      const endingBalance = beginningBalance + netCashFlow;
      
      return {
        startDate,
        endDate,
        beginningBalance,
        inflows,
        outflows,
        netCashFlow,
        endingBalance,
        details: {
          inflows: await this.getCashInflowDetails(startDate, endDate),
          outflows: await this.getCashOutflowDetails(startDate, endDate)
        }
      };
    } catch (error) {
      console.error('Error generating cash flow statement:', error);
      throw error;
    }
  }

  // Get detailed cash inflow breakdown
  static async getCashInflowDetails(startDate, endDate) {
    try {
      const db = await mongodb.getDb();
      const invoicesCollection = db.collection('invoices');
      
      // Convert string dates to Date objects if needed
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const result = await invoicesCollection.aggregate([
        { $match: { 
            status: 'paid', 
            payment_date: { 
              $gte: start, 
              $lte: end 
            } 
          } 
        },
        { $group: { 
            _id: "$client_name", 
            total: { $sum: { $toDouble: "$amount" } } 
          } 
        },
        { $project: { 
            _id: 0, 
            source: "$_id", 
            total: 1 
          } 
        },
        { $sort: { total: -1 } }
      ]).toArray();
      
      return result;
    } catch (error) {
      console.error('Error getting cash inflow details:', error);
      throw error;
    }
  }

  // Get detailed cash outflow breakdown
  static async getCashOutflowDetails(startDate, endDate) {
    try {
      const db = await mongodb.getDb();
      const expensesCollection = db.collection('expenses');
      
      // Convert string dates to Date objects if needed
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const result = await expensesCollection.aggregate([
        { $match: { 
            paid: true,
            date: { 
              $gte: start, 
              $lte: end 
            } 
          } 
        },
        { $group: { 
            _id: "$category", 
            total: { $sum: { $toDouble: "$amount" } } 
          } 
        },
        { $project: { 
            _id: 0, 
            destination: "$_id", 
            total: 1 
          } 
        },
        { $sort: { total: -1 } }
      ]).toArray();
      
      return result;
    } catch (error) {
      console.error('Error getting cash outflow details:', error);
      throw error;
    }
  }
}

module.exports = FinancialReport; 