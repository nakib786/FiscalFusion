import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BusinessOverviewLayout from '../../components/layout/BusinessOverviewLayout';

export default function TransactionDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchTransactionData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/transactions/${id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch transaction data');
        }
        
        const data = await res.json();
        setTransaction(data.data);
      } catch (err) {
        console.error('Error fetching transaction:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactionData();
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
              onClick={() => router.push('/transactions')}
            >
              Return to Transactions
            </button>
          </div>
        </div>
      </BusinessOverviewLayout>
    );
  }

  if (!transaction) {
    return (
      <BusinessOverviewLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Transaction Not Found</h3>
            <p>We couldn't find the transaction you're looking for.</p>
            <button 
              className="mt-4 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
              onClick={() => router.push('/transactions')}
            >
              Return to Transactions
            </button>
          </div>
        </div>
      </BusinessOverviewLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Transaction Details - FiscalFusion</title>
        <meta name="description" content={`Details for transaction ${transaction._id}`} />
      </Head>
      
      <BusinessOverviewLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Transaction Details</h1>
            <button 
              className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
              onClick={() => router.push('/transactions')}
            >
              Back to Transactions
            </button>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-400 mb-2">Transaction Information</h3>
                <p className="text-white">{transaction.description}</p>
                <p className="text-gray-300">Amount: 
                  <span className={`ml-2 font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount)?.toFixed(2)}
                  </span>
                </p>
                <p className="text-gray-300">Date: <span className="text-white">{new Date(transaction.date).toLocaleDateString()}</span></p>
                <p className="text-gray-300">Type: 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    transaction.type === 'income' ? 'bg-green-500/20 text-green-500' : 
                    transaction.type === 'expense' ? 'bg-red-500/20 text-red-500' : 
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    {transaction.type?.toUpperCase()}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-400 mb-2">Additional Details</h3>
                {transaction.category && <p className="text-gray-300">Category: <span className="text-white">{transaction.category}</span></p>}
                {transaction.account && <p className="text-gray-300">Account: <span className="text-white">{transaction.account}</span></p>}
                {transaction.payment_method && <p className="text-gray-300">Payment Method: <span className="text-white">{transaction.payment_method}</span></p>}
                {transaction.reference && <p className="text-gray-300">Reference: <span className="text-white">{transaction.reference}</span></p>}
              </div>
            </div>
            
            {transaction.notes && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-400 mb-4">Notes</h3>
                <p className="text-white bg-slate-900/50 p-4 rounded">{transaction.notes}</p>
              </div>
            )}
            
            {transaction.attachment_url && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-400 mb-4">Attachment</h3>
                <div className="bg-slate-900/50 p-4 rounded border border-white/5">
                  <a 
                    href={transaction.attachment_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                    </svg>
                    View Attachment
                  </a>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                Edit Transaction
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </BusinessOverviewLayout>
    </>
  );
} 