import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  const handleGuestLogin = () => {
    const result = guestLogin();
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      position: "relative"
    }}>
      {/* Background Pattern */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      <div className="card animate-scale-in" style={{ 
        width: "400px", 
        margin: "var(--space-4)",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <div style={{
            width: "64px",
            height: "64px",
            background: "var(--primary-gradient)",
            borderRadius: "var(--radius-xl)",
            margin: "0 auto var(--space-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-lg)"
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10,17 15,12 10,7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold" style={{ 
            marginBottom: "var(--space-2)",
            background: "var(--primary-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Welcome Back
          </h1>
                          <p className="text-muted">Sign in to your SupportFlow account</p>
        </div>

        {error && (
          <div style={{ 
            background: "var(--error-gradient)",
            color: "white",
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "var(--radius)",
            fontSize: "var(--text-sm)",
            marginBottom: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: "var(--space-6)" }}>
          <div style={{ marginBottom: "var(--space-6)" }}>
            <label className="text-sm font-medium" style={{ 
              display: "block", 
              marginBottom: "var(--space-2)",
              color: "var(--text-secondary)"
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ 
                width: "100%",
                marginBottom: 0,
                fontSize: "var(--text-base)",
                transition: "all var(--transition-fast)"
              }}
            />
          </div>
          
          <div style={{ marginBottom: "var(--space-6)" }}>
            <label className="text-sm font-medium" style={{ 
              display: "block", 
              marginBottom: "var(--space-2)",
              color: "var(--text-secondary)"
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ 
                width: "100%",
                marginBottom: 0,
                fontSize: "var(--text-base)"
              }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: "100%",
              padding: "var(--space-4) var(--space-6)",
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-semibold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-2)"
            }}
          >
            {loading && (
              <div className="loading-spinner"></div>
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        {/* Divider */}
        <div style={{ 
          position: "relative",
          textAlign: "center",
          marginBottom: "var(--space-6)"
        }}>
          <div style={{ 
            height: "1px", 
            background: "var(--border)", 
            width: "100%" 
          }}></div>
          <span style={{ 
            position: "absolute", 
            top: "-10px", 
            left: "50%", 
            transform: "translateX(-50%)", 
            background: "rgba(255, 255, 255, 0.95)", 
            padding: "0 var(--space-3)", 
            color: "var(--text-muted)", 
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-medium)"
          }}>
            or
          </span>
        </div>
        
        {/* Guest Login */}
        <button 
          type="button" 
          onClick={handleGuestLogin}
          className="outline"
          style={{ 
            width: "100%",
            marginBottom: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-2)"
          }}
        >
          <span style={{ fontSize: "18px" }}>🎯</span>
          Try Demo Mode
        </button>
        
        {/* Footer */}
        <div style={{ 
          textAlign: "center", 
          fontSize: "var(--text-sm)",
          color: "var(--text-muted)"
        }}>
          Don't have an account?{" "}
          <Link 
            to="/register" 
            style={{ 
              color: "var(--primary)",
              fontWeight: "var(--font-medium)",
              textDecoration: "none"
            }}
          >
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;