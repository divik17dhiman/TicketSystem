import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';

const ImageModal = ({ images, currentIndex, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex || 0);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(currentIndex || 0);
    }
  }, [isOpen, currentIndex]);

  const goToNext = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const goToPrevious = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentImageIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
      closeOnOverlayClick={true}
    >
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        minHeight: '50vh',
        background: '#f8f9fa'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.9)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.7)'}
        >
          ×
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                cursor: 'pointer',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.9)';
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.7)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              ‹
            </button>
            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                cursor: 'pointer',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.9)';
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.7)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              ›
            </button>
          </>
        )}

        {/* Main image - natural size with max constraints */}
        <img
          src={`http://localhost:5000${currentImage.url}`}
          alt={currentImage.originalName}
          style={{
            maxWidth: '800px',
            maxHeight: '600px',
            width: 'auto',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #ddd'
          }}
        />

        {/* Image info */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {currentImageIndex + 1} of {images.length}
          </div>
        )}

        {/* Thumbnail navigation for multiple images */}
        {images.length > 1 && images.length <= 10 && (
          <div style={{
            position: 'absolute',
            bottom: '4rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.5rem',
            maxWidth: '90%',
            overflowX: 'auto',
            padding: '0.5rem',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '12px',
            border: '1px solid #ddd'
          }}>
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  flexShrink: 0,
                  width: '60px',
                  height: '60px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: index === currentImageIndex ? '3px solid var(--primary)' : '2px solid #ddd',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  opacity: index === currentImageIndex ? 1 : 0.7,
                  background: 'transparent',
                  padding: 0
                }}
                onMouseEnter={(e) => {
                  if (index !== currentImageIndex) {
                    e.target.style.opacity = '1';
                    e.target.style.border = '2px solid var(--primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentImageIndex) {
                    e.target.style.opacity = '0.7';
                    e.target.style.border = '2px solid #ddd';
                  }
                }}
              >
                <img
                  src={`http://localhost:5000${image.url}`}
                  alt={image.originalName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageModal;
