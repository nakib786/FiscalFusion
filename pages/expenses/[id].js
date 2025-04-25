import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BusinessOverviewLayout from '../../components/layout/BusinessOverviewLayout';

export default function ExpenseDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchExpenseData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/expenses/${id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch expense data');
        }
        
        const data = await res.json();
        setExpense(data.data);
      } catch (err) {
        console.error('Error fetching expense:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenseData();
  }, [id]);

  if (loading) {
    return (
      <BusinessOverviewLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </BusinessOverviewLayout>
    );
  }

  if (error) {
    return (
      <BusinessOverviewLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Error</h3>
            <p>{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
              onClick={() => router.push('/expenses')}
            >
              Return to Expenses
            </button>
          </div>
        </div>
      </BusinessOverviewLayout>
    );
  }

  if (!expense) {
    return (
      <BusinessOverviewLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Expense Not Found</h3>
            <p>We couldn't find the expense you're looking for.</p>
            <button 
              className="mt-4 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
              onClick={() => router.push('/expenses')}
            >
              Return to Expenses
            </button>
          </div>
        </div>
      </BusinessOverviewLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Expense Details - FiscalFusion</title>
        <meta name="description" content={`Details for expense on ${expense.date}`} />
      </Head>
      
      <BusinessOverviewLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Expense Details</h1>
            <button 
              className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
              onClick={() => router.push('/expenses')}
            >
              Back to Expenses
            </button>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-400 mb-2">Expense Information</h3>
                <p className="text-white">{expense.description}</p>
                <p className="text-gray-300">Amount: <span className="text-white font-semibold">${expense.amount?.toFixed(2)}</span></p>
                <p className="text-gray-300">Date: <span className="text-white">{new Date(expense.date).toLocaleDateString()}</span></p>
                <p className="text-gray-300">Category: <span className="text-white">{expense.category}</span></p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-400 mb-2">Payment Details</h3>
                {expense.vendor && <p className="text-gray-300">Vendor: <span className="text-white">{expense.vendor}</span></p>}
                {expense.payment_method && <p className="text-gray-300">Payment Method: <span className="text-white">{expense.payment_method}</span></p>}
                {expense.status && <p className="text-gray-300">Status: 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    expense.status === 'paid' ? 'bg-green-500/20 text-green-500' : 
                    expense.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : 
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {expense.status.toUpperCase()}
                  </span>
                </p>}
              </div>
            </div>
            
            {expense.notes && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-400 mb-4">Notes</h3>
                <p className="text-white bg-slate-900/50 p-4 rounded">{expense.notes}</p>
              </div>
            )}
            
            {expense.receipt_url && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-400 mb-4">Receipt</h3>
                <div className="bg-slate-900/50 p-4 rounded border border-white/5">
                  <a 
                    href={expense.receipt_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    View Receipt
                  </a>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                Edit Expense
              </button>
              {expense.status !== 'paid' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>
      </BusinessOverviewLayout>
    </>
  );
} 