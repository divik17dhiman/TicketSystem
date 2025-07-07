import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const result = await register(form.name, form.email, form.password);
    setLoading(false);
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold" style={{ 
            marginBottom: "var(--space-2)",
            background: "var(--primary-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Create Account
          </h1>
                          <p className="text-muted">Join SupportFlow to streamline your support experience</p>
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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ 
                width: "100%",
                marginBottom: 0,
                fontSize: "var(--text-base)"
              }}
            />
          </div>

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
                fontSize: "var(--text-base)"
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
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
              minLength="6"
              style={{ 
                width: "100%",
                marginBottom: 0,
                fontSize: "var(--text-base)"
              }}
            />
            <div style={{
              fontSize: "var(--text-xs)",
              color: "var(--text-muted)",
              marginTop: "var(--space-1)"
            }}>
              Minimum 6 characters
            </div>
          </div>

          <div style={{ marginBottom: "var(--space-6)" }}>
            <label className="text-sm font-medium" style={{ 
              display: "block", 
              marginBottom: "var(--space-2)",
              color: "var(--text-secondary)"
            }}>
              Account Type
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{ 
                width: "100%",
                marginBottom: 0,
                fontSize: "var(--text-base)"
              }}
            >
              <option value="customer">Customer - Submit support tickets</option>
              <option value="agent">Agent - Handle customer support</option>
            </select>
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        {/* Footer */}
        <div style={{ 
          textAlign: "center", 
          fontSize: "var(--text-sm)",
          color: "var(--text-muted)"
        }}>
          Already have an account?{" "}
          <Link 
            to="/login" 
            style={{ 
              color: "var(--primary)",
              fontWeight: "var(--font-medium)",
              textDecoration: "none"
            }}
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;