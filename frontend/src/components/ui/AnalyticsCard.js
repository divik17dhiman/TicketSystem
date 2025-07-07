import React from 'react';
import { CircularProgress } from './ProgressBar';

const AnalyticsCard = ({
  title,
  value,
  subtitle,
  trend,
  trendDirection = 'up',
  icon,
  variant = 'default',
  size = 'md',
  chart,
  className = '',
  onClick
}) => {
  const variants = {
    default: {
      bg: 'var(--surface)',
      border: '1px solid var(--border)',
      iconBg: 'var(--primary-gradient)',
      iconColor: 'white'
    },
    success: {
      bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.1) 100%)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      iconBg: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
      iconColor: 'white'
    },
    warning: {
      bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.1) 100%)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      iconColor: 'white'
    },
    error: {
      bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(248, 113, 113, 0.1) 100%)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      iconBg: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
      iconColor: 'white'
    },
    premium: {
      bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(196, 181, 253, 0.1) 100%)',
      border: '1px solid rgba(168, 85, 247, 0.2)',
      iconBg: 'linear-gradient(135deg, #a855f7 0%, #c4b5fd 100%)',
      iconColor: 'white'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  const sizes = {
    sm: { padding: 'var(--space-4)', iconSize: '32px' },
    md: { padding: 'var(--space-6)', iconSize: '40px' },
    lg: { padding: 'var(--space-8)', iconSize: '48px' }
  };

  const currentSize = sizes[size] || sizes.md;

  const getTrendIcon = () => {
    if (trendDirection === 'up') {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
          <polyline points="17,6 23,6 23,12"/>
        </svg>
      );
    } else if (trendDirection === 'down') {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23,18 13.5,8.5 8.5,13.5 1,6"/>
          <polyline points="17,18 23,18 23,12"/>
        </svg>
      );
    }
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    );
  };

  const getTrendColor = () => {
    if (trendDirection === 'up') return '#22c55e';
    if (trendDirection === 'down') return '#ef4444';
    return 'var(--text-muted)';
  };

  return (
    <div
      className={`hover-lift ${className}`}
      style={{
        background: currentVariant.bg,
        border: currentVariant.border,
        borderRadius: 'var(--radius-lg)',
        padding: currentSize.padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--transition)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
        transform: 'translate(30px, -30px)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-4)'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--text-muted)',
              marginBottom: 'var(--space-1)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {title}
            </h3>
          </div>

          {icon && (
            <div style={{
              width: currentSize.iconSize,
              height: currentSize.iconSize,
              background: currentVariant.iconBg,
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentVariant.iconColor,
              boxShadow: 'var(--shadow-md)',
              flexShrink: 0
            }}>
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-2)'
        }}>
          <span style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text)',
            lineHeight: 1
          }}>
            {value}
          </span>

          {trend && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              padding: '0.125rem 0.375rem',
              borderRadius: 'var(--radius-full)',
              background: trendDirection === 'up' 
                ? 'rgba(34, 197, 94, 0.1)' 
                : trendDirection === 'down'
                ? 'rgba(239, 68, 68, 0.1)'
                : 'rgba(156, 163, 175, 0.1)',
              color: getTrendColor(),
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-semibold)'
            }}>
              {getTrendIcon()}
              {trend}
            </div>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            marginBottom: chart ? 'var(--space-4)' : 0
          }}>
            {subtitle}
          </p>
        )}

        {/* Chart */}
        {chart && (
          <div style={{ marginTop: 'var(--space-4)' }}>
            {chart}
          </div>
        )}
      </div>
    </div>
  );
};

// Mini Chart Components
export const MiniBarChart = ({ data, height = 40, color = 'var(--primary)' }) => {
  const maxValue = Math.max(...data);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'end',
      gap: '2px',
      height: `${height}px`
    }}>
      {data.map((value, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            height: `${(value / maxValue) * height}px`,
            background: color,
            borderRadius: '1px',
            opacity: 0.8,
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.8'}
        />
      ))}
    </div>
  );
};

export const MiniLineChart = ({ data, height = 40, color = 'var(--primary)' }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((maxValue - value) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} style={{ overflow: 'visible' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Gradient fill */}
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill="url(#chartGradient)"
      />
    </svg>
  );
};

export const MiniDonutChart = ({ 
  percentage, 
  size = 60, 
  strokeWidth = 6,
  color = 'var(--primary)',
  backgroundColor = 'var(--border)'
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress
        value={percentage}
        size={size}
        strokeWidth={strokeWidth}
        variant="default"
        showLabel={true}
      />
    </div>
  );
};

export default AnalyticsCard; 