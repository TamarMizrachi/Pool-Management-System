import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import './AuthForm.css';

function AuthForm() {
  const { loginSuccess } = useAuth();
  const { sendRequest, loading } = useFetch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const bodyData = isLogin ? { email, password } : { fullName, email, password };

    try {
      const data = await sendRequest(endpoint, 'POST', bodyData, false);

      if (isLogin) {
        loginSuccess(data.token, data.user);
        navigate('/');
      } else {
        alert('הרישום בוצע בהצלחה!');
        navigate('/');

      }
    } catch (err) {
      setErrorMessage(err.message || 'שגיאה בחיבור לשרת');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">
        {isLogin ? 'התחברות למערכת' : 'הרשמה למערכת'}
      </h2>

      {errorMessage && <p className="auth-error">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>שם מלא:</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={loading} />
          </div>
        )}

        <div className="form-group">
          <label>כתובת אימייל:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
        </div>

        <div className="form-group">
          <label>סיסמה:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'מבצע פעולה...' : (isLogin ? 'התחבר' : 'בצע הרשמה')}
        </button>
      </form>

      <div className="auth-toggle-mode">
        {isLogin ? (
          <p>עדיין אין לכם מנוי? <span onClick={() => { if (!loading) { setIsLogin(false); setErrorMessage(''); } }}>הרשמו כאן</span></p>
        ) : (
          <p>כבר רשומים במערכת? <span onClick={() => { if (!loading) { setIsLogin(true); setErrorMessage(''); } }}>התחברו כאן</span></p>
        )}
      </div>
    </div>
  );
}

export default AuthForm;