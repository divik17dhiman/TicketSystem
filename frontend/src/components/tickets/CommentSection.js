import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ImageUpload from "../ImageUpload";
import { getImageUrl } from "../../utils/api";

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
    const commentDate = new Date(date);
    const now = new Date();
    const diffInHours = Math.abs(now - commentDate) / 36e5;
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return commentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
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
        return { 
          background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
          color: 'white',
          border: '1px solid #e74c3c33'
        };
      case 'agent': 
        return { 
          background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
          color: 'white',
          border: '1px solid #3498db33'
        };
      default: 
        return { 
          background: "linear-gradient(135deg, #6c757d 0%, #495057 100%)",
          color: 'white',
          border: '1px solid #6c757d33'
        };
    }
  };

  return (
    <div className="card animate-slide-up" style={{ 
      background: "var(--surface)",
      border: "1px solid var(--border-light)"
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold" style={{ 
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)"
        }}>
          💬 Comments 
          <span style={{
            background: "var(--primary-gradient)",
            color: "white",
            fontSize: "var(--text-sm)",
            padding: "var(--space-1) var(--space-3)",
            borderRadius: "var(--radius-full)",
            fontWeight: "var(--font-semibold)"
          }}>
            {ticket.comments?.length || 0}
          </span>
        </h2>
      </div>
      
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} style={{ 
        marginBottom: "var(--space-8)",
        padding: "var(--space-6)",
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border-light)"
      }}>
        <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
        
        <div style={{ marginBottom: "var(--space-4)" }}>
          <label htmlFor="comment" className="text-sm font-medium text-muted mb-2" style={{ display: 'block' }}>
            Your Message
          </label>
          <textarea
            id="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts, ask questions, or provide updates..."
            style={{ 
              width: '100%', 
              padding: "var(--space-4)",
              border: '2px solid var(--border)',
              borderRadius: "var(--radius)",
              resize: 'vertical',
              fontSize: "var(--text-base)",
              lineHeight: "var(--leading-relaxed)",
              transition: "border-color var(--transition-fast)",
              fontFamily: "inherit"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--primary)";
              e.target.style.boxShadow = "0 0 0 3px var(--primary-light)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.boxShadow = "none";
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
            marginTop: "var(--space-4)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-3) var(--space-6)",
            fontSize: "var(--text-base)",
            fontWeight: "var(--font-semibold)"
          }}
        >
          {loading && <div className="loading-spinner" style={{ width: "16px", height: "16px" }}></div>}
          {loading ? 'Adding Comment...' : '💬 Add Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div>
        {ticket.comments && ticket.comments.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            {ticket.comments
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((comment, index) => (
                <div key={index} className="animate-slide-up" style={{
                  animationDelay: `${index * 0.1}s`,
                  background: "var(--bg)",
                  borderRadius: "var(--radius)",
                  padding: "var(--space-6)",
                  border: '1px solid var(--border-light)',
                  position: "relative"
                }}>
                  {/* Comment Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* User Avatar */}
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
                        fontWeight: "var(--font-semibold)",
                        flexShrink: 0
                      }}>
                        {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      
                      {/* User Info & Badges */}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-base">
                            {comment.user?.name || 'Unknown User'}
                          </span>
                          
                          {/* Creator Badge */}
                          {comment.user?._id === ticket.user?._id && (
                            <span style={{ 
                              background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                              color: 'white', 
                              padding: 'var(--space-1) var(--space-3)', 
                              borderRadius: 'var(--radius-full)', 
                              fontSize: 'var(--text-xs)',
                              fontWeight: "var(--font-semibold)",
                              border: '1px solid #28a74533'
                            }}>
                              ✨ Creator
                            </span>
                          )}
                          
                          {/* Role Badge */}
                          {comment.user?.role && comment.user.role !== 'customer' && (
                            <span style={{ 
                              ...getRoleBadgeStyle(comment.user.role),
                              padding: 'var(--space-1) var(--space-3)', 
                              borderRadius: 'var(--radius-full)', 
                              fontSize: 'var(--text-xs)',
                              fontWeight: "var(--font-semibold)",
                              textTransform: "uppercase",
                              letterSpacing: "0.025em"
                            }}>
                              {comment.user.role === 'admin' ? '👑 Admin' : '🎧 Agent'}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                          </svg>
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comment Message */}
                  <div style={{ 
                    fontSize: "var(--text-base)", 
                    lineHeight: "var(--leading-relaxed)", 
                    marginBottom: "var(--space-4)",
                    marginLeft: "64px", // Align with avatar
                    color: "var(--text-secondary)"
                  }}>
                    {comment.message}
                  </div>
                  
                  {/* Comment Images */}
                  {comment.images && comment.images.length > 0 && (
                    <div style={{ marginLeft: "64px" }}>
                      <div className="text-sm font-medium text-muted mb-3">
                        📎 Attachments ({comment.images.length})
                      </div>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                        gap: "var(--space-3)"
                      }}>
                        {comment.images.map((image, imgIndex) => (
                          <div 
                            key={imgIndex}
                            onClick={() => onImageModalOpen(comment.images, imgIndex)}
                            style={{ 
                              cursor: 'pointer',
                              position: "relative",
                              borderRadius: "var(--radius)",
                              overflow: "hidden",
                              transition: "all var(--transition-fast)",
                              boxShadow: "var(--shadow-sm)"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.02)';
                              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            }}
                          >
                            <img
                              src={getImageUrl(image.url)}
                              alt={image.originalName}
                              style={{
                                width: '100%',
                                height: '100px',
                                objectFit: 'cover',
                                border: '1px solid var(--border-light)'
                              }}
                            />
                            <div style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                              color: "white",
                              padding: "var(--space-1)",
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-medium)"
                            }}>
                              {image.originalName.length > 15 
                                ? image.originalName.substring(0, 15) + "..."
                                : image.originalName
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        ) : (
          <div className="text-center" style={{
            padding: "var(--space-12)",
            color: "var(--text-muted)"
          }}>
            <div style={{ 
              fontSize: "48px",
              marginBottom: "var(--space-4)"
            }}>
              💭
            </div>
            <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
            <p className="text-base">
              Be the first to share your thoughts or ask a question!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;