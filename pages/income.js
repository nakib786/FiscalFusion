import React, { useEffect, useState } from 'react';

const IncomePage = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchIncome = async () => {
      setLoading(true);
      
      try {
        // Try to fetch from API
        const response = await fetch('/api/income');
        const responseText = await response.text();
        
        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Invalid JSON from income API:', responseText);
          throw new Error('Invalid JSON response from API');
        }
        
        if (data && data.data) {
          setIncomeData(data.data);
          
          // If using mock data, show a notice
          if (data.source && data.source.includes('mock')) {
            setErrorMsg('Using mock data - API connection failed');
          }
        } else {
          // API didn't return expected data format
          throw new Error('API returned unexpected data format');
        }
      } catch (err) {
        console.error('Error fetching income data:', err);
        setErrorMsg('Using mock data - API connection failed');
        
        // Use mock data as fallback
        setIncomeData([
          { id: 1, date: '2023-08-15', amount: 5000.00, source: 'Sales', description: 'Product sales' },
          { id: 2, date: '2023-08-10', amount: 3000.00, source: 'Consulting', description: 'IT consulting services' },
          { id: 3, date: '2023-08-05', amount: 2500.00, source: 'Subscription', description: 'Monthly software subscriptions' },
          { id: 4, date: '2023-08-01', amount: 4500.00, source: 'Services', description: 'Professional services' },
          { id: 5, date: '2023-07-25', amount: 1800.00, source: 'Royalties', description: 'Book royalties' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, []);

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default IncomePage; 