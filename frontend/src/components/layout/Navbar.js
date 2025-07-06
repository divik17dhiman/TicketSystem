import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      padding: "0.5rem 0"
    }}>
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0 1rem"
      }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 22, color: "var(--primary)" }}>
          TicketPro
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {user.role === "customer" && <Link to="/tickets/new">New Ticket</Link>}
              <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
                {user.name} ({user.role})
              </span>
              <button
                className="secondary"
                style={{ padding: "0.5em 1em" }}
                onClick={() => { logout(); navigate("/login"); }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
