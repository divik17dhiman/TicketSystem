import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  helperText,
  icon,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-group label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{ 
            position: 'absolute', 
            left: '0.75rem', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#666',
            pointerEvents: 'none'
          }}>
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`form-control ${error ? 'error' : ''} ${icon ? 'pl-10' : ''} ${className}`}
          style={{
            paddingLeft: icon ? '2.5rem' : '0.75rem'
          }}
          {...props}
        />
      </div>
      {error && (
        <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {error}
        </div>
      )}
      {helperText && !error && (
        <div style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
