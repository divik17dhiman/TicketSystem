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

  const categoryOptions = [
    { value: "general", label: "General Support", icon: "💬", description: "General questions and assistance" },
    { value: "technical", label: "Technical Issue", icon: "⚙️", description: "Technical problems and bugs" },
    { value: "billing", label: "Billing & Payments", icon: "💳", description: "Billing questions and payment issues" },
    { value: "bug", label: "Bug Report", icon: "🐛", description: "Report software bugs and errors" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low", icon: "🔵", description: "Non-urgent, can wait" },
    { value: "medium", label: "Medium", icon: "🟡", description: "Normal priority" },
    { value: "high", label: "High", icon: "🟠", description: "Important, needs attention soon" },
    { value: "urgent", label: "Urgent", icon: "🔴", description: "Critical issue, immediate attention needed" }
  ];

  return (
    <div style={{ 
      background: "var(--bg)", 
      minHeight: "100vh", 
      padding: "var(--space-8) 0"
    }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
          <div style={{
            width: "72px",
            height: "72px",
            background: "var(--primary-gradient)",
            borderRadius: "var(--radius-xl)",
            margin: "0 auto var(--space-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-lg)"
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold" style={{ 
            marginBottom: "var(--space-2)",
            background: "var(--primary-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Create Support Ticket
          </h1>
          <p className="text-lg text-muted">
            Describe your issue and we'll get back to you as soon as possible
          </p>
        </div>

        {/* Back Button */}
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

        {/* Form Card */}
        <div className="card animate-slide-up" style={{ 
          padding: "var(--space-10)",
          maxWidth: "none",
          margin: 0
        }}>
          {error && (
            <div style={{ 
              background: "var(--error-gradient)",
              color: "white",
              padding: "var(--space-4)",
              borderRadius: "var(--radius)",
              fontSize: "var(--text-sm)",
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

          <form onSubmit={handleSubmit}>
            {/* Title Field */}
            <div style={{ marginBottom: "var(--space-8)" }}>
              <label className="text-base font-semibold" style={{ 
                display: "block", 
                marginBottom: "var(--space-3)",
                color: "var(--text)"
              }}>
                What's the issue? *
              </label>
              <input
                type="text"
                name="title"
                placeholder="Brief description of your problem..."
                value={form.title}
                onChange={handleChange}
                required
                style={{ 
                  width: "100%",
                  marginBottom: 0,
                  fontSize: "var(--text-lg)",
                  padding: "var(--space-4) var(--space-5)"
                }}
              />
            </div>

            {/* Description Field */}
            <div style={{ marginBottom: "var(--space-8)" }}>
              <label className="text-base font-semibold" style={{ 
                display: "block", 
                marginBottom: "var(--space-3)",
                color: "var(--text)"
              }}>
                Tell us more about it *
              </label>
              <textarea
                name="description"
                placeholder="Provide detailed information about your issue. Include steps to reproduce, error messages, or any other relevant details..."
                value={form.description}
                onChange={handleChange}
                required
                rows={6}
                style={{ 
                  width: "100%",
                  marginBottom: 0,
                  fontSize: "var(--text-base)",
                  padding: "var(--space-4) var(--space-5)",
                  lineHeight: "var(--leading-relaxed)",
                  resize: "vertical"
                }}
              />
              <div style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-muted)",
                marginTop: "var(--space-2)"
              }}>
                The more details you provide, the faster we can help you
              </div>
            </div>

            {/* Category Selection */}
            <div style={{ marginBottom: "var(--space-8)" }}>
              <label className="text-base font-semibold" style={{ 
                display: "block", 
                marginBottom: "var(--space-3)",
                color: "var(--text)"
              }}>
                Category
              </label>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "var(--space-3)"
              }}>
                {categoryOptions.map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "var(--space-4)",
                      border: `2px solid ${form.category === option.value ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "var(--radius)",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                      background: form.category === option.value ? "rgba(59, 130, 246, 0.05)" : "var(--surface)"
                    }}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={option.value}
                      checked={form.category === option.value}
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: "20px" }}>{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <span className="text-sm text-muted">{option.description}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Selection */}
            <div style={{ marginBottom: "var(--space-8)" }}>
              <label className="text-base font-semibold" style={{ 
                display: "block", 
                marginBottom: "var(--space-3)",
                color: "var(--text)"
              }}>
                Priority Level
              </label>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "var(--space-3)"
              }}>
                {priorityOptions.map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "var(--space-4)",
                      border: `2px solid ${form.priority === option.value ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "var(--radius)",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                      background: form.priority === option.value ? "rgba(59, 130, 246, 0.05)" : "var(--surface)",
                      textAlign: "center"
                    }}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={option.value}
                      checked={form.priority === option.value}
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span style={{ fontSize: "18px" }}>{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <span className="text-xs text-muted">{option.description}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: "var(--space-10)" }}>
              <label className="text-base font-semibold" style={{ 
                display: "block", 
                marginBottom: "var(--space-3)",
                color: "var(--text)"
              }}>
                Attachments (Optional)
              </label>
              <div style={{
                background: "var(--bg-secondary)",
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-6)"
              }}>
                <ImageUpload
                  onImagesUploaded={handleImagesUploaded}
                  multiple={true}
                  existingImages={form.images}
                />
              </div>
              <div style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-muted)",
                marginTop: "var(--space-2)"
              }}>
                Add screenshots, error messages, or other relevant files to help us understand your issue
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  flex: 1,
                  padding: "var(--space-4) var(--space-8)",
                  fontSize: "var(--text-lg)",
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
                {loading ? "Creating Ticket..." : "Submit Ticket"}
              </button>
              
              <button 
                type="button"
                onClick={() => navigate("/dashboard")}
                className="outline"
                style={{ 
                  padding: "var(--space-4) var(--space-6)",
                  fontSize: "var(--text-lg)",
                  fontWeight: "var(--font-semibold)"
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;
