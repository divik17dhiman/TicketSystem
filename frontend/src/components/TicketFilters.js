import React, { useState, useEffect } from 'react';

const TicketFilters = ({ 
  onFilterChange, 
  onSearchChange, 
  onSortChange,
  agents = [],
  initialFilters = {},
  totalResults = 0
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priority: '',
    category: '',
    assignedTo: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'latest',
    ...initialFilters
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearchChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
    onSortChange(sortBy);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      priority: '',
      category: '',
      assignedTo: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'latest'
    });
  };

  const hasActiveFilters = searchTerm || 
    filters.priority || 
    filters.category || 
    filters.assignedTo || 
    filters.dateFrom || 
    filters.dateTo;

  const sortOptions = [
    { value: 'latest', label: '🕒 Latest', description: 'Newest first' },
    { value: 'oldest', label: '📅 Oldest', description: 'Oldest first' },
    { value: 'priority', label: '🚨 Priority', description: 'High to low' },
    { value: 'status', label: '📊 Status', description: 'By status' },
    { value: 'comments', label: '💬 Comments', description: 'Most discussed' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities', color: '#6b7280' },
    { value: 'low', label: '🔵 Low', color: '#6b7280' },
    { value: 'medium', label: '🟡 Medium', color: '#f59e0b' },
    { value: 'high', label: '🟠 High', color: '#ef4444' },
    { value: 'urgent', label: '🔴 Urgent', color: '#dc2626' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories', icon: '📋' },
    { value: 'technical', label: 'Technical', icon: '⚙️' },
    { value: 'billing', label: 'Billing', icon: '💳' },
    { value: 'general', label: 'General', icon: '💬' },
    { value: 'bug', label: 'Bug Report', icon: '🐛' }
  ];

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border-light)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--primary-gradient)',
        color: 'white',
        padding: 'var(--space-6)',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">🔍 Search & Filter</h3>
          {hasActiveFilters && (
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius-full)',
              padding: 'var(--space-1) var(--space-3)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-semibold)'
            }}>
              {Object.values(filters).filter(v => v).length + (searchTerm ? 1 : 0)} active
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: 'var(--space-6)' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: 'var(--space-4)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tickets by title, description, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-4) var(--space-4) var(--space-4) 48px',
                border: '2px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--text-base)',
                transition: 'all var(--transition-fast)',
                background: 'var(--bg)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-light)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div className="text-center" style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            marginTop: 'var(--space-2)',
            padding: 'var(--space-2)',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-light)'
          }}>
            <strong>{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Sort Options */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h4 className="text-base font-semibold mb-3">📊 Sort By</h4>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  border: `2px solid ${filters.sortBy === option.value ? 'var(--primary)' : 'var(--border)'}`,
                  background: filters.sortBy === option.value ? 'var(--primary-light)' : 'var(--bg)',
                  color: filters.sortBy === option.value ? 'var(--primary)' : 'var(--text)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: filters.sortBy === option.value ? 'var(--font-semibold)' : 'var(--font-medium)',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'left',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  if (filters.sortBy !== option.value) {
                    e.target.style.borderColor = 'var(--primary-light)';
                    e.target.style.background = 'var(--bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filters.sortBy !== option.value) {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.background = 'var(--bg)';
                  }
                }}
              >
                <span>{option.label}</span>
                <span style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}>
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold">
              🎛️ Filters
              {hasActiveFilters && (
                <span style={{ 
                  color: 'var(--primary)', 
                  fontSize: 'var(--text-lg)', 
                  marginLeft: 'var(--space-2)' 
                }}>
                  •
                </span>
              )}
            </h4>
            {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                style={{
                  background: 'var(--error-gradient)',
                  color: 'white',
                  border: 'none',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                🗑️ Clear All
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Priority Filter */}
            <div>
              <label className="text-sm font-semibold text-muted mb-2" style={{ display: 'block' }}>
                Priority Level
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-medium)',
                  background: 'var(--bg)',
                  transition: 'border-color var(--transition-fast)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                }}
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-semibold text-muted mb-2" style={{ display: 'block' }}>
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-medium)',
                  background: 'var(--bg)',
                  transition: 'border-color var(--transition-fast)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                }}
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned Agent Filter */}
            {agents.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-muted mb-2" style={{ display: 'block' }}>
                  Assigned Agent
                </label>
                <select
                  value={filters.assignedTo}
                  onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    border: '2px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-medium)',
                    background: 'var(--bg)',
                    transition: 'border-color var(--transition-fast)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                  }}
                >
                  <option value="">👥 All Agents</option>
                  <option value="unassigned">🔓 Unassigned</option>
                  {agents.map(agent => (
                    <option key={agent._id} value={agent._id}>
                      👤 {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Range Filters */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
              padding: 'var(--space-4)',
              border: '1px solid var(--border-light)'
            }}>
              <h5 className="text-sm font-semibold mb-3">📅 Date Range</h5>
              
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                <div>
                  <label className="text-xs font-medium text-muted mb-1" style={{ display: 'block' }}>
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2) var(--space-3)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-sm)',
                      background: 'var(--bg)'
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted mb-1" style={{ display: 'block' }}>
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2) var(--space-3)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-sm)',
                      background: 'var(--bg)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketFilters;