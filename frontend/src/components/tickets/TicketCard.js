import React from "react";
import { useNavigate } from "react-router-dom";

const statusColors = {
  open: "#059669",
  "in-progress": "#d97706",
  resolved: "#2563eb",
  closed: "#6b7280"
};

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();
  return (
    <div
      className="card"
      style={{
        cursor: "pointer",
        borderLeft: `4px solid ${statusColors[ticket.status] || "#6b7280"}`,
        transition: "box-shadow 0.18s cubic-bezier(.4,0,.2,1)",
        boxShadow: "var(--shadow)"
      }}
      onClick={() => navigate(`/tickets/${ticket._id}`)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{ticket.title}</div>
          <div style={{ color: "var(--text-muted)", fontSize: 14 }}>
            #{ticket._id.slice(-6)} &middot; {ticket.category} &middot; {ticket.priority}
          </div>
        </div>
        <span style={{
          background: statusColors[ticket.status] + "22",
          color: statusColors[ticket.status],
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 500,
          padding: "0.2em 0.8em"
        }}>
          {ticket.status.replace("-", " ")}
        </span>
      </div>
      <div style={{
        color: "var(--text-muted)",
        fontSize: 15,
        margin: "1em 0 0.5em 0"
      }}>
        {ticket.description.length > 120
          ? ticket.description.slice(0, 120) + "..."
          : ticket.description}
      </div>
      
      {/* Image indicator */}
      {ticket.images && ticket.images.length > 0 && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.25rem', 
          fontSize: 12, 
          color: 'var(--text-muted)',
          marginTop: '0.5rem'
        }}>
          <svg style={{ width: 16, height: 16 }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span>{ticket.images.length} attachment{ticket.images.length !== 1 ? 's' : ''}</span>
        </div>
      )}
      
      <div style={{ fontSize: 13, color: "#aaa", marginTop: '0.5rem' }}>
        Created: {new Date(ticket.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};
export default TicketCard;
