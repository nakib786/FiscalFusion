import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TransactionEditModal from './TransactionEditModal';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [filter, setFilter] = useState({
    status: 'all', // all, uncategorized, reviewed
    type: 'all', // all, income, expense
    dateRange: 'month', // week, month, quarter, year
    search: '',
    category: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const categories = {
    income: ['Salary', 'Investment', 'Side Hustle', 'Gift', 'Other'],
    expense: ['Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Personal', 'Other']
  };
  
  useEffect(() => {
    fetchTransactions();
  }, [filter.dateRange]);
  
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/transactions?dateRange=${filter.dateRange}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setTransactions(data.data || generateMockTransactions());
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Could not load transactions');
      
      // Fallback to mock data
      setTransactions(generateMockTransactions());
    } finally {
      setLoading(false);
    }
  };
  
  const updateTransaction = async (transactionId, updateData) => {
    try {
      const response = await fetch(`/api/transactions?id=${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating transaction: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Update the local state with the updated transaction
        setTransactions(
          transactions.map(t => t.id === transactionId ? result.data : t)
        );
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to update transaction');
      }
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError(`Failed to update transaction: ${err.message}`);
      return null;
    }
  };
  
  const createTransaction = async (transactionData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      
      if (!response.ok) {
        throw new Error(`Error creating transaction: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Add the new transaction to the local state
        setTransactions([result.data, ...transactions]);
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to create transaction');
      }
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(`Failed to create transaction: ${err.message}`);
      return null;
    }
  };
  
  function generateMockTransactions() {
    const types = ['income', 'expense'];
    const statuses = ['categorized', 'uncategorized', 'reviewed'];
    const categories = {
      income: ['Client Payment', 'Product Sales', 'Consulting', 'Dividends', 'Royalties', 'Other Income'],
      expense: ['Office Rent', 'Utilities', 'Payroll', 'Software Subscriptions', 'Travel', 'Marketing', 'Equipment', 'Supplies', 'Other Expense']
    };
    
    const accounts = ['Checking Account', 'Savings Account', 'Business Credit Card'];
    const payees = ['ABC Client', 'XYZ Supplier', 'Utility Company', 'Office Supply Store', 'Software Vendor', 'Marketing Agency'];
    
    const transactions = [];
    for (let i = 0; i < 50; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const category = categories[type][Math.floor(Math.random() * categories[type].length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const account = accounts[Math.floor(Math.random() * accounts.length)];
      const payee = payees[Math.floor(Math.random() * payees.length)];
      
      const amount = type === 'income' 
        ? Math.floor(Math.random() * 5000) + 500 
        : -(Math.floor(Math.random() * 3000) + 200);
      
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));
      
      transactions.push({
        id: `tr-${i + 1}`,
        date: date.toISOString().split('T')[0],
        type,
        category: status === 'uncategorized' ? null : category,
        status,
        amount,
        account,
        payee,
        description: `${type === 'income' ? 'Payment from' : 'Payment to'} ${payee}`,
        notes: Math.random() > 0.7 ? 'Custom note for this transaction' : '',
        attachments: Math.random() > 0.8 ? [{ name: 'receipt.pdf', url: '#' }] : []
      });
    }
    
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount));
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };
  
  const handleSelectTransaction = (id) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(selectedTransactions.filter(tId => tId !== id));
    } else {
      setSelectedTransactions([...selectedTransactions, id]);
    }
  };
  
  const handleCategoryChange = async (ids, newCategory) => {
    const updatedTransactions = [];
    
    for (const id of ids) {
      const result = await updateTransaction(id, {
        category: newCategory,
        status: 'categorized'
      });
      
      if (result) {
        updatedTransactions.push(result);
      }
    }
    
    if (updatedTransactions.length > 0) {
      console.log(`Categorized ${updatedTransactions.length} transactions as ${newCategory}`);
    }
    
    // Clear selections after categorizing
    setSelectedTransactions([]);
  };
  
  const handleMarkReviewed = async (ids) => {
    const updatedTransactions = [];
    
    for (const id of ids) {
      const result = await updateTransaction(id, {
        status: 'reviewed'
      });
      
      if (result) {
        updatedTransactions.push(result);
      }
    }
    
    if (updatedTransactions.length > 0) {
      console.log(`Marked ${updatedTransactions.length} transactions as reviewed`);
    }
    
    // Clear selections after marking as reviewed
    setSelectedTransactions([]);
  };
  
  const handleFilterChange = (key, value) => {
    setFilter({
      ...filter,
      [key]: value
    });
  };
  
  const handleEditTransaction = (transaction) => {
    setEditingTransaction({...transaction});
  };
  
  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setEditingTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };
  
  const handleSaveTransaction = async () => {
    try {
      const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingTransaction),
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      const updatedTransaction = await response.json();
      
      // Update the transaction in the local state
      setTransactions(transactions.map(t => 
        t._id === updatedTransaction._id ? updatedTransaction : t
      ));
      
      // Close the modal
      setEditingTransaction(null);
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError(err.message);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };
  
  // Apply filters to the transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by status
    if (filter.status !== 'all' && transaction.status !== filter.status) {
      return false;
    }
    
    // Filter by type
    if (filter.type !== 'all' && transaction.type !== filter.type) {
      return false;
    }
    
    // Filter by category
    if (filter.category !== 'all') {
      if (filter.category === 'uncategorized' && transaction.category) {
        return false;
      } else if (filter.category !== 'uncategorized' && transaction.category !== filter.category) {
        return false;
      }
    }
    
    // Filter by search term
    if (filter.search && !transaction.description.toLowerCase().includes(filter.search.toLowerCase()) && 
        !transaction.payee.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading transactions...</div>;
  }
  
  return (
    <div className="p-6 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-semibold mb-4 md:mb-0">Transactions</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <svg 
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <button 
            className="px-4 py-2 flex items-center space-x-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg 
              className="h-5 w-5 text-gray-500" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>Filters</span>
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => {/* Would open a form to add a new transaction */}}
          >
            Add Transaction
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={filter.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="uncategorized">Uncategorized</option>
              <option value="categorized">Categorized</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={filter.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={filter.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="uncategorized">Uncategorized</option>
              <optgroup label="Income">
                {categories.income.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
              <optgroup label="Expense">
                {categories.expense.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={filter.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      )}
      
      {selectedTransactions.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-md mb-6 flex justify-between items-center">
          <div>
            <span className="text-blue-700 font-medium">{selectedTransactions.length} transactions selected</span>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <select 
                className="appearance-none w-full bg-white border border-gray-300 px-4 py-2 pr-8 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  if (e.target.value) {
                    handleCategoryChange(selectedTransactions, e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Categorize as...</option>
                <optgroup label="Income">
                  {categories.income.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </optgroup>
                <optgroup label="Expense">
                  {categories.expense.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </optgroup>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <button 
              className="bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm text-sm hover:bg-gray-50"
              onClick={() => handleMarkReviewed(selectedTransactions)}
            >
              Mark as reviewed
            </button>
            
            <button 
              className="bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm text-sm hover:bg-gray-50"
              onClick={() => setSelectedTransactions([])}
            >
              Clear selection
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  onChange={handleSelectAll}
                  checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                />
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <tr 
                  key={transaction.id} 
                  className={`hover:bg-gray-50 ${selectedTransactions.includes(transaction.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={() => handleSelectTransaction(transaction.id)}
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900">
                    <div className="font-medium">{transaction.payee}</div>
                    <div className="text-gray-500">{transaction.description}</div>
                    {transaction.notes && (
                      <div className="text-gray-400 text-xs mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Has notes
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    {transaction.category ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.category}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Uncategorized
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.account}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm font-medium text-right ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'reviewed' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.status === 'uncategorized'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status === 'reviewed' 
                        ? 'Reviewed' 
                        : transaction.status === 'uncategorized'
                        ? 'Uncategorized'
                        : 'Categorized'
                      }
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTransaction(transaction);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Edit
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-3 py-8 text-center text-gray-500">
                  No transactions found matching your filters. Try adjusting your filters or adding new transactions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{filteredTransactions.length}</span> of{' '}
          <span className="font-medium">{transactions.length}</span> transactions
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded-md text-sm hover:bg-blue-700">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
      
      {/* Transaction Edit Modal */}
      {editingTransaction && (
        <TransactionEditModal
          transaction={editingTransaction}
          categories={categories}
          onSave={handleSaveTransaction}
          onCancel={handleCancelEdit}
          onChange={handleTransactionChange}
        />
      )}
    </div>
  );
} 