const db = require('../database/config');

class FinancialReport {
  // Generate a balance sheet report
  static async generateBalanceSheet(date = new Date()) {
    try {
      // Assets
      const assetsResult = await db.query(
        `SELECT SUM(amount) as total FROM assets WHERE date <= $1`,
        [date]
      );
      
      // Liabilities
      const liabilitiesResult = await db.query(
        `SELECT SUM(amount) as total FROM liabilities WHERE date <= $1`,
        [date]
      );
      
      // Equity (Assets - Liabilities)
      const assets = parseFloat(assetsResult.rows[0]?.total || 0);
      const liabilities = parseFloat(liabilitiesResult.rows[0]?.total || 0);
      const equity = assets - liabilities;
      
      return {
        date,
        assets,
        liabilities,
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
      const result = await db.query(
        `SELECT category, SUM(amount) as total
         FROM assets
         WHERE date <= $1
         GROUP BY category
         ORDER BY total DESC`,
        [date]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting asset details:', error);
      throw error;
    }
  }

  // Get detailed liability breakdown
  static async getLiabilityDetails(date) {
    try {
      const result = await db.query(
        `SELECT category, SUM(amount) as total
         FROM liabilities
         WHERE date <= $1
         GROUP BY category
         ORDER BY total DESC`,
        [date]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting liability details:', error);
      throw error;
    }
  }

  // Generate an income statement (profit & loss)
  static async generateIncomeStatement(startDate, endDate) {
    try {
      // Revenue
      const revenueResult = await db.query(
        `SELECT SUM(amount) as total
         FROM invoices
         WHERE status = 'paid' AND payment_date BETWEEN $1 AND $2`,
        [startDate, endDate]
      );
      
      // Expenses
      const expenseResult = await db.query(
        `SELECT SUM(amount) as total
         FROM expenses
         WHERE date BETWEEN $1 AND $2`,
        [startDate, endDate]
      );
      
      const revenue = parseFloat(revenueResult.rows[0]?.total || 0);
      const expenses = parseFloat(expenseResult.rows[0]?.total || 0);
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
      const result = await db.query(
        `SELECT c.name as client_name, SUM(i.amount) as total
         FROM invoices i
         JOIN clients c ON i.client_id = c.id
         WHERE i.status = 'paid' AND i.payment_date BETWEEN $1 AND $2
         GROUP BY c.name
         ORDER BY total DESC`,
        [startDate, endDate]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting revenue details:', error);
      throw error;
    }
  }

  // Get detailed expense breakdown
  static async getExpenseDetails(startDate, endDate) {
    try {
      const result = await db.query(
        `SELECT category, SUM(amount) as total
         FROM expenses
         WHERE date BETWEEN $1 AND $2
         GROUP BY category
         ORDER BY total DESC`,
        [startDate, endDate]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting expense details:', error);
      throw error;
    }
  }

  // Generate a cash flow statement
  static async generateCashFlowStatement(startDate, endDate) {
    try {
      // Cash inflows (payments received)
      const inFlowResult = await db.query(
        `SELECT SUM(amount) as total
         FROM invoices
         WHERE status = 'paid' AND payment_date BETWEEN $1 AND $2`,
        [startDate, endDate]
      );
      
      // Cash outflows (expenses paid)
      const outFlowResult = await db.query(
        `SELECT SUM(amount) as total
         FROM expenses
         WHERE date BETWEEN $1 AND $2`,
        [startDate, endDate]
      );
      
      // Beginning cash balance
      const beginBalanceResult = await db.query(
        `SELECT SUM(amount) as total
         FROM cash_transactions
         WHERE date < $1`,
        [startDate]
      );
      
      const inflows = parseFloat(inFlowResult.rows[0]?.total || 0);
      const outflows = parseFloat(outFlowResult.rows[0]?.total || 0);
      const beginningBalance = parseFloat(beginBalanceResult.rows[0]?.total || 0);
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
      const result = await db.query(
        `SELECT c.name as source, SUM(i.amount) as total
         FROM invoices i
         JOIN clients c ON i.client_id = c.id
         WHERE i.status = 'paid' AND i.payment_date BETWEEN $1 AND $2
         GROUP BY c.name
         ORDER BY total DESC`,
        [startDate, endDate]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting cash inflow details:', error);
      throw error;
    }
  }

  // Get detailed cash outflow breakdown
  static async getCashOutflowDetails(startDate, endDate) {
    try {
      const result = await db.query(
        `SELECT category as destination, SUM(amount) as total
         FROM expenses
         WHERE date BETWEEN $1 AND $2
         GROUP BY category
         ORDER BY total DESC`,
        [startDate, endDate]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting cash outflow details:', error);
      throw error;
    }
  }
}

module.exports = FinancialReport; 