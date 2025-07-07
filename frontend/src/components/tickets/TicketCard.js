import React from "react";
import { useNavigate } from "react-router-dom";

const statusColors = {
  open: {
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    bg: "rgba(16, 185, 129, 0.1)",
    text: "#059669"
  },
  "in-progress": {
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    bg: "rgba(245, 158, 11, 0.1)",
    text: "#d97706"
  },
  resolved: {
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    bg: "rgba(59, 130, 246, 0.1)",
    text: "#2563eb"
  },
  closed: {
    gradient: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
    bg: "rgba(107, 114, 128, 0.1)",
    text: "#4b5563"
  }
};

const priorityConfig = {
  low: { color: "#6b7280", emoji: "🔵" },
  medium: { color: "#f59e0b", emoji: "🟡" },
  high: { color: "#ef4444", emoji: "🟠" },
  urgent: { color: "#dc2626", emoji: "🔴" }
};

const categoryIcons = {
  technical: "⚙️",
  billing: "💳",
  general: "💬",
  bug: "🐛"
};

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();
  const statusConfig = statusColors[ticket.status] || statusColors.open;
  const priority = priorityConfig[ticket.priority] || priorityConfig.medium;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: "var(--space-6)",
        cursor: "pointer",
        borderLeft: `4px solid ${statusConfig.text}`,
        transition: "all var(--transition)",
        background: "var(--surface)",
        position: "relative",
        overflow: "hidden"
      }}
      onClick={() => navigate(`/tickets/${ticket._id}`)}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "var(--shadow)";
      }}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div style={{ flex: 1 }}>
          {/* Title */}
          <h3 className="text-xl font-semibold" style={{ 
            marginBottom: "var(--space-2)",
            lineHeight: "var(--leading-tight)",
            color: "var(--text)"
          }}>
            {ticket.title}
          </h3>
          
          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-sm text-muted" style={{ 
            marginBottom: "var(--space-3)"
          }}>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: "16px" }}>{categoryIcons[ticket.category] || "📋"}</span>
              <span style={{ textTransform: "capitalize" }}>{ticket.category}</span>
            </div>
            
            <div className="flex items-center gap-1">
              {priority.emoji}
              <span style={{ 
                color: priority.color,
                fontWeight: "var(--font-medium)",
                textTransform: "capitalize"
              }}>
                {ticket.priority}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              {formatDate(ticket.createdAt)}
            </div>
            
            <div style={{ color: "var(--text-light)", fontSize: "var(--text-xs)" }}>
              #{ticket._id.slice(-6)}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div style={{
          background: statusConfig.bg,
          backdropFilter: "blur(10px)",
          border: `1px solid ${statusConfig.text}33`,
          borderRadius: "var(--radius-full)",
          padding: "var(--space-2) var(--space-4)",
          fontSize: "var(--text-xs)",
          fontWeight: "var(--font-semibold)",
          color: statusConfig.text,
          textTransform: "uppercase",
          letterSpacing: "0.025em",
          whiteSpace: "nowrap"
        }}>
          {ticket.status.replace("-", " ")}
        </div>
      </div>

      {/* Description */}
      <div style={{
        color: "var(--text-secondary)",
        fontSize: "var(--text-base)",
        lineHeight: "var(--leading-relaxed)",
        marginBottom: "var(--space-4)"
      }}>
        {ticket.description.length > 150
          ? ticket.description.slice(0, 150) + "..."
          : ticket.description}
      </div>

      {/* Footer Row */}
      <div className="flex items-center justify-between">
        {/* Left side - User & Assignment */}
        <div className="flex items-center gap-4">
          {/* Created by User */}
          <div className="flex items-center gap-2">
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "var(--radius-full)",
              background: "var(--primary-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-semibold)"
            }}>
              {ticket.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div style={{ fontSize: "var(--text-sm)" }}>
              <div style={{ fontWeight: "var(--font-medium)", color: "var(--text)" }}>
                {ticket.user?.name || "Unknown User"}
              </div>
              {ticket.assignedTo && (
                <div style={{ 
                  fontSize: "var(--text-xs)", 
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-1)"
                }}>
                  <span>→</span>
                  <span>{ticket.assignedTo.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Stats */}
        <div className="flex items-center gap-4">
          {/* Comments Count */}
          {ticket.comments && ticket.comments.length > 0 && (
            <div className="flex items-center gap-1" style={{ 
              color: "var(--text-muted)",
              fontSize: "var(--text-sm)"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>{ticket.comments.length}</span>
            </div>
          )}

          {/* Images Indicator */}
          {ticket.images && ticket.images.length > 0 && (
            <div className="flex items-center gap-1" style={{ 
              color: "var(--text-muted)",
              fontSize: "var(--text-sm)"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              <span>{ticket.images.length}</span>
            </div>
          )}

          {/* Arrow Indicator */}
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ 
              color: "var(--text-muted)",
              transition: "transform var(--transition-fast)"
            }}
          >
            <polyline points="9,18 15,12 9,6"/>
          </svg>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "100px",
        height: "100px",
        background: statusConfig.gradient,
        opacity: 0.03,
        borderRadius: "0 var(--radius-md) 0 100%",
        pointerEvents: "none"
      }} />
    </div>
  );
};

export default TicketCard;
