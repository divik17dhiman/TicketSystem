import React, { useState, useEffect } from 'react';

const TicketFilters = ({ 
  onFilterChange, 
  onSearchChange, 
  onSortChange,
  agents = [],
  initialFilters = {},
  totalResults = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 8,
      boxShadow: 'var(--shadow)',
      padding: '1.5rem',
      minWidth: 280
    }}>
      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: 18, fontWeight: 600 }}>Search & Filter</h3>
        <input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid var(--border)',
            borderRadius: 8,
            fontSize: '1rem',
            transition: 'border-color 0.3s'
          }}
        />
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginTop: '0.5rem',
          textAlign: 'center'
        }}>
          {totalResults} result{totalResults !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Quick Sort Options */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: 16, fontWeight: 500 }}>Sort By</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Object.entries({
            latest: 'Latest',
            oldest: 'Oldest',
            priority: 'Priority',
            status: 'Status',
            comments: 'Comments'
          }).map(([value, label]) => (
            <button
              key={value}
              onClick={() => handleSortChange(value)}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border)',
                background: filters.sortBy === value ? 'var(--primary)' : 'var(--surface)',
                color: filters.sortBy === value ? '#fff' : 'var(--text)',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s',
                textAlign: 'left',
                width: '100%'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
            Filters
            {hasActiveFilters && <span style={{ color: 'var(--primary)', fontSize: '1.2rem', marginLeft: '0.5rem' }}>•</span>}
          </h4>
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '0.25rem 0.75rem',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Priority Filter */}
          <div>
            <label style={{ fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text)', fontSize: '0.9rem', display: 'block' }}>
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--border)',
                borderRadius: 4,
                fontSize: '0.9rem'
              }}
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label style={{ fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text)', fontSize: '0.9rem', display: 'block' }}>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--border)',
                borderRadius: 4,
                fontSize: '0.9rem'
              }}
            >
              <option value="">All</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="general">General</option>
              <option value="bug">Bug Report</option>
            </select>
          </div>

          {/* Assigned Agent Filter */}
          {agents.length > 0 && (
            <div>
              <label style={{ fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text)', fontSize: '0.9rem', display: 'block' }}>
                Agent
              </label>
              <select
                value={filters.assignedTo}
                onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  fontSize: '0.9rem'
                }}
              >
                <option value="">All</option>
                <option value="unassigned">Unassigned</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range Filters */}
          <div>
            <label style={{ fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text)', fontSize: '0.9rem', display: 'block' }}>
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--border)',
                borderRadius: 4,
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text)', fontSize: '0.9rem', display: 'block' }}>
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--border)',
                borderRadius: 4,
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketFilters;