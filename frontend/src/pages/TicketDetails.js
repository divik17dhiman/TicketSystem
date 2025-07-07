import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTickets } from "../context/TicketContext";
import CommentSection from "../components/tickets/CommentSection";
import ImageModal from "../components/ImageModal";
import TicketAssignment from "../components/tickets/TicketAssignment";
import { getImageUrl } from "../utils/api";

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

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTicketById, updateTicket, addComment, fetchTicketDetails } = useTickets();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalImages, setModalImages] = useState([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      let t = getTicketById(id);
      if (!t) {
        const result = await fetchTicketDetails(id);
        if (result.success) t = result.ticket;
      }
      setTicket(t);
      setStatus(t?.status || "");
    };
    load();
    // eslint-disable-next-line
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!ticket || status === ticket.status) return;
    setLoading(true);
    const result = await updateTicket(ticket._id, { status });
    setLoading(false);
    if (result.success) setTicket(result.ticket);
    else setError(result.message);
  };

  const openImageModal = (images, index) => {
    setModalImages(images);
    setModalCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-spinner" style={{ width: "40px", height: "40px" }}></div>
          <p className="text-muted">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  const statusConfig = statusColors[ticket.status] || statusColors.open;
  const priority = priorityConfig[ticket.priority] || priorityConfig.medium;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "900px", padding: "var(--space-8) var(--space-6)" }}>
        {/* Back Navigation */}
        <button
          onClick={() => navigate("/dashboard")}
          className="ghost"
          style={{
            marginBottom: "var(--space-8)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-4)"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          Back to Dashboard
        </button>

        {/* Main Ticket Card */}
        <div className="card animate-slide-up" style={{ 
          marginBottom: "var(--space-8)",
          borderLeft: `4px solid ${statusConfig.text}`
        }}>
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div style={{ flex: 1 }}>
              <h1 className="text-3xl font-bold" style={{ 
                marginBottom: "var(--space-3)",
                lineHeight: "var(--leading-tight)",
                color: "var(--text)"
              }}>
                {ticket.title}
              </h1>
              
              {/* Metadata Row */}
              <div className="flex items-center gap-6 text-sm text-muted" style={{ 
                marginBottom: "var(--space-4)"
              }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "18px" }}>{categoryIcons[ticket.category] || "📋"}</span>
                  <span style={{ textTransform: "capitalize", fontWeight: "var(--font-medium)" }}>
                    {ticket.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {priority.emoji}
                  <span style={{ 
                    color: priority.color,
                    fontWeight: "var(--font-medium)",
                    textTransform: "capitalize"
                  }}>
                    {ticket.priority} Priority
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              padding: "var(--space-3) var(--space-5)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-semibold)",
              color: statusConfig.text,
              textTransform: "uppercase",
              letterSpacing: "0.025em",
              whiteSpace: "nowrap"
            }}>
              {ticket.status.replace("-", " ")}
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex items-center gap-4 mb-6" style={{
            padding: "var(--space-4)",
            background: "var(--bg-secondary)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border-light)"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-full)",
              background: "var(--primary-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "var(--text-lg)",
              fontWeight: "var(--font-semibold)"
            }}>
              {ticket.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div className="font-semibold text-base">
                {ticket.user?.name || "Unknown User"}
              </div>
              <div className="text-sm text-muted">
                Ticket Creator • {ticket.user?.email}
              </div>
            </div>
            {ticket.assignedTo && (
              <>
                <div style={{ 
                  color: "var(--text-muted)",
                  fontSize: "var(--text-lg)",
                  margin: "0 var(--space-2)"
                }}>
                  →
                </div>
                <div className="flex items-center gap-3">
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--success-gradient)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "var(--text-base)",
                    fontWeight: "var(--font-semibold)"
                  }}>
                    {ticket.assignedTo.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">
                      {ticket.assignedTo.name}
                    </div>
                    <div className="text-sm text-muted">
                      Assigned Agent
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div style={{
            fontSize: "var(--text-lg)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--text-secondary)",
            marginBottom: "var(--space-6)",
            padding: "var(--space-4)",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border-light)"
          }}>
            {ticket.description}
          </div>

          {/* Attachments */}
          {ticket.images && ticket.images.length > 0 && (
            <div style={{ marginBottom: "var(--space-6)" }}>
              <h3 className="text-lg font-semibold mb-4">
                📎 Attachments ({ticket.images.length})
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "var(--space-4)"
              }}>
                {ticket.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => openImageModal(ticket.images, i)}
                    style={{
                      position: "relative",
                      borderRadius: "var(--radius)",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                      boxShadow: "var(--shadow-sm)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.02)';
                      e.target.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <img
                      src={getImageUrl(img.url)}
                      alt={img.originalName}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        border: "1px solid var(--border-light)"
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                      color: "white",
                      padding: "var(--space-2)",
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--font-medium)"
                    }}>
                      {img.originalName.length > 15 
                        ? img.originalName.substring(0, 15) + "..."
                        : img.originalName
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Update Section */}
          <div style={{
            background: "var(--bg-secondary)",
            borderRadius: "var(--radius)",
            padding: "var(--space-6)",
            border: "1px solid var(--border-light)"
          }}>
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-muted">
                Current Status:
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-medium)",
                  minWidth: "150px"
                }}
              >
                <option value="open">🔓 Open</option>
                <option value="in-progress">⚡ In Progress</option>
                <option value="resolved">✅ Resolved</option>
                <option value="closed">🔒 Closed</option>
              </select>
              
              <button
                onClick={handleStatusUpdate}
                disabled={loading || status === ticket.status}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-3) var(--space-6)",
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-semibold)"
                }}
              >
                {loading && <div className="loading-spinner" style={{ width: "16px", height: "16px" }}></div>}
                {loading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="card" style={{ 
            background: "var(--error-gradient)",
            color: "white",
            padding: "var(--space-4)",
            marginBottom: "var(--space-8)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}

        {/* Assignment Section */}
        <TicketAssignment 
          ticket={ticket}
          onUpdate={async (updateData) => {
            const result = await updateTicket(ticket._id, updateData);
            if (result.success) setTicket(result.ticket);
            return result;
          }}
        />

        {/* Comments Section */}
        <CommentSection 
          ticket={ticket} 
          onAddComment={async (msg, imgs) => {
            setLoading(true);
            const result = await addComment(ticket._id, msg, imgs);
            setLoading(false);
            if (result.success) setTicket(result.ticket);
            else setError(result.message);
          }} 
          onImageModalOpen={openImageModal}
          loading={loading} 
        />
        
        {/* Image Modal */}
        <ImageModal
          images={modalImages}
          currentIndex={modalCurrentIndex}
          isOpen={isModalOpen}
          onClose={closeImageModal}
        />
      </div>
    </div>
  );
};

export default TicketDetails;