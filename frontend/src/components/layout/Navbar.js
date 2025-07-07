import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../ui/Logo";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsUserMenuOpen(false);
  };

  return (
    <nav style={{
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border-light)",
      padding: "var(--space-4) 0",
      position: "sticky",
      top: 0,
      zIndex: "var(--z-sticky)",
      boxShadow: "var(--shadow-sm)"
    }}>
      <div className="container flex items-center justify-between">
        {/* Logo & Brand */}
        <Link 
          to="/" 
          style={{ 
            textDecoration: "none"
          }}
        >
          <Logo 
            size="md" 
            animated={true}
            onClick={() => {}}
          />
        </Link>

        {/* Navigation & User Menu */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Navigation Links */}
              <div className="flex items-center gap-1">
                <Link 
                  to="/dashboard"
                  style={{
                    padding: "var(--space-2) var(--space-4)",
                    borderRadius: "var(--radius)",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-medium)",
                    transition: "all var(--transition-fast)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--bg-secondary)";
                    e.target.style.color = "var(--text)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "var(--text-secondary)";
                  }}
                >
                  Dashboard
                </Link>
                
                {user.role === "customer" && (
                  <Link 
                    to="/tickets/new"
                    style={{
                      padding: "var(--space-2) var(--space-4)",
                      borderRadius: "var(--radius)",
                      background: "var(--primary-gradient)",
                      color: "white",
                      textDecoration: "none",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-medium)",
                      boxShadow: "var(--shadow-sm)",
                      transition: "all var(--transition-fast)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "var(--shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "var(--shadow-sm)";
                    }}
                  >
                    + New Ticket
                  </Link>
                )}

                {user.role === "admin" && (
                  <Link 
                    to="/admin/users"
                    style={{
                      padding: "var(--space-2) var(--space-4)",
                      borderRadius: "var(--radius)",
                      background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                      color: "white",
                      textDecoration: "none",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-medium)",
                      boxShadow: "var(--shadow-sm)",
                      transition: "all var(--transition-fast)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "var(--shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "var(--shadow-sm)";
                    }}
                  >
                    <span>👑</span>
                    Manage Users
                  </Link>
                )}
              </div>

              {/* User Menu */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "var(--space-2)",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    boxShadow: "var(--shadow-sm)",
                    transition: "all var(--transition-fast)",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                    e.target.style.boxShadow = "var(--shadow-md)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.boxShadow = "var(--shadow-sm)";
                  }}
                >
                  {/* User Avatar */}
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--primary-gradient)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-semibold)"
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* User Info */}
                  <div style={{ textAlign: "left" }}>
                    <div className="text-sm font-medium" style={{ lineHeight: 1.2 }}>
                      {user.name}
                    </div>
                    <div style={{ 
                      fontSize: "var(--text-xs)",
                      color: "var(--text-muted)",
                      textTransform: "capitalize",
                      lineHeight: 1
                    }}>
                      {user.role}
                    </div>
                  </div>
                  
                  {/* Dropdown Arrow */}
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{
                      color: "var(--text-muted)",
                      transform: isUserMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform var(--transition-fast)"
                    }}
                  >
                    <polyline points="6,9 12,15 18,9"/>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + var(--space-2))",
                    right: 0,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-lg)",
                    padding: "var(--space-2)",
                    minWidth: "200px",
                    zIndex: "var(--z-dropdown)",
                    backdropFilter: "blur(20px)"
                  }}>
                    <div style={{
                      padding: "var(--space-3) var(--space-4)",
                      borderBottom: "1px solid var(--border-light)",
                      marginBottom: "var(--space-2)"
                    }}>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-muted">{user.email}</div>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--radius)",
                        border: "none",
                        background: "transparent",
                        color: "var(--error)",
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-medium)",
                        cursor: "pointer",
                        transition: "all var(--transition-fast)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "var(--bg-secondary)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16,17 21,12 16,7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login"
                className="ghost"
                style={{
                  padding: "var(--space-2) var(--space-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-medium)"
                }}
              >
                Sign In
              </Link>
              <Link 
                to="/register"
                style={{
                  padding: "var(--space-2) var(--space-4)",
                  background: "var(--primary-gradient)",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "var(--radius)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-medium)",
                  boxShadow: "var(--shadow-sm)",
                  transition: "all var(--transition-fast)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Backdrop for dropdown */}
      {isUserMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: "calc(var(--z-dropdown) - 1)"
          }}
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
