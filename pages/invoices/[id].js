import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BusinessOverviewLayout from '../../components/layout/BusinessOverviewLayout';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchInvoiceData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/invoices/${id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch invoice data');
        }
        
        const data = await res.json();
        setInvoice(data.data);
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoiceData();
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
              onClick={() => router.push('/invoices')}
            >
              Return to Invoices
            </button>
          </div>
        </div>
      </BusinessOverviewLayout>
    );
  }

  if (!invoice) {
    return (
      <BusinessOverviewLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Invoice Not Found</h3>
            <p>We couldn't find the invoice you're looking for.</p>
            <button 
              className="mt-4 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
              onClick={() => router.push('/invoices')}
            >
              Return to Invoices
            </button>
          </div>
        </div>
      </BusinessOverviewLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Invoice #{invoice.invoice_number} - FiscalFusion</title>
        <meta name="description" content={`Details for Invoice #${invoice.invoice_number}`} />
      </Head>
      
      <BusinessOverviewLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Invoice #{invoice.invoice_number}</h1>
            <button 
              className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
              onClick={() => router.push('/invoices')}
            >
              Back to Invoices
            </button>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-400 mb-2">Client Information</h3>
                <p className="text-white">{invoice.client_name}</p>
                {invoice.client_email && <p className="text-gray-300">{invoice.client_email}</p>}
              </div>
              <div>
                <h3 className="font-semibold text-gray-400 mb-2">Invoice Details</h3>
                <p className="text-white">Amount: ${invoice.amount?.toFixed(2)}</p>
                <p className="text-white">Status: 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    invoice.status === 'paid' ? 'bg-green-500/20 text-green-500' : 
                    invoice.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : 
                    invoice.status === 'overdue' ? 'bg-red-500/20 text-red-500' : 
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {invoice.status?.toUpperCase()}
                  </span>
                </p>
                <p className="text-white">Due Date: {new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold text-gray-400 mb-4">Description</h3>
              <p className="text-white bg-slate-900/50 p-4 rounded">{invoice.description}</p>
            </div>
            
            {invoice.items && invoice.items.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-gray-400 mb-4">Invoice Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead className="bg-slate-900/50 text-left">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Item</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3 rounded-tr-lg">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index} className="border-t border-white/5">
                          <td className="px-4 py-3">{item.name}</td>
                          <td className="px-4 py-3">{item.quantity}</td>
                          <td className="px-4 py-3">${item.price?.toFixed(2)}</td>
                          <td className="px-4 py-3">${(item.quantity * item.price)?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-white/10">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-right font-semibold">Total</td>
                        <td className="px-4 py-3 font-semibold">${invoice.amount?.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                Download PDF
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">
                Mark as Paid
              </button>
            </div>
          </div>
        </div>
      </BusinessOverviewLayout>
    </>
  );
} 