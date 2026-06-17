import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';

import logoImg from '../../assets/poolhub-logo.png';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav className="navbar-container">
      
      {/* צד ימין: לוגו האתר המפנה לעמוד הבית */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logoImg} alt="PoolHub Logo" className="navbar-logo-img" />
        </Link>
      </div>

      {/* מרכז: קישורי ניווט פנימיים לדף הבית - הוספנו כאן את הקישור ללוח השנה! */}
      {isHomePage && (
        <div className="navbar-internal-links">
          <a href="#about" className="nav-item">עלינו</a>
          <a href="#media" className="nav-item">סיור ומדיה</a>
          <a href="#schedule-section" className="nav-item">לוח שעות ורישום</a> {/* הקישור החדש! */}
          <a href="#testimonials" className="nav-item">המלצות</a>
          <a href="#safety" className="nav-item">כללי בטיחות</a>
        </div>
      )}

      <div className="navbar-links">
        {location.pathname !== '/' && <Link to="/" className="nav-item-link">חזרה לעמוד הבית</Link>}
        
        {user ? (
          <>
            <span 
              className="nav-welcome" 
              onClick={() => navigate('/profile')} 
              style={{ cursor: 'pointer' }}
              title="לחץ למעבר לאזור אישי"
            >
              שלום, {user.fullName} 👤
            </span>
            <button className="nav-btn logout-btn" onClick={handleLogoutClick}>התנתק</button>
          </>
        ) : (
          <>
            <button className="nav-btn login-btn" onClick={() => navigate('/auth')}>התחברות / הרשמה</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;