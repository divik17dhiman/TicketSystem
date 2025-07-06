import React, { useState } from "react";
import { useTickets } from "../context/TicketContext";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";

const TicketForm = () => {
  const { createTicket } = useTickets();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium",
    images: []
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImagesUploaded = (images) => {
    setForm({ ...form, images: images });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required");
      setLoading(false);
      return;
    }
    const result = await createTicket(form);
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
      <form className="card" style={{ width: 500 }} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>New Ticket</h2>
        {error && <div style={{ color: "#dc2626", marginBottom: 12 }}>{error}</div>}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{ marginBottom: 16, width: "100%" }}
        />
        <textarea
          name="description"
          placeholder="Describe your issue"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          style={{ marginBottom: 16, width: "100%" }}
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={{ marginBottom: 16, width: "100%" }}
        >
          <option value="general">General</option>
          <option value="technical">Technical</option>
          <option value="billing">Billing</option>
          <option value="bug">Bug Report</option>
        </select>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          style={{ marginBottom: 16, width: "100%" }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        
        <ImageUpload
          onImagesUploaded={handleImagesUploaded}
          multiple={true}
          existingImages={form.images}
        />
        
        <button type="submit" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Creating..." : "Create Ticket"}
        </button>
        <button
          type="button"
          className="secondary"
          style={{ width: "100%", marginTop: 10 }}
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </button>
      </form>
    </main>
  );
};
export default TicketForm;
