import React from 'react';
import Button from './Button';

const EmptyState = ({
  type = 'default',
  title,
  description,
  action,
  actionText,
  icon,
  className = '',
  size = 'md'
}) => {
  const sizes = {
    sm: { container: 'var(--space-12)', icon: '48px' },
    md: { container: 'var(--space-16)', icon: '64px' },
    lg: { container: 'var(--space-20)', icon: '80px' }
  };

  const currentSize = sizes[size] || sizes.md;

  const getDefaultIcon = () => {
    const iconMap = {
      tickets: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      search: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      ),
      default: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      )
    };

    return iconMap[type] || iconMap.default;
  };

  return (
    <div 
      className={`slide-up ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: currentSize.container,
        minHeight: '300px'
      }}
    >
      {/* Icon */}
      <div style={{
        width: currentSize.icon,
        height: currentSize.icon,
        borderRadius: 'var(--radius-full)',
        background: 'var(--bg-secondary)',
        border: '2px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-6)',
        color: 'var(--text-muted)'
      }}>
        {icon || getDefaultIcon()}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '400px' }}>
        {title && (
          <h3 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text)',
            marginBottom: 'var(--space-3)'
          }}>
            {title}
          </h3>
        )}

        {description && (
          <p style={{
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: action ? 'var(--space-6)' : 0
          }}>
            {description}
          </p>
        )}

        {action && (
          <div style={{ marginTop: 'var(--space-6)' }}>
            <Button variant="gradient" onClick={action}>
              {actionText || 'Get Started'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState; 