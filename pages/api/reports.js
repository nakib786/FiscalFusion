// Next.js API route for reports - proxies to Express server
import { handleApiError } from './_helpers';

export default async function handler(req, res) {
  try {
    // Try to get data from backend with improved error handling
    let data;
    
    try {
      // Connect to MongoDB directly to avoid additional express server overhead
      const mongodb = require('../../src/server/database/mongodb-config');
      const db = await mongodb.getDb();
      
      // Check if MongoDB is connected
      if (!mongodb.getConnectionStatus()) {
        throw new Error('MongoDB connection failed');
      }
      
      // Log the available collections for debugging
      const collections = await db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
      
      // Get the query parameters
      const { timeframe = 'month', startDate, endDate, category } = req.query;
      
      // Calculate date range based on parameters
      let start, end;
      
      if (startDate && endDate) {
        // Use custom date range if provided
        start = new Date(startDate);
        end = new Date(endDate);
        
        // Set end time to the end of the day
        end.setHours(23, 59, 59, 999);
      } else {
        // Calculate based on timeframe
        const now = new Date();
        
        if (timeframe === 'month') {
          // Use current month of current year
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        } else if (timeframe === 'quarter') {
          // Use current quarter of current year
          const quarter = Math.floor(now.getMonth() / 3);
          start = new Date(now.getFullYear(), quarter * 3, 1);
          end = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
        } else if (timeframe === 'year') {
          // Use current year
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        } else if (timeframe === 'all_time') {
          // Use a wide date range to include all historical data
          start = new Date(2000, 0, 1); // Start from year 2000
          end = new Date(); // Current date
        } else {
          // Default to all historical data
          start = new Date(2000, 0, 1); // Start from year 2000
          end = new Date(); // Current date
        }
      }
      
      // Ensure dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date range');
      }
      
      console.log('Date range:', { 
        startDate: start.toISOString(), 
        endDate: end.toISOString(),
        timeframe,
        category
      });
      
      // Check for available collections and use appropriate ones
      // Get collection references - check for plural and singular forms
      const getCollection = (names) => {
        for (const name of names) {
          if (collections.some(c => c.name === name)) {
            return db.collection(name);
          }
        }
        return null;
      };
      
      const invoicesCollection = getCollection(['invoices', 'invoice', 'transactions']);
      const expensesCollection = getCollection(['expenses', 'expense', 'transactions']);
      const clientsCollection = getCollection(['clients', 'client', 'customers', 'customer']);
      const transactionsCollection = getCollection(['transactions', 'transaction']);
      
      // Log collection availability
      console.log('Collections found:', {
        invoices: !!invoicesCollection,
        expenses: !!expensesCollection,
        clients: !!clientsCollection,
        transactions: !!transactionsCollection
      });
      
      // Check if we're missing critical collections
      if (!invoicesCollection && !transactionsCollection) {
        throw new Error('No transaction or invoice collections found in database');
      }

      // If we have a transactions collection instead of separate invoices/expenses,
      // we need to use it for both revenue and expenses
      const useTransactionsForAll = !invoicesCollection || !expensesCollection;
      
      // Helper function to safely parse dates in MongoDB
      const safelyMatchDates = (dateField) => {
        return {
          $expr: {
            $and: [
              { $gte: [{ $ifNull: [{ $toDate: `$${dateField}` }, new Date(0)] }, start] },
              { $lte: [{ $ifNull: [{ $toDate: `$${dateField}` }, new Date(0)] }, end] }
            ]
          }
        };
      };

      // Run a sample query to check data structure
      let sampleData = [];
      if (transactionsCollection) {
        sampleData = await transactionsCollection.find().limit(5).toArray();
        console.log('Sample transaction data:', sampleData);
      } else if (invoicesCollection) {
        sampleData = await invoicesCollection.find().limit(5).toArray();
        console.log('Sample invoice data:', sampleData);
      }
      
      // Dynamically determine field names based on sample data
      const determineFields = (sampleData, possibleFields) => {
        if (!sampleData || sampleData.length === 0) return possibleFields[0];
        
        for (const field of possibleFields) {
          if (sampleData.some(item => item[field] !== undefined)) {
            return field;
          }
        }
        return possibleFields[0];
      };
      
      // Determine field names from sample data
      const dateField = determineFields(sampleData, ['date', 'payment_date', 'transaction_date', 'createdAt']);
      const amountField = determineFields(sampleData, ['amount', 'value', 'total', 'sum']);
      const typeField = determineFields(sampleData, ['type', 'transaction_type', 'category', 'transactionType']);
      const statusField = determineFields(sampleData, ['status', 'payment_status', 'paymentStatus']);
      const categoryField = determineFields(sampleData, ['category', 'type', 'expense_category', 'expenseCategory']);
      const clientField = determineFields(sampleData, ['client_name', 'clientName', 'customer', 'payee', 'recipient', 'notes', 'description']);
      
      console.log('Determined fields:', {
        dateField,
        amountField,
        typeField,
        statusField,
        categoryField,
        clientField
      });
      
      // Define revenue and expense type identifiers based on the data structure
      const revenueTypes = ['income', 'revenue', 'sale', 'payment', 'paid', 'inflow', 'credit'];
      const expenseTypes = ['expense', 'cost', 'bill', 'payment_out', 'outflow', 'debit'];
      
      // Improve console logging for debugging
      console.log('API Query Parameters:', {
        timeframe,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        categoryFilter: category,
        fieldNames: {
          dateField,
          amountField,
          typeField,
          statusField,
          categoryField,
          clientField
        },
        collectionsAvailable: {
          invoices: !!invoicesCollection,
          expenses: !!expensesCollection,
          clients: !!clientsCollection,
          transactions: !!transactionsCollection
        }
      });
      
      // Revenue by month query - adapt based on available collections
      let revenueByMonth = [];
      
      if (useTransactionsForAll && transactionsCollection) {
        // Use transactions collection for revenue
        try {
          // Print a sample of what would match
          const sampleRevenue = await transactionsCollection.find({
            [typeField]: { $in: revenueTypes },
            // Simple date match for debugging
            [dateField]: { $exists: true }
          }).limit(2).toArray();
          
          console.log('Sample potential revenue transactions:', sampleRevenue);
          
          // Modified query with simpler date matching and more flexible type detection
          revenueByMonth = await transactionsCollection.aggregate([
            {
              $match: {
                $and: [
                  // More flexible date matching - handle both string and date types
                  {
                    $expr: {
                      $or: [
                        // Handle date objects
                        {
                          $and: [
                            { $gte: [{ $ifNull: [`$${dateField}`, new Date(0)] }, start] },
                            { $lte: [{ $ifNull: [`$${dateField}`, new Date(0)] }, end] }
                          ]
                        },
                        // Handle string dates by converting
                        {
                          $and: [
                            { $gte: [{ $ifNull: [{ $toDate: `$${dateField}` }, new Date(0)] }, start] },
                            { $lte: [{ $ifNull: [{ $toDate: `$${dateField}` }, new Date(0)] }, end] }
                          ]
                        }
                      ]
                    }
                  },
                  // More flexible revenue detection
                  {
                    $or: [
                      // Match revenue types (case insensitive)
                      { [typeField]: { $in: revenueTypes } },
                      // Match by regex for partial matches
                      { [typeField]: { $regex: /income|revenue|payment/i } },
                      // Match positive amounts
                      { [amountField]: { $gt: 0 } }
                    ]
                  }
                ]
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%b",
                    date: {
                      $cond: {
                        if: { $eq: [{ $type: `$${dateField}` }, "date"] },
                        then: `$${dateField}`,
                        else: { $toDate: { $ifNull: [`$${dateField}`, new Date()] } }
                      }
                    }
                  }
                },
                revenue: { $sum: { $toDouble: { $ifNull: [`$${amountField}`, 0] } } }
              }
            },
            { $project: { _id: 0, month: "$_id", revenue: 1 } },
            { $sort: { month: 1 } }
          ]).toArray();
        } catch (revenueError) {
          console.error('Error querying revenue data:', revenueError);
          // Provide empty result if query fails
          revenueByMonth = [];
        }
      } else if (invoicesCollection) {
        // Use dedicated invoices collection with improved error handling
        try {
          revenueByMonth = await invoicesCollection.aggregate([
            {
              $match: {
                $and: [
                  // More flexible date matching - handle both string and date types
                  {
                    $expr: {
                      $or: [
                        // Handle date objects
                        {
                          $and: [
                            { $gte: [{ $ifNull: [`$${dateField}`, new Date(0)] }, start] },
                            { $lte: [{ $ifNull: [`$${dateField}`, new Date(0)] }, end] }
                          ]
                        },
                        // Handle string dates by converting
                        {
                          $and: [
                            { $gte: [{ $ifNull: [{ $toDate: `$${dateField}` }, new Date(0)] }, start] },
                            { $lte: [{ $ifNull: [{ $toDate: `$${dateField}` }, new Date(0)] }, end] }
                          ]
                        }
                      ]
                    }
                  },
                  // If status field exists, match paid status
                  statusField ? { [statusField]: { $in: ['paid', 'completed', 'success'] } } : {}
                ]
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%b",
                    date: {
                      $cond: {
                        if: { $eq: [{ $type: `$${dateField}` }, "date"] },
                        then: `$${dateField}`,
                        else: { $toDate: { $ifNull: [`$${dateField}`, new Date()] } }
                      }
                    }
                  }
                },
                revenue: { $sum: { $toDouble: { $ifNull: [`$${amountField}`, 0] } } }
              }
            },
            { $project: { _id: 0, month: "$_id", revenue: 1 } },
            { $sort: { month: 1 } }
          ]).toArray();
        } catch (invoiceError) {
          console.error('Error querying invoices for revenue:', invoiceError);
          revenueByMonth = [];
        }
      }

      // If we still have no revenue data, try one more simplified approach
      if (!revenueByMonth || revenueByMonth.length === 0) {
        try {
          console.log('No revenue data found, trying simplified query');
          const collection = transactionsCollection || invoicesCollection;
          
          if (collection) {
            // Simple query with minimal filtering to try and get any revenue data
            revenueByMonth = await collection.aggregate([
              {
                $match: {
                  [typeField]: { $in: revenueTypes }
                }
              },
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: "%b",
                      date: {
                        $cond: {
                          if: { $eq: [{ $type: `$${dateField}` }, "date"] },
                          then: `$${dateField}`,
                          else: new Date()
                        }
                      }
                    }
                  },
                  revenue: { $sum: { $toDouble: { $ifNull: [`$${amountField}`, 0] } } }
                }
              },
              { $project: { _id: 0, month: "$_id", revenue: 1 } },
              { $sort: { month: 1 } }
            ]).toArray();
          }
        } catch (fallbackError) {
          console.error('Error with fallback revenue query:', fallbackError);
        }
      }

      console.log(`Revenue by month (${revenueByMonth.length} results):`, revenueByMonth);

      // Remove the sample data generation code
      // If we still don't have any revenue data after all attempts, provide sample data
      if (!revenueByMonth || revenueByMonth.length === 0) {
        console.log('No revenue data found, database may be empty');
      }
      
      // Ensure we have continuous month data for the revenue chart
      if (revenueByMonth.length > 0) {
        // Define standard month abbreviations to ensure correct order
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Create a map of existing data
        const existingMonths = {};
        revenueByMonth.forEach(item => {
          existingMonths[item.month] = item.revenue;
        });
        
        // Determine the range of months in the data (start to end)
        const monthsInData = revenueByMonth.map(item => item.month);
        const startMonthIndex = Math.min(...monthsInData.map(m => monthOrder.indexOf(m)));
        const endMonthIndex = Math.max(...monthsInData.map(m => monthOrder.indexOf(m)));
        
        // Create a complete dataset with all months in range
        const completeRevenueData = [];
        for (let i = startMonthIndex; i <= endMonthIndex; i++) {
          const month = monthOrder[i];
          completeRevenueData.push({
            month: month,
            revenue: existingMonths[month] || 0
          });
        }
        
        // Replace the original data with the complete set
        revenueByMonth = completeRevenueData;
      }
      
      // Expenses by category query
      let expensesByCategory = [];
      
      // Category filter - only apply to expenses
      const categoryMatch = category ? { [categoryField]: category } : {};
      
      if (useTransactionsForAll && transactionsCollection) {
        // Use transactions collection for expenses
        expensesByCategory = await transactionsCollection.aggregate([
          {
            $match: {
              $and: [
                // Match date range
                {
                  $or: [
                    safelyMatchDates(dateField),
                    { [dateField]: { $gte: start, $lte: end } }
                  ]
                },
                // Match expense type transactions
                {
                  $or: [
                    // Either the type field indicates expense
                    { [typeField]: { $in: expenseTypes } },
                    // Or amount is negative (if it's a number field)
                    { [amountField]: { $lt: 0 } }
                  ]
                },
                // Apply category filter if provided
                category ? categoryMatch : {}
              ]
            }
          },
          {
            $group: {
              _id: `$${categoryField || 'category'}`,
              amount: { 
                $sum: { 
                  $abs: { $toDouble: `$${amountField}` } 
                } 
              }
            }
          },
          { $project: { _id: 0, category: { $ifNull: ["$_id", "Uncategorized"] }, amount: 1 } },
          { $sort: { amount: -1 } }
        ]).toArray();
      } else if (expensesCollection) {
        // Use dedicated expenses collection
        expensesByCategory = await expensesCollection.aggregate([
          {
            $match: {
              $and: [
                // Match date range
                {
                  $or: [
                    safelyMatchDates(dateField),
                    { [dateField]: { $gte: start, $lte: end } }
                  ]
                },
                // Apply category filter if provided
                category ? categoryMatch : {}
              ]
            }
          },
          {
            $group: {
              _id: `$${categoryField || 'category'}`,
              amount: { $sum: { $toDouble: `$${amountField}` } }
            }
          },
          { $project: { _id: 0, category: { $ifNull: ["$_id", "Uncategorized"] }, amount: 1 } },
          { $sort: { amount: -1 } }
        ]).toArray();
      }

      console.log(`Expenses by category (${expensesByCategory.length} results):`, expensesByCategory);

      // Profit and loss by month
      let profitLoss = [];
      
      if (useTransactionsForAll && transactionsCollection) {
        // Use transactions for both revenue and expenses
        const monthlyTransactions = await transactionsCollection.aggregate([
          {
            $match: {
              $or: [
                safelyMatchDates(dateField),
                { [dateField]: { $gte: start, $lte: end } }
              ]
            }
          },
          {
            $group: {
              _id: {
                month: {
                  $dateToString: {
                    format: "%b",
                    date: {
                      $cond: {
                        if: { $eq: [{ $type: `$${dateField}` }, "date"] },
                        then: `$${dateField}`,
                        else: { $toDate: `$${dateField}` }
                      }
                    }
                  }
                },
                type: {
                  $cond: {
                    if: {
                      $or: [
                        { $in: [`$${typeField}`, revenueTypes] },
                        { $gt: [`$${amountField}`, 0] }
                      ]
                    },
                    then: "revenue",
                    else: "expense"
                  }
                }
              },
              amount: {
                $sum: { $abs: { $toDouble: `$${amountField}` } }
              }
            }
          },
          {
            $group: {
              _id: "$_id.month",
              revenue: {
                $sum: {
                  $cond: [
                    { $eq: ["$_id.type", "revenue"] },
                    "$amount",
                    0
                  ]
                }
              },
              expenses: {
                $sum: {
                  $cond: [
                    { $eq: ["$_id.type", "expense"] },
                    "$amount",
                    0
                  ]
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              month: "$_id",
              revenue: 1,
              expenses: 1,
              profit: { $subtract: ["$revenue", "$expenses"] }
            }
          },
          { $sort: { month: 1 } }
        ]).toArray();
        
        profitLoss = monthlyTransactions;
      } else {
        // Use separate revenue and expense collections
        const revenueByMonthMap = {};
        revenueByMonth.forEach(item => {
          revenueByMonthMap[item.month] = item.revenue;
        });
        
        const expensesByMonthArray = await (expensesCollection ? expensesCollection.aggregate([
          {
            $match: {
              $or: [
                safelyMatchDates(dateField),
                { [dateField]: { $gte: start, $lte: end } }
              ]
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%b",
                  date: {
                    $cond: {
                      if: { $eq: [{ $type: `$${dateField}` }, "date"] },
                      then: `$${dateField}`,
                      else: { $toDate: `$${dateField}` }
                    }
                  }
                }
              },
              expenses: { $sum: { $toDouble: `$${amountField}` } }
            }
          },
          { $project: { _id: 0, month: "$_id", expenses: 1 } },
          { $sort: { month: 1 } }
        ]).toArray() : []);
        
        const expensesByMonthMap = {};
        expensesByMonthArray.forEach(item => {
          expensesByMonthMap[item.month] = item.expenses;
        });
        
        // Combine revenue and expenses
        const months = [...new Set([
          ...Object.keys(revenueByMonthMap),
          ...Object.keys(expensesByMonthMap)
        ])].sort();
        
        profitLoss = months.map(month => {
          const revenue = revenueByMonthMap[month] || 0;
          const expenses = expensesByMonthMap[month] || 0;
          return {
            month,
            revenue,
            expenses,
            profit: revenue - expenses
          };
        });
      }

      console.log(`Profit/Loss by month (${profitLoss.length} results):`, profitLoss);

      // Top clients by revenue
      let topClients = [];
      
      if (invoicesCollection) {
        console.log('Using invoices collection to get top clients');
        
        try {
          // First try to use client_name field directly if it exists
          const clientNameSample = await invoicesCollection.findOne({ client_name: { $exists: true, $ne: null }});
          
          if (clientNameSample) {
            console.log('Found direct client_name field in invoices');
            // Use direct client_name field
            topClients = await invoicesCollection.aggregate([
              {
                $match: {
                  $and: [
                    {
                      $or: [
                        safelyMatchDates(dateField),
                        { [dateField]: { $gte: start, $lte: end } }
                      ]
                    },
                    // Ensure client_name field exists
                    { client_name: { $exists: true, $ne: null } },
                    // If status field exists, match paid status
                    statusField ? { [statusField]: { $in: ['paid', 'completed', 'success'] } } : {}
                  ]
                }
              },
              {
                $group: {
                  _id: "$client_name",
                  revenue: { $sum: { $toDouble: `$${amountField}` } },
                  invoiceCount: { $sum: 1 }
                }
              },
              { $project: { _id: 0, name: { $ifNull: ["$_id", "Unknown Client"] }, revenue: 1, invoiceCount: 1 } },
              { $sort: { revenue: -1 } },
              { $limit: 5 }
            ]).toArray();
          } else {
            // Try using client_id with a join to get client names
            const clientIdSample = await invoicesCollection.findOne({ client_id: { $exists: true }});
            const clientsCollection = getCollection(['clients', 'client', 'customers', 'customer']);
            
            if (clientIdSample && clientsCollection) {
              console.log('Using client_id with lookup to clients collection');
              
              try {
                topClients = await invoicesCollection.aggregate([
                  {
                    $match: {
                      $and: [
                        {
                          $or: [
                            safelyMatchDates(dateField),
                            { [dateField]: { $gte: start, $lte: end } }
                          ]
                        },
                        // Ensure client_id field exists
                        { client_id: { $exists: true } },
                        // If status field exists, match paid status
                        statusField ? { [statusField]: { $in: ['paid', 'completed', 'success'] } } : {}
                      ]
                    }
                  },
                  {
                    $lookup: {
                      from: "clients",
                      localField: "client_id",
                      foreignField: "_id",
                      as: "client_info"
                    }
                  },
                  {
                    $unwind: {
                      path: "$client_info",
                      preserveNullAndEmptyArrays: true
                    }
                  },
                  {
                    $group: {
                      _id: "$client_id",
                      name: { $first: { $ifNull: ["$client_info.name", "Unknown Client"] } },
                      revenue: { $sum: { $toDouble: `$${amountField}` } },
                      invoiceCount: { $sum: 1 }
                    }
                  },
                  { $project: { _id: 0, name: 1, revenue: 1, invoiceCount: 1 } },
                  { $sort: { revenue: -1 } },
                  { $limit: 5 }
                ]).toArray();
              } catch (lookupError) {
                console.error('Error with client lookup:', lookupError);
                // Fallback to simpler aggregation without lookup
                topClients = await invoicesCollection.aggregate([
                  {
                    $match: {
                      $and: [
                        {
                          $or: [
                            safelyMatchDates(dateField),
                            { [dateField]: { $gte: start, $lte: end } }
                          ]
                        },
                        // If status field exists, match paid status
                        statusField ? { [statusField]: { $in: ['paid', 'completed', 'success'] } } : {}
                      ]
                    }
                  },
                  {
                    $group: {
                      _id: "$client_id",
                      revenue: { $sum: { $toDouble: `$${amountField}` } },
                      invoiceCount: { $sum: 1 }
                    }
                  },
                  { $project: { _id: 0, name: { $ifNull: ["$_id", "Unknown Client"] }, revenue: 1, invoiceCount: 1 } },
                  { $sort: { revenue: -1 } },
                  { $limit: 5 }
                ]).toArray();
              }
            }
          }
        } catch (invoiceError) {
          console.error('Error querying invoices for top clients:', invoiceError);
        }
      }
      
      // If we still don't have top clients, use transaction collection as a fallback
      if (topClients.length === 0 && transactionsCollection) {
        console.log('Falling back to transaction collection for top clients');
        try {
          // Use transactions collection for clients
          // For transactions, try multiple fields that might contain client info
          const possibleClientFields = ['client_name', 'client', 'customer', 'payee', 'notes', 'description', 'memo'];
          
          // Find a field that exists in the data
          let fieldToUse = clientField;
          if (!fieldToUse) {
            for (const field of possibleClientFields) {
              const sampleDoc = await transactionsCollection.findOne({ [field]: { $exists: true, $ne: null } });
              if (sampleDoc) {
                fieldToUse = field;
                console.log(`Found client field in transactions: ${field}`);
                break;
              }
            }
          }
          
          // If still no field found, default to the most likely one
          fieldToUse = fieldToUse || 'description';
          
          console.log(`Using field for client extraction: ${fieldToUse}`);
          
          // Use a simpler approach with grouping by the field directly
          topClients = await transactionsCollection.aggregate([
            {
              $match: {
                $and: [
                  {
                    $or: [
                      safelyMatchDates(dateField),
                      { [dateField]: { $gte: start, $lte: end } }
                    ]
                  },
                  // Only include revenue transactions
                  {
                    $or: [
                      { [typeField]: { $in: revenueTypes } },
                      { [amountField]: { $gt: 0 } }
                    ]
                  },
                  // Make sure the field we're using exists
                  { [fieldToUse]: { $exists: true, $ne: null } }
                ]
              }
            },
            {
              $group: {
                _id: `$${fieldToUse}`,
                revenue: { $sum: { $toDouble: `$${amountField}` } },
                transactionCount: { $sum: 1 }
              }
            },
            { $match: { _id: { $exists: true, $ne: null, $ne: "" } } },
            { $project: { _id: 0, name: { $ifNull: ["$_id", "Unknown Client"] }, revenue: 1, transactionCount: 1 } },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
          ]).toArray();
        } catch (transactionError) {
          console.error('Error querying transactions for top clients:', transactionError);
        }
      }

      // If we still have no clients, create sample data
      if (!topClients || topClients.length === 0) {
        console.log('No client data found, using default data for API response');
        // Use some sample data if no clients were found
        // This is better than returning an empty array
        topClients = [
          { name: 'Client data unavailable', revenue: 0, invoiceCount: 0 }
        ];
      }

      console.log(`Top clients (${topClients.length} results):`, topClients);
      
      // Get available categories for filtering
      let availableCategories = [];
      
      if (categoryField) {
        const categoryCollection = expensesCollection || transactionsCollection;
        if (categoryCollection) {
          availableCategories = await categoryCollection.distinct(categoryField);
        }
      }

      console.log('Available categories:', availableCategories);

      // Create the data object
      data = {
        success: true,
        data: {
          revenueByMonth,
          expensesByCategory,
          profitLoss,
          topClients,
          availableCategories,
          usingSampleData: false
        },
        source: 'mongodb',
        database_status: 'connected',
        dateRange: {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        },
        collectionsFound: {
          invoices: !!invoicesCollection,
          expenses: !!expensesCollection,
          clients: !!clientsCollection,
          transactions: !!transactionsCollection
        },
        fieldsUsed: {
          date: dateField,
          amount: amountField,
          type: typeField,
          status: statusField,
          category: categoryField,
          client: clientField
        }
      };
      
    } catch (backendError) {
      console.error('MongoDB connection error:', backendError);
      throw new Error(`Database connection failed: ${backendError.message}`);
    }

    // Return the data
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in reports API:', error);
    // Return error to client
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to retrieve report data from MongoDB'
    });
  }
} 