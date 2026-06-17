import { useState } from 'react';

function useFetch() {
  const [loading, setLoading] = useState(false);

  const sendRequest = async (url, method = 'GET', body = null, requireAuth = false) => {
    
    setLoading(true);

    const headers = {
      'Content-Type': 'application/json',
    };

    if (requireAuth) {
      const token = localStorage.getItem('pool_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config = {
      method,
      headers,
    };
    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`http://localhost:5000${url}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'משהו השתבש בשרת');
      }

      setLoading(false);
      return data; 

    } catch (err) {
      setLoading(false);
      throw err; 
    }
  };

  return { sendRequest, loading };
}

export default useFetch;