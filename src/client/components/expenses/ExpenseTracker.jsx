import React, { useState, useEffect } from 'react';

function ExpenseTracker() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    // Simulate fetching expenses data
    setTimeout(() => {
      try {
        const mockExpenses = [
          { id: 1, category: 'Office Supplies', amount: '120.50', date: '2023-08-18', vendor: 'Staples', description: 'Paper, pens, and other office essentials' },
          { id: 2, category: 'Software', amount: '499.99', date: '2023-08-15', vendor: 'Adobe', description: 'Annual subscription for Creative Cloud' },
          { id: 3, category: 'Utilities', amount: '200.00', date: '2023-08-10', vendor: 'Electric Company', description: 'Monthly electricity bill' },
          { id: 4, category: 'Travel', amount: '350.75', date: '2023-08-05', vendor: 'Airline Inc', description: 'Flight tickets for business trip' },
          { id: 5, category: 'Marketing', amount: '750.00', date: '2023-08-01', vendor: 'Ad Agency', description: 'Social media campaign' }
        ];
        
        setExpenses(mockExpenses);
        setLoading(false);
      } catch (err) {
        setError('Error loading expenses data');
        setLoading(false);
      }
    }, 1000);
  }, []);

  const handleExpenseSelect = (expense) => {
    setSelectedExpense(expense);
  };

  const handleAddExpense = () => {
    alert('Add expense functionality will be implemented here');
  };

  if (loading) {
    return <div className="loading">Loading expenses data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="expense-tracker">
      <div className="expense-manager-header">
        <h2>Expense Tracker</h2>
        <button className="btn btn-primary" onClick={handleAddExpense}>Add New Expense</button>
      </div>
      
      <div className="expense-content">
        <div className="expense-list">
          <h3>Expenses</h3>
          {expenses.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Vendor</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr 
                    key={expense.id}
                    onClick={() => handleExpenseSelect(expense)}
                    className={selectedExpense && selectedExpense.id === expense.id ? 'selected' : ''}
                  >
                    <td>{expense.category}</td>
                    <td>${parseFloat(expense.amount).toFixed(2)}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>{expense.vendor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No expenses found</p>
          )}
        </div>
        
        {selectedExpense && (
          <div className="expense-details">
            <div className="expense-header">
              <h3>{selectedExpense.category} - ${parseFloat(selectedExpense.amount).toFixed(2)}</h3>
              <button className="btn btn-primary">Edit</button>
            </div>
            <div className="expense-info">
              <div className="info-row">
                <strong>Vendor:</strong>
                <span>{selectedExpense.vendor}</span>
              </div>
              <div className="info-row">
                <strong>Date:</strong>
                <span>{new Date(selectedExpense.date).toLocaleDateString()}</span>
              </div>
              <div className="info-row">
                <strong>Description:</strong>
                <span>{selectedExpense.description}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseTracker; 