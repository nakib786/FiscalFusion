import React, { useState, useEffect } from 'react';

function ClientManager() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState('view'); // 'view', 'add', 'edit'
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    // Fetch clients data - using mock data for now
    setLoading(true);
    
    setTimeout(() => {
      try {
        const mockClients = [
          { 
            id: 1, 
            name: 'Acme Corporation', 
            email: 'billing@acme.com', 
            phone: '555-123-4567', 
            address: '123 Business Ave, Suite 100, Corporate City, 12345',
            notes: 'Net 30 payment terms'
          },
          { 
            id: 2, 
            name: 'Globex Inc', 
            email: 'accounts@globex.com', 
            phone: '555-987-6543', 
            address: '456 Industry Blvd, Enterprise Town, 67890',
            notes: 'Prefer electronic invoices'
          },
          { 
            id: 3, 
            name: 'Stark Industries', 
            email: 'finance@stark.com', 
            phone: '555-789-0123', 
            address: '789 Innovation Road, Tech City, 54321',
            notes: 'Attention to Tony Stark'
          },
          { 
            id: 4, 
            name: 'Wayne Enterprises', 
            email: 'payments@wayne.com', 
            phone: '555-246-8102', 
            address: '1007 Gotham Plaza, Gotham City, 13579',
            notes: 'Contact Bruce for urgent matters'
          },
          { 
            id: 5, 
            name: 'Oscorp', 
            email: 'billing@oscorp.com', 
            phone: '555-369-1478', 
            address: '42 Science Way, Research Park, 97531',
            notes: 'Always pay on time'
          }
        ];
        
        setClients(mockClients);
        setLoading(false);
      } catch (err) {
        setError('Error loading client data');
        setLoading(false);
      }
    }, 1000);
  }, []);

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setFormMode('view');
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    });
    setFormMode('add');
  };

  const handleEditClient = () => {
    setNewClient({ ...selectedClient });
    setFormMode('edit');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({
      ...newClient,
      [name]: value
    });
  };

  const handleSaveClient = () => {
    // In a real app, this would send data to the API
    if (formMode === 'add') {
      // Add new client
      const newClientWithId = {
        ...newClient,
        id: clients.length + 1 // In a real app, the API would assign an ID
      };
      setClients([...clients, newClientWithId]);
      setSelectedClient(newClientWithId);
    } else if (formMode === 'edit') {
      // Update existing client
      const updatedClients = clients.map(client => 
        client.id === selectedClient.id ? { ...newClient } : client
      );
      setClients(updatedClients);
      setSelectedClient(newClient);
    }
    setFormMode('view');
  };

  const handleCancelForm = () => {
    if (selectedClient) {
      setFormMode('view');
    } else {
      setFormMode('view');
      setSelectedClient(clients[0] || null);
    }
  };

  const renderClientForm = () => {
    return (
      <form className="client-form">
        <div className="form-group">
          <label className="form-label" htmlFor="name">Client Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={newClient.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={newClient.email}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            className="form-control"
            value={newClient.phone}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            className="form-control"
            value={newClient.address}
            onChange={handleInputChange}
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            className="form-control"
            value={newClient.notes}
            onChange={handleInputChange}
            rows="2"
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleSaveClient}
          >
            {formMode === 'add' ? 'Create Client' : 'Update Client'}
          </button>
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={handleCancelForm}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const renderClientDetails = () => {
    if (!selectedClient) return null;
    
    return (
      <div className="client-details">
        <div className="client-header">
          <h3>{selectedClient.name}</h3>
          <button className="btn btn-primary" onClick={handleEditClient}>Edit Client</button>
        </div>
        
        <div className="client-info">
          <div className="info-row">
            <strong>Email:</strong>
            <span>{selectedClient.email}</span>
          </div>
          <div className="info-row">
            <strong>Phone:</strong>
            <span>{selectedClient.phone}</span>
          </div>
          <div className="info-row">
            <strong>Address:</strong>
            <span>{selectedClient.address}</span>
          </div>
          <div className="info-row">
            <strong>Notes:</strong>
            <span>{selectedClient.notes}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading client data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="client-manager">
      <div className="client-manager-header">
        <h2>Client Management</h2>
        <button className="btn btn-primary" onClick={handleAddClient}>Add New Client</button>
      </div>
      
      <div className="client-content">
        <div className="client-list">
          <h3>Clients</h3>
          {clients.length > 0 ? (
            <ul className="clients-list">
              {clients.map(client => (
                <li 
                  key={client.id} 
                  className={selectedClient && selectedClient.id === client.id ? 'active' : ''}
                  onClick={() => handleClientSelect(client)}
                >
                  {client.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No clients found</p>
          )}
        </div>
        
        <div className="client-detail-panel">
          {formMode === 'view' ? (
            selectedClient ? renderClientDetails() : <p className="no-selection">Select a client to view details</p>
          ) : (
            renderClientForm()
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientManager; 