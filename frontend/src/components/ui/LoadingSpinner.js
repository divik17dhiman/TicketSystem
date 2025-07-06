import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = '',
  className = ''
}) => {
  const sizeClasses = {
    sm: { width: '1rem', height: '1rem' },
    md: { width: '2rem', height: '2rem' },
    lg: { width: '3rem', height: '3rem' },
    xl: { width: '4rem', height: '4rem' }
  };

  return (
    <div className={`loading ${className}`} style={{ textAlign: 'center', padding: '2rem' }}>
      <div 
        style={{
          ...sizeClasses[size],
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}
      />
      {text && (
        <p style={{ marginTop: '1rem', color: '#666' }}>
          {text}
        </p>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};


export default LoadingSpinner;
