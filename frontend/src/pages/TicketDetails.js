import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTickets } from "../context/TicketContext";
import CommentSection from "../components/tickets/CommentSection";
import ImageModal from "../components/ImageModal";

const statusColors = {
  open: "#059669",
  "in-progress": "#d97706",
  resolved: "#2563eb",
  closed: "#6b7280"
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

  if (!ticket) return <div style={{ textAlign: "center", marginTop: 60 }}>Loading...</div>;

  return (
    <main style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <button
        className="secondary"
        style={{ marginBottom: 24 }}
        onClick={() => navigate("/dashboard")}
      >
        ← Back
      </button>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ margin: 0 }}>{ticket.title}</h2>
            <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 8 }}>
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
        <div style={{ margin: "1.5em 0", color: "var(--text-muted)" }}>
          {ticket.description}
        </div>
        {ticket.images && ticket.images.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Attachments:</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {ticket.images.map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000${img.url}`}
                  alt={img.originalName}
                  onClick={() => openImageModal(ticket.images, i)}
                  style={{
                    width: 90,
                    height: 90,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div style={{ marginTop: 24 }}>
          <label style={{ fontWeight: 500, marginRight: 8 }}>Status:</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            style={{ padding: "0.5em 1em", borderRadius: 8, border: "1px solid var(--border)" }}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <button
            style={{ marginLeft: 12 }}
            disabled={loading || status === ticket.status}
            onClick={handleStatusUpdate}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
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
      {error && <div style={{ color: "#dc2626", marginTop: 16 }}>{error}</div>}
      
      {/* Image Modal */}
      <ImageModal
        images={modalImages}
        currentIndex={modalCurrentIndex}
        isOpen={isModalOpen}
        onClose={closeImageModal}
      />
    </main>
  );
};
export default TicketDetails;