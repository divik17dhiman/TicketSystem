import React, { useState, useEffect, useCallback } from 'react';

const Toast = ({ 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  position = 'top-right',
  showIcon = true,
  showCloseButton = true,
  autoClose = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Entry animation
    setTimeout(() => setIsVisible(true), 50);

    if (autoClose && duration > 0) {
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      // Auto close timer
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(timer);
      };
    }
  }, [duration, autoClose]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  }, [onClose]);

  const getToastConfig = () => {
    const configs = {
      success: {
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        ),
        colors: {
          bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: '#10b981',
          text: 'white'
        }
      },
      error: {
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        ),
        colors: {
          bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          border: '#ef4444',
          text: 'white'
        }
      },
      warning: {
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m21.73,18l-8-14a2,2,0,0,0-3.48,0l-8,14A2,2,0,0,0,4,21H20A2,2,0,0,0,21.73,18Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        ),
        colors: {
          bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          border: '#f59e0b',
          text: 'white'
        }
      },
      info: {
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12,16v-4"/>
            <path d="M12,8h.01"/>
          </svg>
        ),
        colors: {
          bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          border: '#3b82f6',
          text: 'white'
        }
      }
    };
    return configs[type] || configs.info;
  };

  const getPositionStyles = () => {
    const positions = {
      'top-right': { top: 'var(--space-6)', right: 'var(--space-6)' },
      'top-left': { top: 'var(--space-6)', left: 'var(--space-6)' },
      'bottom-right': { bottom: 'var(--space-6)', right: 'var(--space-6)' },
      'bottom-left': { bottom: 'var(--space-6)', left: 'var(--space-6)' },
      'top-center': { top: 'var(--space-6)', left: '50%', transform: 'translateX(-50%)' },
      'bottom-center': { bottom: 'var(--space-6)', left: '50%', transform: 'translateX(-50%)' }
    };
    return positions[position] || positions['top-right'];
  };

  const config = getToastConfig();

  if (!isVisible && !isExiting) return null;

  return (
    <div
      className={`notification-enter ${isExiting ? 'notification-exit' : ''} hover-lift`}
      style={{
        position: 'fixed',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '480px',
        background: config.colors.bg,
        color: config.colors.text,
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-lg)',
        border: `1px solid ${config.colors.border}33`,
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        transition: 'all var(--transition)',
        ...getPositionStyles()
      }}
    >
      {/* Main Content */}
      <div style={{
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)'
      }}>
        {/* Icon */}
        {showIcon && (
          <div className="animate-bounce" style={{
            flexShrink: 0,
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animationDelay: '0.2s',
            animationDuration: '1.5s'
          }}>
            {config.icon}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && (
            <h4 className="text-base font-semibold mb-1" style={{
              margin: 0,
              color: 'inherit'
            }}>
              {title}
            </h4>
          )}
          
          {message && (
            <p className="text-sm" style={{
              margin: 0,
              opacity: 0.9,
              lineHeight: 'var(--leading-relaxed)'
            }}>
              {message}
            </p>
          )}
        </div>

        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="hover-scale hover-glow"
            style={{
              flexShrink: 0,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'inherit',
              transition: 'all var(--transition-fast)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {autoClose && duration > 0 && (
        <div style={{
          height: '3px',
          background: 'rgba(255,255,255,0.2)',
          overflow: 'hidden'
        }}>
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'rgba(255,255,255,0.8)',
              transition: 'width 0.1s linear'
            }}
          />
        </div>
      )}
    </div>
  );
};

// Toast Container for managing multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
          style={{
            zIndex: 9999 - index // Stack toasts properly
          }}
        />
      ))}
    </>
  );
};

// Toast Hook for easy usage
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toastConfig) => {
    const id = Date.now() + Math.random();
    const toast = { id, ...toastConfig };
    
    setToasts(prev => [...prev, toast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title, message, options = {}) => {
    return addToast({ type: 'success', title, message, ...options });
  }, [addToast]);

  const showError = useCallback((title, message, options = {}) => {
    return addToast({ type: 'error', title, message, ...options });
  }, [addToast]);

  const showWarning = useCallback((title, message, options = {}) => {
    return addToast({ type: 'warning', title, message, ...options });
  }, [addToast]);

  const showInfo = useCallback((title, message, options = {}) => {
    return addToast({ type: 'info', title, message, ...options });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default Toast; 