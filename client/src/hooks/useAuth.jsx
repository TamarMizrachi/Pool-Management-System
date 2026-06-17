import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// פונקציה גנרית המאפשרת שליפה מהירה של נתוני האימות
function useAuth() {
  const context = useContext(AuthContext);
  
  // הגנה: אם שכחנו לעטוף את האפליקציה ב-Provider, המערכת תתריע מיד
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default useAuth;