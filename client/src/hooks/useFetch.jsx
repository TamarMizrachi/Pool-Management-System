import { useState } from 'react';

function useFetch() {
  const [loading, setLoading] = useState(false);

  // פונקציה גנרית לביצוע כל סוגי הבקשות (GET, POST, PUT, DELETE)
  const sendRequest = async (url, method = 'GET', body = null, requireAuth = false) => {
    setLoading(true);
    
    // הגדרת ה-Headers הבסיסיים
    const headers = {
      'Content-Type': 'application/json',
    };

    // אם הבקשה דורשת אימות, נשלוף את הטוקן ונצמיד אותו אוטומטית!
    if (requireAuth) {
      const token = localStorage.getItem('pool_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // הגדרת האופציות של ה-fetch
    const config = {
      method,
      headers,
    };

    // אם יש Body (למשל ב-POST), נוסיף אותו לבקשה
    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`http://localhost:5000${url}`, config);
      const data = await response.json();

      if (!response.ok) {
        // אם השרת החזיר שגיאה (למשל 400 או 401), נזרוק אותה כדי שהקומפוננטה תתפוס
        throw new Error(data.message || 'משהו השתבש בשרת');
      }

      setLoading(false);
      return data; // מחזיר את הנתונים המוכנים כשהכל הצליח

    } catch (err) {
      setLoading(false);
      throw err; // מעביר את השגיאה הלאה לקומפוננטה כדי שתציג למשתמש
    }
  };

  return { sendRequest, loading };
}

export default useFetch;