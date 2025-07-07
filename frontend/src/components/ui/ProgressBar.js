import React from 'react';

const ProgressBar = ({
  value = 0,
  max = 100,
  variant = 'default',
  size = 'md',
  animated = true,
  showLabel = true,
  label,
  color,
  className = '',
  style = {}
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    xs: { height: '4px', text: 'var(--text-xs)' },
    sm: { height: '6px', text: 'var(--text-sm)' },
    md: { height: '8px', text: 'var(--text-sm)' },
    lg: { height: '12px', text: 'var(--text-base)' },
    xl: { height: '16px', text: 'var(--text-base)' }
  };

  const currentSize = sizes[size] || sizes.md;

  const getVariantStyles = () => {
    const variants = {
      default: {
        bg: 'var(--bg-secondary)',
        fill: 'var(--primary-gradient)',
        border: '1px solid var(--border)'
      },
      success: {
        bg: 'rgba(34, 197, 94, 0.1)',
        fill: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
        border: '1px solid rgba(34, 197, 94, 0.2)'
      },
      warning: {
        bg: 'rgba(245, 158, 11, 0.1)',
        fill: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
        border: '1px solid rgba(245, 158, 11, 0.2)'
      },
      error: {
        bg: 'rgba(239, 68, 68, 0.1)',
        fill: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
        border: '1px solid rgba(239, 68, 68, 0.2)'
      },
      info: {
        bg: 'rgba(59, 130, 246, 0.1)',
        fill: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)'
      },
      minimal: {
        bg: 'var(--border)',
        fill: color || 'var(--primary)',
        border: 'none'
      }
    };

    return variants[variant] || variants.default;
  };

  const variantStyles = getVariantStyles();

  return (
    <div className={className} style={style}>
      {/* Label */}
      {showLabel && (label || percentage > 0) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-2)',
          fontSize: currentSize.text
        }}>
          {label && (
            <span style={{
              fontWeight: 'var(--font-medium)',
              color: 'var(--text)'
            }}>
              {label}
            </span>
          )}
          <span style={{
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-muted)',
            fontSize: 'var(--text-xs)'
          }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      {/* Progress Container */}
      <div style={{
        width: '100%',
        height: currentSize.height,
        backgroundColor: variantStyles.bg,
        borderRadius: 'var(--radius-full)',
        border: variantStyles.border,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Progress Fill */}
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: variantStyles.fill,
            borderRadius: 'var(--radius-full)',
            transition: animated ? 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated Shine Effect */}
          {animated && percentage > 0 && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'shine 2s infinite'
            }} />
          )}
        </div>

        {/* Indeterminate Animation */}
        {value === undefined && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: variantStyles.fill,
            borderRadius: 'var(--radius-full)',
            animation: 'indeterminate 1.5s infinite linear',
            transformOrigin: 'left center'
          }} />
        )}
      </div>
    </div>
  );
};

// Circular Progress Component
export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 64,
  strokeWidth = 6,
  variant = 'default',
  showLabel = true,
  label,
  className = '',
  style = {}
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getVariantColor = () => {
    const variants = {
      default: 'var(--primary)',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    };
    return variants[variant] || variants.default;
  };

  return (
    <div 
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style
      }}
    >
      <div style={{ position: 'relative' }}>
        <svg
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getVariantColor()}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </svg>

        {/* Center label */}
        {showLabel && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: size > 80 ? 'var(--text-lg)' : 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--text)'
            }}>
              {Math.round(percentage)}%
            </div>
          </div>
        )}
      </div>

      {label && (
        <div style={{
          marginTop: 'var(--space-2)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-medium)',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}>
          {label}
        </div>
      )}
    </div>
  );
};

export default ProgressBar; 