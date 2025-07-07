import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'md',
  elevation = 'default',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'var(--space-4)',
    md: 'var(--space-6)',
    lg: 'var(--space-8)'
  };

  const elevationStyles = {
    none: 'none',
    sm: 'var(--shadow-sm)',
    default: 'var(--shadow)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)'
  };

  return (
    <div
      className={`card ${className}`}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        boxShadow: elevationStyles[elevation],
        border: '1px solid var(--border-light)',
        padding: paddingClasses[padding],
        transition: 'all var(--transition)',
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
