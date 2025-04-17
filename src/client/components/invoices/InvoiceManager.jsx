import React, { useState, useEffect } from 'react';

function InvoiceManager() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    // Simulate fetching invoices data
    setTimeout(() => {
      try {
        const mockInvoices = [
          { 
            id: 1, 
            client_name: 'Acme Corp', 
            amount: '1500.00', 
            status: 'paid', 
            issue_date: '2023-08-01',
            due_date: '2023-08-15',
            description: 'Website development services'
          },
          { 
            id: 2, 
            client_name: 'Globex Inc', 
            amount: '2450.00', 
            status: 'unpaid', 
            issue_date: '2023-08-15',
            due_date: '2023-09-01',
            description: 'SEO consulting'
          },
          { 
            id: 3, 
            client_name: 'Stark Industries', 
            amount: '3200.00', 
            status: 'paid', 
            issue_date: '2023-08-05',
            due_date: '2023-08-20',
            description: 'Mobile app development'
          },
          { 
            id: 4, 
            client_name: 'Wayne Enterprises', 
            amount: '1800.00', 
            status: 'overdue', 
            issue_date: '2023-07-25',
            due_date: '2023-08-10',
            description: 'IT security audit'
          },
          { 
            id: 5, 
            client_name: 'Oscorp', 
            amount: '950.00', 
            status: 'unpaid', 
            issue_date: '2023-08-20',
            due_date: '2023-09-05',
            description: 'Graphic design work'
          }
        ];
        
        setInvoices(mockInvoices);
        setLoading(false);
      } catch (err) {
        setError('Error loading invoice data');
        setLoading(false);
      }
    }, 1000);
  }, []);

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleAddInvoice = () => {
    alert('Add invoice functionality will be implemented here');
  };

  if (loading) {
    return <div className="loading">Loading invoice data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="invoice-manager">
      <div className="invoice-manager-header">
        <h2>Invoice Management</h2>
        <button className="btn btn-primary" onClick={handleAddInvoice}>Create New Invoice</button>
      </div>
      
      <div className="invoice-content">
        <div className="invoice-list">
          <h3>Invoices</h3>
          {invoices.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr 
                    key={invoice.id}
                    onClick={() => handleInvoiceSelect(invoice)}
                    className={selectedInvoice && selectedInvoice.id === invoice.id ? 'selected' : ''}
                  >
                    <td>{invoice.client_name}</td>
                    <td>${parseFloat(invoice.amount).toFixed(2)}</td>
                    <td><span className={`status ${invoice.status}`}>{invoice.status}</span></td>
                    <td>{new Date(invoice.due_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No invoices found</p>
          )}
        </div>
        
        {selectedInvoice && (
          <div className="invoice-details">
            <div className="invoice-header">
              <h3>Invoice #{selectedInvoice.id} - {selectedInvoice.client_name}</h3>
              <div className="invoice-actions">
                <button className="btn btn-primary">Edit</button>
                <button className="btn btn-outline">Download PDF</button>
              </div>
            </div>
            <div className="invoice-info">
              <div className="info-row">
                <strong>Status:</strong>
                <span><span className={`status ${selectedInvoice.status}`}>{selectedInvoice.status}</span></span>
              </div>
              <div className="info-row">
                <strong>Amount:</strong>
                <span>${parseFloat(selectedInvoice.amount).toFixed(2)}</span>
              </div>
              <div className="info-row">
                <strong>Issue Date:</strong>
                <span>{new Date(selectedInvoice.issue_date).toLocaleDateString()}</span>
              </div>
              <div className="info-row">
                <strong>Due Date:</strong>
                <span>{new Date(selectedInvoice.due_date).toLocaleDateString()}</span>
              </div>
              <div className="info-row">
                <strong>Description:</strong>
                <span>{selectedInvoice.description}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceManager; 