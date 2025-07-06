import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          Ticket Support System
        </Link>
        
        {user && (
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            ☰
          </button>
        )}
        
        <div className="navbar-nav">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              {user.role === 'customer' && (
                <Link to="/tickets/new" className="nav-link">
                  New Ticket
                </Link>
              )}
              <span className="nav-link">
                {user.name} ({user.role})
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu */}
        {user && (
          <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>
              Dashboard
            </Link>
            {user.role === 'customer' && (
              <Link to="/tickets/new" className="nav-link" onClick={closeMobileMenu}>
                New Ticket
              </Link>
            )}
            <span className="nav-link">
              Welcome, {user.name}
            </span>
            <span className="nav-link" style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              Role: {user.role}
            </span>
            <button onClick={handleLogout} className="btn-logout" style={{ marginTop: '1rem' }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
