import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AuroraBackground from '../components/ui/aceternity/aurora-background';
import AceternitySidebar from '../components/layout/AceternitySidebar';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    vendor: '',
    notes: ''
  });

  // List of expense categories
  const categories = [
    'Office Supplies',
    'Travel',
    'Software',
    'Hardware',
    'Utilities',
    'Rent',
    'Marketing',
    'Meals',
    'Other'
  ];

  // Fetch expenses from API
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // Fetch from API
      const response = await fetch('/api/expenses');
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.success && data.data) {
        setExpenses(data.data);
      } else {
        throw new Error('API returned unexpected data format');
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(`Failed to load expenses: ${err.message}`);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Add new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      // Reset form and close modal
      setFormData({
        category: '',
        amount: '',
        date: '',
        vendor: '',
        notes: ''
      });
      setShowAddModal(false);
      
      // Refresh expenses list
      fetchExpenses();
    } catch (err) {
      setError(`Error adding expense: ${err.message}`);
    }
  };

  // Edit expense
  const handleEditExpense = async (e) => {
    e.preventDefault();
    if (!currentExpense) return;
    
    try {
      const response = await fetch(`/api/expenses?id=${currentExpense._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update expense');
      }

      // Reset form and close modal
      setFormData({
        category: '',
        amount: '',
        date: '',
        vendor: '',
        notes: ''
      });
      setCurrentExpense(null);
      setShowEditModal(false);
      
      // Refresh expenses list
      fetchExpenses();
    } catch (err) {
      setError(`Error updating expense: ${err.message}`);
    }
  };

  // Delete expense
  const handleDeleteExpense = async () => {
    if (!currentExpense) return;
    
    try {
      const response = await fetch(`/api/expenses?id=${currentExpense._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      // Reset current expense and close modal
      setCurrentExpense(null);
      setShowDeleteModal(false);
      
      // Refresh expenses list
      fetchExpenses();
    } catch (err) {
      setError(`Error deleting expense: ${err.message}`);
    }
  };

  // Open edit modal and populate form
  const openEditModal = (expense) => {
    setCurrentExpense(expense);
    setFormData({
      category: expense.category || '',
      amount: expense.amount || '',
      date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
      vendor: expense.vendor || '',
      notes: expense.notes || ''
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (expense) => {
    setCurrentExpense(expense);
    setShowDeleteModal(true);
  };

  // Category Badge component
  const CategoryBadge = ({ category }) => {
    let badgeClass = 'px-2 py-1 text-xs rounded-full ';
    
    switch(category) {
      case 'Office Supplies':
        badgeClass += 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        break;
      case 'Software':
        badgeClass += 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
        break;
      case 'Utilities':
        badgeClass += 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        break;
      case 'Travel':
        badgeClass += 'bg-green-500/20 text-green-400 border border-green-500/30';
        break;
      case 'Marketing':
        badgeClass += 'bg-pink-500/20 text-pink-400 border border-pink-500/30';
        break;
      case 'Rent':
        badgeClass += 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
        break;
      case 'Hardware':
        badgeClass += 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
        break;
      case 'Meals':
        badgeClass += 'bg-red-500/20 text-red-400 border border-red-500/30';
        break;
      default:
        badgeClass += 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
    
    return <span className={badgeClass}>{category}</span>;
  };

  return (
    <>
      <Head>
        <title>Expenses - FiscalFusion</title>
        <meta name="description" content="Manage your expenses" />
      </Head>
      
      <AuroraBackground 
        primaryColor="#3b82f6" 
        containerClassName="h-screen rounded-none"
        gradientClassName="bg-gradient-to-b from-slate-900/90 to-slate-950"
      >
        <div className="flex h-screen">
          {/* Sidebar */}
          <AceternitySidebar />
          
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top navigation */}
            <header className="bg-transparent backdrop-blur-sm shadow-sm z-10 border-b border-white/5">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  {/* Page title */}
                  <h1 className="text-xl font-bold text-white ml-2">Expenses</h1>
                </div>
                
                <div className="flex items-center">
                  <button className="text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  
                  <button className="text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  
                  <button className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      C
                    </div>
                  </button>
                </div>
              </div>
            </header>
            
            {/* Content area */}
            <main className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Expense Management</h2>
                  <p className="text-gray-400">Track and categorize your business expenses</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Expense
                </button>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-red-200 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {loading ? (
                <div className="text-center py-10">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="text-gray-400 mt-4">Loading expenses...</p>
                </div>
              ) : (
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg overflow-hidden border border-white/5">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Expense ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vendor</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {expenses.length > 0 ? (
                        expenses.map((expense) => (
                          <tr key={expense._id || expense.id} className="hover:bg-slate-700/30">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">EXP-{(expense._id || expense.id).toString().padStart(4, '0')}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <CategoryBadge category={expense.category} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatCurrency(expense.amount)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(expense.date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{expense.vendor}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={() => openEditModal(expense)}
                                className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => openDeleteModal(expense)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                            No expenses found. Try adding a new expense.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </main>
          </div>
        </div>
      </AuroraBackground>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Add New Expense</h3>
            <form onSubmit={handleAddExpense}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Vendor</label>
                <input
                  type="text"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Edit Expense</h3>
            <form onSubmit={handleEditExpense}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Vendor</label>
                <input
                  type="text"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Update Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Delete Expense</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this expense for {currentExpense?.vendor} ({formatCurrency(currentExpense?.amount)})? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteExpense}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 