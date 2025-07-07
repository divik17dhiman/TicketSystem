import React from 'react';

const Logo = ({ 
  size = 'md', 
  variant = 'full', 
  animated = false,
  className = '',
  onClick 
}) => {
  const sizes = {
    xs: { container: '24px', text: 'var(--text-sm)', icon: '20px' },
    sm: { container: '32px', text: 'var(--text-base)', icon: '28px' },
    md: { container: '40px', text: 'var(--text-lg)', icon: '36px' },
    lg: { container: '56px', text: 'var(--text-2xl)', icon: '48px' },
    xl: { container: '72px', text: 'var(--text-4xl)', icon: '64px' }
  };

  const currentSize = sizes[size] || sizes.md;

  const LogoIcon = ({ style = {} }) => (
    <div
      style={{
        width: currentSize.icon,
        height: currentSize.icon,
        background: 'var(--primary-gradient)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        ...style
      }}
      className={animated ? 'hover-scale' : ''}
    >
      {/* Icon Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 2px, transparent 2px)',
        backgroundSize: '8px 8px',
        opacity: 0.6
      }} />
      
      {/* Main Icon */}
      <svg 
        width="60%" 
        height="60%" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="white" 
        strokeWidth="2.5"
        style={{ 
          position: 'relative',
          zIndex: 1,
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
        }}
      >
        {/* Support/Flow Icon - Combination of ticket + flow */}
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="12" y2="17"/>
        {/* Flow arrows */}
        <polyline points="16,16 18,18 16,20" style={{ strokeWidth: '2' }}/>
      </svg>
    </div>
  );

  const LogoText = ({ style = {} }) => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      lineHeight: '1.1',
      ...style 
    }}>
      <span style={{
        fontSize: currentSize.text,
        fontWeight: 'var(--font-bold)',
        background: 'var(--primary-gradient)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.02em'
      }}>
        SupportFlow
      </span>
      {size === 'xl' && (
        <span style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          fontWeight: 'var(--font-medium)',
          marginTop: '-2px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          Ticket Management
        </span>
      )}
    </div>
  );

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: variant === 'icon' ? 0 : 'var(--space-3)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all var(--transition-fast)',
    userSelect: 'none'
  };

  if (variant === 'icon') {
    return (
      <div 
        className={className}
        style={containerStyle}
        onClick={onClick}
      >
        <LogoIcon />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div 
        className={className}
        style={containerStyle}
        onClick={onClick}
      >
        <LogoText />
      </div>
    );
  }

  // Full logo (icon + text)
  return (
    <div 
      className={`${className} ${animated ? 'hover-lift' : ''}`}
      style={containerStyle}
      onClick={onClick}
    >
      <LogoIcon />
      <LogoText />
    </div>
  );
};

export default Logo; 