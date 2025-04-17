import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AuroraBackground from '../components/ui/aceternity/aurora-background';
import AceternitySidebar from '../components/layout/AceternitySidebar';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbStatus, setDbStatus] = useState('unknown');

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        // Try to fetch from API
        const response = await fetch('/api/clients');
        const responseText = await response.text();
        
        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Invalid JSON from clients API:', responseText);
          throw new Error('Invalid JSON response from API');
        }
        
        if (data && data.data) {
          setClients(data.data);
          
          // If using mock data, show a notice
          if (data.source && data.source.includes('mock')) {
            setError(data.message || 'Using mock data - API connection failed');
            setDbStatus(data.database_status || 'disconnected');
          }
        } else {
          // API didn't return expected data format
          throw new Error('API returned unexpected data format');
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Using mock data - API connection failed');
        
        // Mock data as fallback
        setClients([
          { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', phone: '(555) 123-4567', address: '123 Main St, Anytown, USA' },
          { id: 2, name: 'Globex Industries', email: 'info@globex.com', phone: '(555) 987-6543', address: '456 Business Ave, Commerce City, USA' },
          { id: 3, name: 'Wayne Enterprises', email: 'bruce@wayne.com', phone: '(555) 111-2222', address: '1007 Mountain Drive, Gotham, USA' },
          { id: 4, name: 'Stark Industries', email: 'tony@stark.com', phone: '(555) 333-4444', address: '10880 Malibu Point, Malibu, USA' },
          { id: 5, name: 'Oscorp', email: 'info@oscorp.com', phone: '(555) 555-5555', address: '5th Avenue, New York, USA' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, []);

  return (
    <>
      <Head>
        <title>Clients - FiscalFusion</title>
        <meta name="description" content="Manage your clients" />
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
                  <h1 className="text-xl font-bold text-white ml-2">Clients</h1>
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
                  <h2 className="text-2xl font-bold text-white mb-1">Client Management</h2>
                  <p className="text-gray-400">Manage and track your client relationships</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Client
                </button>
              </div>
              
              {error && (
                <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-yellow-200 font-medium">{error}</p>
                      {dbStatus && dbStatus !== 'unknown' && (
                        <p className="text-yellow-200/70 text-sm mt-1">
                          Database status: <span className={dbStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>{dbStatus}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {loading ? (
                <div className="text-center py-10">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="text-gray-400 mt-4">Loading clients...</p>
                </div>
              ) : (
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg overflow-hidden border border-white/5">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Address</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {clients.map((client) => (
                        <tr key={client.id} className="hover:bg-slate-700/30">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{client.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{client.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{client.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{client.address}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-400 hover:text-blue-300 mr-3 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button className="text-red-400 hover:text-red-300 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </main>
          </div>
        </div>
      </AuroraBackground>
    </>
  );
} 