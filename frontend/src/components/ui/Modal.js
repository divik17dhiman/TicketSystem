import React, { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
  showCloseButton = true,
  closeOnOverlayClick = true,
  ...props
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { maxWidth: '400px', width: '90%' };
      case 'lg':
        return { maxWidth: '900px', width: '90%' };
      case 'xl':
        return { maxWidth: '1200px', width: '95%', maxHeight: '95vh' };
      default:
        return { maxWidth: '600px', width: '90%' };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div
        onClick={closeOnOverlayClick ? onClose : undefined}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
      <div
        className={className}
        style={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '8px',
          ...getSizeStyles(),
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
        {...props}
      >
        {(title || showCloseButton) && (
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            {title && <h3 style={{ margin: 0 }}>{title}</h3>}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0.25rem',
                  borderRadius: '4px',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#000'}
                onMouseLeave={(e) => e.target.style.color = '#666'}
              >
                ×
              </button>
            )}
          </div>
        )}
        <div style={{ 
          padding: showCloseButton || title ? '0' : '1rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const ModalFooter = ({ children, className = '' }) => (
  <div className={className} style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    padding: '1rem',
    borderTop: '1px solid #eee',
    flexShrink: 0
  }}>
    {children}
  </div>
);

Modal.Footer = ModalFooter;

export default Modal;
