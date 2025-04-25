import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BusinessOverviewLayout from '../../components/layout/BusinessOverviewLayout';

export default function ClientDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchClientData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/clients/${id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch client data');
        }
        
        const data = await res.json();
        setClient(data.data);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchClientData();
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
              onClick={() => router.push('/clients')}
            >
              Return to Clients
            </button>
          </div>
        </div>
      </BusinessOverviewLayout>
    );
  }

  if (!client) {
    return (
      <BusinessOverviewLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Client Not Found</h3>
            <p>We couldn't find the client you're looking for.</p>
            <button 
              className="mt-4 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
              onClick={() => router.push('/clients')}
            >
              Return to Clients
            </button>
          </div>
        </div>
      </BusinessOverviewLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{client.name} - FiscalFusion</title>
        <meta name="description" content={`Client profile for ${client.name}`} />
      </Head>
      
      <BusinessOverviewLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">{client.name}</h1>
            <button 
              className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
              onClick={() => router.push('/clients')}
            >
              Back to Clients
            </button>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-400 mb-2">Contact Information</h3>
                <p className="text-white">{client.name}</p>
                {client.email && <p className="text-gray-300">{client.email}</p>}
                {client.phone && <p className="text-gray-300">{client.phone}</p>}
                {client.address && <p className="text-gray-300">{client.address}</p>}
              </div>
              <div>
                <h3 className="font-semibold text-gray-400 mb-2">Company Information</h3>
                {client.company && <p className="text-white">{client.company}</p>}
                {client.industry && <p className="text-gray-300">Industry: {client.industry}</p>}
                {client.website && <p className="text-gray-300">Website: <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{client.website}</a></p>}
              </div>
            </div>
            
            {client.notes && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-400 mb-4">Notes</h3>
                <p className="text-white bg-slate-900/50 p-4 rounded">{client.notes}</p>
              </div>
            )}
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                <h3 className="font-semibold text-gray-400 mb-2">Total Invoices</h3>
                <p className="text-2xl font-bold text-white">{client.total_invoices || 0}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                <h3 className="font-semibold text-gray-400 mb-2">Revenue</h3>
                <p className="text-2xl font-bold text-white">${client.total_revenue?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                <h3 className="font-semibold text-gray-400 mb-2">Last Invoice</h3>
                <p className="text-lg text-white">{client.last_invoice_date ? new Date(client.last_invoice_date).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                Edit Client
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      </BusinessOverviewLayout>
    </>
  );
} 