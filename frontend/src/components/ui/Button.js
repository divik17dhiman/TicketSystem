import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = `btn ${variant === 'primary' ? 'btn-primary' : ''} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={baseClasses}
      {...props}
    >
      {loading && (
        <span style={{ marginRight: '0.5rem' }}>⏳</span>
      )}
      {icon && !loading && <span style={{ marginRight: '0.5rem' }}>{icon}</span>}
      {children}
    </button>
  );
};


export default Button;
