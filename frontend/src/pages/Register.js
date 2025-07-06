import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
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
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <form
        className="card"
        style={{ width: 340, margin: "0 auto" }}
        onSubmit={handleSubmit}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Register</h2>
        {error && <div style={{ color: "#dc2626", marginBottom: 12 }}>{error}</div>}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginBottom: 16, width: "100%" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ marginBottom: 16, width: "100%" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ marginBottom: 16, width: "100%" }}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          style={{ marginBottom: 16, width: "100%" }}
        />
        <button type="submit" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <div style={{ marginTop: 18, textAlign: "center", fontSize: 14 }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </main>
  );
};
export default Register;