import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

function AdminPanel() {
  const { currentUser, hasRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeUserId, setActiveUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    roles: []
  });

  useEffect(() => {
    if (currentUser && hasRole('admin')) {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setActiveUserId(user.id);
    setUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      companyName: user.companyName || '',
      roles: user.roles || []
    });
    setActionType('edit');
    setModalOpen(true);
  };

  const handleAddUser = () => {
    setActiveUserId(null);
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      companyName: '',
      roles: ['user']
    });
    setActionType('add');
    setModalOpen(true);
  };

  const toggleUserRole = (role) => {
    setUserForm(prev => {
      const roles = [...prev.roles];
      const index = roles.indexOf(role);
      
      if (index >= 0) {
        roles.splice(index, 1);
      } else {
        roles.push(role);
      }
      
      return { ...prev, roles };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      let response;
      
      if (actionType === 'add') {
        // Add user
        response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...userForm,
            password: 'tempPassword123' // Temporary password
          })
        });
      } else {
        // Edit user
        response = await fetch(`http://localhost:5000/api/auth/users/${activeUserId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(userForm)
        });
      }
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save user');
      }
      
      // Reload users
      await fetchUsers();
      
      // Close modal
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.message || 'Failed to save user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        
        // Reload users
        await fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  if (!currentUser || !hasRole('admin')) {
    return (
      <div className="admin-unauthorized">
        <h2>Unauthorized Access</h2>
        <p>You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <button className="btn btn-primary" onClick={handleAddUser}>
          Add New User
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-content">
        <h3>User Management</h3>
        
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="user-list">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Roles</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.companyName || '-'}</td>
                    <td>
                      {user.roles?.map(role => (
                        <span className="role-badge" key={role}>
                          {role}
                        </span>
                      ))}
                    </td>
                    <td>{new Date(user.created).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === currentUser.id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{actionType === 'add' ? 'Add New User' : 'Edit User'}</h3>
              <button 
                className="modal-close"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-control"
                    value={userForm.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-control"
                    value={userForm.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={userForm.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  className="form-control"
                  value={userForm.companyName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">User Roles</label>
                <div className="role-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={userForm.roles.includes('user')}
                      onChange={() => toggleUserRole('user')}
                    />
                    <span>User</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={userForm.roles.includes('admin')}
                      onChange={() => toggleUserRole('admin')}
                    />
                    <span>Admin</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={userForm.roles.includes('manager')}
                      onChange={() => toggleUserRole('manager')}
                    />
                    <span>Manager</span>
                  </label>
                </div>
              </div>
              
              {actionType === 'add' && (
                <div className="form-info">
                  <p>A temporary password will be assigned to the new user. They will be asked to change it on first login.</p>
                </div>
              )}
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {actionType === 'add' ? 'Add User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel; 