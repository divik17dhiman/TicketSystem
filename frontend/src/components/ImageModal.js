import React, { useState, useEffect, useCallback } from 'react';
import Modal from './ui/Modal';
import { getImageUrl } from '../utils/api';

const ImageModal = ({ images, currentIndex, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex || 0);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageTransition, setImageTransition] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(currentIndex || 0);
    }
  }, [isOpen, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const changeImage = useCallback((newIndex) => {
    if (newIndex === currentImageIndex) return;
    
    setImageTransition(true);
    setImageLoading(true);
    
    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setImageTransition(false);
      
      setTimeout(() => {
        setImageLoading(false);
      }, 100);
    }, 150);
  }, [currentImageIndex]);

  const goToNext = () => {
    if (images.length > 1) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      changeImage(nextIndex);
    }
  };

  const goToPrevious = () => {
    if (images.length > 1) {
      const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
      changeImage(prevIndex);
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
      <div className="modal-content" style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
        minHeight: '60vh',
        background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg-secondary) 100%)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--primary) 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, var(--primary) 2px, transparent 2px)`,
          backgroundSize: '50px 50px',
          pointerEvents: 'none'
        }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-interactive hover-glow"
          style={{
            position: 'absolute',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            zIndex: 10,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            width: '48px',
            height: '48px',
            cursor: 'pointer',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="btn-interactive hover-scale icon-spin-hover"
              style={{
                position: 'absolute',
                left: 'var(--space-6)',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                width: '56px',
                height: '56px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
            </button>
            
            <button
              onClick={goToNext}
              className="btn-interactive hover-scale icon-spin-hover"
              style={{
                position: 'absolute',
                right: 'var(--space-6)',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                width: '56px',
                height: '56px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </button>
          </>
        )}

        {/* Main Image Container */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '90vw',
          maxHeight: '70vh',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          background: 'white'
        }}>
          {/* Loading Overlay */}
          {imageLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
              borderRadius: 'var(--radius)'
            }}>
              <div className="loading-spinner lg"></div>
            </div>
          )}

          {/* Main Image */}
          <img
            src={getImageUrl(currentImage.url)}
            alt={currentImage.originalName}
            className={`${imageTransition ? 'animate-fade-in' : ''}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              display: 'block',
              transition: 'opacity var(--transition)',
              opacity: imageTransition ? 0.3 : 1
            }}
            onLoad={() => setImageLoading(false)}
          />
        </div>

        {/* Image Information */}
        <div className="animate-slide-up" style={{
          marginTop: 'var(--space-6)',
          textAlign: 'center',
          background: 'var(--surface)',
          padding: 'var(--space-4) var(--space-6)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
            {currentImage.originalName}
          </h3>
          
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-4">
              <span style={{
                background: 'var(--primary-gradient)',
                color: 'white',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)'
              }}>
                {currentImageIndex + 1} of {images.length}
              </span>
              
              <div className="text-sm text-muted">
                Use ← → arrow keys to navigate
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Thumbnail Navigation */}
        {images.length > 1 && images.length <= 10 && (
          <div className="animate-slide-up delay-200" style={{
            marginTop: 'var(--space-6)',
            display: 'flex',
            gap: 'var(--space-3)',
            padding: 'var(--space-4)',
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            maxWidth: '100%',
            overflowX: 'auto'
          }}>
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => changeImage(index)}
                className="hover-scale hover-lift"
                style={{
                  flexShrink: 0,
                  position: 'relative',
                  width: '72px',
                  height: '72px',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  border: index === currentImageIndex 
                    ? '3px solid var(--primary)' 
                    : '2px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                  background: 'transparent',
                  padding: 0,
                  transform: index === currentImageIndex ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                <img
                  src={getImageUrl(image.url)}
                  alt={image.originalName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'all var(--transition)'
                  }}
                />
                
                {/* Active Indicator */}
                {index === currentImageIndex && (
                  <div style={{
                    position: 'absolute',
                    top: 'var(--space-1)',
                    right: 'var(--space-1)',
                    width: '12px',
                    height: '12px',
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: 'var(--shadow-sm)'
                  }} />
                )}
                
                {/* Hover Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: index === currentImageIndex 
                    ? 'rgba(0,0,0,0.1)' 
                    : 'rgba(0,0,0,0)',
                  transition: 'background var(--transition)'
                }} />
              </button>
            ))}
          </div>
        )}

        {/* Dots Navigation for Many Images */}
        {images.length > 10 && (
          <div className="animate-slide-up delay-300" style={{
            marginTop: 'var(--space-4)',
            display: 'flex',
            gap: 'var(--space-2)',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => changeImage(index)}
                className="hover-scale"
                style={{
                  width: index === currentImageIndex ? '32px' : '12px',
                  height: '12px',
                  borderRadius: 'var(--radius-full)',
                  background: index === currentImageIndex 
                    ? 'var(--primary-gradient)' 
                    : 'var(--border)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                  opacity: index === currentImageIndex ? 1 : 0.6
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageModal;
