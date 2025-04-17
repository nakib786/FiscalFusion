import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SimpleTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to get data from backend
        const response = await fetch('/api/transactions');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format the data
        setTransactions(data.data || generateMockTransactions());
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Could not load transactions');
        
        // Set mock data
        setTransactions(generateMockTransactions());
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  function generateMockTransactions() {
    const types = ['income', 'expense'];
    const categories = {
      income: ['Client Payment', 'Product Sales', 'Consulting', 'Dividends', 'Royalties'],
      expense: ['Office Rent', 'Utilities', 'Payroll', 'Software Subscriptions', 'Travel', 'Marketing']
    };
    
    const transactions = [];
    for (let i = 0; i < 10; i++) {
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
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };
  
  if (loading) {
    return <div className="flex items-center justify-center p-8 text-white">Loading transactions...</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Recent Transactions</h2>
      <div className="overflow-x-auto bg-transparent backdrop-blur-sm border border-white/10 rounded-lg">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-white/10">
            {transactions.map(transaction => (
              <tr key={transaction.id} className="text-sm hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-gray-200">{formatDate(transaction.date)}</td>
                <td className="px-4 py-3 text-gray-200">{transaction.description}</td>
                <td className="px-4 py-3 text-gray-200">{transaction.category}</td>
                <td className={`px-4 py-3 text-right font-medium whitespace-nowrap ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 