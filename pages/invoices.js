import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AuroraBackground from '../components/ui/aceternity/aurora-background';
import AceternitySidebar from '../components/layout/AceternitySidebar';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [archivedInvoices, setArchivedInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'archived'
  const [formData, setFormData] = useState({
    client_name: '',
    amount: '',
    status: 'unpaid',
    due_date: '',
    notes: ''
  });

  // List of invoice statuses
  const statusOptions = [
    'paid',
    'unpaid',
    'overdue'
  ];

  // State for archive remark
  const [archiveRemark, setArchiveRemark] = useState('');

  // Add state for restore modal and restoration remark
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restorationRemark, setRestorationRemark] = useState('');

  // Fetch invoices from API
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // Fetch from API
      const response = await fetch('/api/invoices');
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.success && data.data) {
        setInvoices(data.data);
      } else {
        throw new Error('API returned unexpected data format');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(`Failed to load invoices: ${err.message}`);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch archived invoices
  const fetchArchivedInvoices = async () => {
    setLoading(true);
    try {
      // Fetch from API with archived=true parameter
      const response = await fetch('/api/invoices?archived=true');
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.success && data.data) {
        setArchivedInvoices(data.data);
      } else {
        throw new Error('API returned unexpected data format');
      }
    } catch (err) {
      console.error('Error fetching archived invoices:', err);
      setError(`Failed to load archived invoices: ${err.message}`);
      setArchivedInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients for client selection dropdown
  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.success && data.data) {
        setClients(data.data);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchArchivedInvoices();
    fetchClients();
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

  // Add new invoice
  const handleAddInvoice = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add invoice');
      }

      // Reset form and close modal
      setFormData({
        client_name: '',
        amount: '',
        status: 'unpaid',
        due_date: '',
        notes: ''
      });
      setShowAddModal(false);
      
      // Refresh invoices list
      fetchInvoices();
    } catch (err) {
      setError(`Error adding invoice: ${err.message}`);
    }
  };

  // Edit invoice
  const handleEditInvoice = async (e) => {
    e.preventDefault();
    if (!currentInvoice) return;
    
    try {
      // Get the id from either _id or id property
      const invoiceId = currentInvoice._id || currentInvoice.id;
      
      const response = await fetch(`/api/invoices?id=${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update invoice');
      }

      // Reset form and close modal
      setFormData({
        client_name: '',
        amount: '',
        status: 'unpaid',
        due_date: '',
        notes: ''
      });
      setCurrentInvoice(null);
      setShowEditModal(false);
      
      // Refresh invoices list
      fetchInvoices();
    } catch (err) {
      setError(`Error updating invoice: ${err.message}`);
    }
  };

  // Archive invoice instead of deleting it
  const handleArchiveInvoice = async () => {
    if (!currentInvoice) return;
    
    try {
      // Get the id from either _id or id property
      const invoiceId = currentInvoice._id || currentInvoice.id;
      
      if (!invoiceId) {
        throw new Error('Invoice ID is missing');
      }
      
      // Log debugging information to console
      console.log('Attempting to archive invoice:', {
        invoiceId,
        invoiceData: currentInvoice,
        hasMongoId: !!currentInvoice._id,
        hasRegularId: !!currentInvoice.id,
        fullInvoice: JSON.stringify(currentInvoice)
      });
      
      const response = await fetch(`/api/invoices?id=${invoiceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          archivedBy: 'Current User', // In a real app, this would be the logged-in user's name
          remark: archiveRemark
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        let errorMessage = 'Failed to archive invoice';
        
        if (response.status === 404) {
          // Handle the case when invoice is not found in the database
          errorMessage = 'Invoice not found in the database. It may have been already archived or deleted.';
          
          // Try to remove the invoice from the local state to prevent further archive attempts
          const updatedInvoices = invoices.filter(invoice => 
            (invoice._id !== currentInvoice._id) && (invoice.id !== currentInvoice.id)
          );
          setInvoices(updatedInvoices);
        } else if (responseData?.error) {
          errorMessage += `: ${responseData.error}`;
        }
        
        throw new Error(errorMessage);
      }

      // Reset current invoice and close modal
      setCurrentInvoice(null);
      setShowDeleteModal(false);
      setArchiveRemark('');
      
      // Refresh invoices list
      fetchInvoices();
      
      // Show success message
      setError(null);
    } catch (err) {
      console.error('Archive error:', err);
      setError(`${err.message}`);
    }
  };

  // Function to handle restoring an archived invoice
  const handleRestoreInvoice = async () => {
    if (!currentInvoice) return;
    
    try {
      // Get the id from either _id or id property
      const invoiceId = currentInvoice._id || currentInvoice.id;
      
      if (!invoiceId) {
        throw new Error('Invoice ID is missing');
      }
      
      const response = await fetch(`/api/invoices?operation=restore&id=${invoiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restoredBy: 'Current User', // In a real app, this would be the logged-in user's name
          remark: restorationRemark
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        let errorMessage = 'Failed to restore invoice';
        if (responseData?.error) {
          errorMessage += `: ${responseData.error}`;
        }
        throw new Error(errorMessage);
      }

      // Reset current invoice and close modal
      setCurrentInvoice(null);
      setShowRestoreModal(false);
      setRestorationRemark('');
      
      // Refresh both active and archived invoices lists
      fetchInvoices();
      fetchArchivedInvoices();
      
      // Show success message
      setError(null);
    } catch (err) {
      console.error('Restore error:', err);
      setError(`${err.message}`);
    }
  };

  // Function to open restore modal
  const openRestoreModal = (invoice) => {
    setCurrentInvoice(invoice);
    setShowRestoreModal(true);
  };

  // Open edit modal and populate form
  const openEditModal = (invoice) => {
    setCurrentInvoice(invoice);
    setFormData({
      client_name: invoice.client_name || '',
      amount: invoice.amount || '',
      status: invoice.status || 'unpaid',
      due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
      notes: invoice.notes || ''
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (invoice) => {
    setCurrentInvoice(invoice);
    setShowDeleteModal(true);
  };

  // Status Badge component
  const StatusBadge = ({ status }) => {
    let badgeClass = 'px-2 py-1 text-xs rounded-full ';
    
    switch(status) {
      case 'paid':
        badgeClass += 'bg-green-500/20 text-green-400 border border-green-500/30';
        break;
      case 'unpaid':
        badgeClass += 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        break;
      case 'overdue':
        badgeClass += 'bg-red-500/20 text-red-400 border border-red-500/30';
        break;
      default:
        badgeClass += 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
    
    return <span className={badgeClass}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  // Change tab between active and archived invoices
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'active') {
      fetchInvoices();
    } else {
      fetchArchivedInvoices();
    }
  };

  return (
    <>
      <Head>
        <title>Invoices - FiscalFusion</title>
        <meta name="description" content="Manage your invoices" />
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
                  <h1 className="text-xl font-bold text-white ml-2">Invoices</h1>
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
                  <h2 className="text-2xl font-bold text-white mb-1">Invoice Management</h2>
                  <p className="text-gray-400">Create, track, and manage your invoices</p>
                </div>
                {activeTab === 'active' && (
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Invoice
                  </button>
                )}
              </div>
              
              {/* Tab Navigation */}
              <div className="mb-6">
                <div className="flex border-b border-gray-700">
                  <button
                    onClick={() => handleTabChange('active')}
                    className={`py-2 px-4 text-sm font-medium ${
                      activeTab === 'active'
                        ? 'border-b-2 border-blue-500 text-blue-500'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Active Invoices
                  </button>
                  <button
                    onClick={() => handleTabChange('archived')}
                    className={`py-2 px-4 text-sm font-medium flex items-center ${
                      activeTab === 'archived'
                        ? 'border-b-2 border-blue-500 text-blue-500'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Archived Invoices
                  </button>
                </div>
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
                  <p className="text-gray-400 mt-4">Loading invoices...</p>
                </div>
              ) : (
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg overflow-hidden border border-white/5">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Invoice #</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Client</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Due Date</th>
                        {activeTab === 'archived' && (
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Archived Info</th>
                        )}
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {activeTab === 'active' ? (
                        // Active invoices
                        invoices.length > 0 ? (
                          invoices.map((invoice) => (
                            <tr key={invoice._id || invoice.id} className="hover:bg-slate-700/30">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">INV-{(invoice._id || invoice.id).toString().padStart(4, '0')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{invoice.client_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatCurrency(invoice.amount)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={invoice.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(invoice.due_date)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                  onClick={() => openEditModal(invoice)}
                                  className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => openDeleteModal(invoice)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                              No active invoices found. Try creating a new invoice.
                            </td>
                          </tr>
                        )
                      ) : (
                        // Archived invoices
                        archivedInvoices.length > 0 ? (
                          archivedInvoices.map((invoice) => (
                            <tr key={invoice._id || invoice.id} className="hover:bg-slate-700/30">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">INV-{(invoice.original_id || invoice._id || invoice.id).toString().padStart(4, '0')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{invoice.client_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatCurrency(invoice.amount)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={invoice.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(invoice.due_date)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <div>
                                  <p className="text-xs text-gray-400">
                                    Archived on: {formatDate(invoice.archive_metadata?.archived_at)}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    By: {invoice.archive_metadata?.archived_by}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate max-w-[200px]" title={invoice.archive_metadata?.archive_remark}>
                                    Reason: {invoice.archive_metadata?.archive_remark}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                  onClick={() => openRestoreModal(invoice)}
                                  className="text-green-400 hover:text-green-300 mr-3 transition-colors"
                                  title="Restore invoice"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                              No archived invoices found.
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </main>
          </div>
        </div>
      </AuroraBackground>

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Create New Invoice</h3>
            <form onSubmit={handleAddInvoice}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Client</label>
                <select
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client._id || client.id} value={client.name}>{client.name}</option>
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
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
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Edit Invoice</h3>
            <form onSubmit={handleEditInvoice}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Client</label>
                <select
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client._id || client.id} value={client.name}>{client.name}</option>
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
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
                  Update Invoice
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
            <h3 className="text-xl font-bold text-white mb-4">Archive Invoice</h3>
            <p className="text-gray-300 mb-4">
              You are archiving invoice #{(currentInvoice?._id || currentInvoice?.id).toString().padStart(4, '0')} for {currentInvoice?.client_name} ({formatCurrency(currentInvoice?.amount)}).
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Reason for Archiving (Required)</label>
              <textarea
                value={archiveRemark}
                onChange={(e) => setArchiveRemark(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Please provide a reason for archiving this invoice..."
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setArchiveRemark('');
                }}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleArchiveInvoice}
                disabled={!archiveRemark.trim()}
                className={`px-4 py-2 ${!archiveRemark.trim() ? 'bg-red-600/50 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white rounded-md`}
              >
                Archive Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Restore Confirmation Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Restore Invoice</h3>
            <p className="text-gray-300 mb-4">
              You are restoring invoice #{(currentInvoice?.original_id || currentInvoice?._id || currentInvoice?.id).toString().padStart(4, '0')} for {currentInvoice?.client_name} ({formatCurrency(currentInvoice?.amount)}).
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Reason for Restoring (Optional)</label>
              <textarea
                value={restorationRemark}
                onChange={(e) => setRestorationRemark(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Please provide a reason for restoring this invoice..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowRestoreModal(false);
                  setRestorationRemark('');
                }}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRestoreInvoice}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                Restore Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 