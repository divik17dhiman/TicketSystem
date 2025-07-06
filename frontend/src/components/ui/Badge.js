import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'success': return 'status-open';
      case 'warning': return 'status-in-progress';
      case 'info': return 'status-resolved';
      case 'danger': return 'priority-urgent';
      case 'primary': return 'priority-medium';
      default: return 'status-closed';
    }
  };

  return (
    <span
      className={`status-badge ${getVariantClass()} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};


export default Badge;
