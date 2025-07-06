import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ImageUpload from "../ImageUpload";

const CommentSection = ({ 
  ticket, 
  onAddComment, 
  onImageModalOpen,
  loading = false 
}) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [commentImages, setCommentImages] = useState([]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    await onAddComment(comment, commentImages);
    setComment("");
    setCommentImages([]);
  };

  const handleImagesUploaded = (images) => {
    setCommentImages(images);
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin': 
        return { background: '#e74c3c', color: 'white' };
      case 'agent': 
        return { background: '#3498db', color: 'white' };
      default: 
        return { background: '#6c757d', color: 'white' };
    }
  };

  return (
    <div className="card" style={{ marginTop: 32 }}>
      <h3 style={{ margin: 0, marginBottom: 16 }}>Comments ({ticket.comments?.length || 0})</h3>
      
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="comment" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Add a comment
          </label>
          <textarea
            id="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your comment here..."
            style={{ 
              width: '100%', 
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: 8,
              resize: 'vertical'
            }}
          />
        </div>
        
        <ImageUpload
          onImagesUploaded={handleImagesUploaded}
          multiple={true}
          existingImages={commentImages}
        />
        
        <button 
          type="submit" 
          disabled={loading || !comment.trim()}
          style={{
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          {loading ? 'Adding...' : 'Add Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div>
        {ticket.comments && ticket.comments.length > 0 ? (
          ticket.comments
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((comment, index) => (
              <div key={index} style={{
                background: "var(--bg)",
                borderRadius: 8,
                padding: "1rem",
                marginBottom: 16,
                border: '1px solid var(--border)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: 8,
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 500, fontSize: 15 }}>
                      {comment.user?.name || 'Unknown User'}
                    </span>
                    {/* Show if this is the original ticket creator */}
                    {comment.user?._id === ticket.user?._id && (
                      <span style={{ 
                        background: '#28a745', 
                        color: 'white', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '12px', 
                        fontSize: '0.7rem'
                      }}>
                        Creator
                      </span>
                    )}
                    {/* Show role badge for non-customer roles */}
                    {comment.user?.role && comment.user.role !== 'customer' && (
                      <span style={{ 
                        ...getRoleBadgeStyle(comment.user.role),
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '12px', 
                        fontSize: '0.7rem'
                      }}>
                        {comment.user.role}
                      </span>
                    )}
                  </div>
                  <span style={{
                    color: "var(--text-muted)",
                    fontSize: 13
                  }}>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 8 }}>
                  {comment.message}
                </div>
                
                {/* Display comment images with modal functionality */}
                {comment.images && comment.images.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
                      {comment.images.map((image, imgIndex) => (
                        <div 
                          key={imgIndex}
                          onClick={() => onImageModalOpen(comment.images, imgIndex)}
                          style={{ cursor: 'pointer' }}
                        >
                          <img
                            src={`http://localhost:5000${image.url}`}
                            alt={image.originalName}
                            style={{
                              width: '100%',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid #ddd',
                              transition: 'transform 0.2s, box-shadow 0.2s'
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
        ) : (
          <div style={{
            color: "var(--text-muted)",
            textAlign: "center",
            padding: '2rem'
          }}>
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;