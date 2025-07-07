import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';
import TicketCard from './TicketCard';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';

const TicketList = ({ 
  filters = {}, 
  searchTerm = '', 
  sortBy = 'latest',
  limit,
  showHeader = true 
}) => {
  const { user } = useAuth();
  const { tickets, loading, error, fetchTickets } = useTickets();
  const navigate = useNavigate();
  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  // Apply filters, search, and sorting
  useEffect(() => {
    let result = [...tickets];

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.user?.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      result = result.filter(ticket => ticket.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter(ticket => ticket.priority === filters.priority);
    }
    if (filters.category) {
      result = result.filter(ticket => ticket.category === filters.category);
    }
    if (filters.assignedTo) {
      if (filters.assignedTo === 'unassigned') {
        result = result.filter(ticket => !ticket.assignedTo);
      } else {
        result = result.filter(ticket => ticket.assignedTo?._id === filters.assignedTo);
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'status':
          const statusOrder = { open: 1, 'in-progress': 2, resolved: 3, closed: 4 };
          return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    // Apply limit if specified
    if (limit) {
      result = result.slice(0, limit);
    }

    setFilteredTickets(result);
  }, [tickets, searchTerm, filters, sortBy, limit]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-16)',
        minHeight: '300px'
      }}>
        <LoadingSpinner size="lg" />
        <p style={{
          marginTop: 'var(--space-4)',
          color: 'var(--text-muted)',
          fontSize: 'var(--text-sm)'
        }}>
          Loading your tickets...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'var(--error-gradient)',
        color: 'white',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius)',
        margin: 'var(--space-4) 0',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        {error}
      </div>
    );
  }

  const getEmptyStateProps = () => {
    if (searchTerm || Object.values(filters).some(v => v && v !== 'all')) {
      return {
        type: 'search',
        title: 'No tickets match your criteria',
        description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
        action: () => {
          // Clear filters/search logic could go here
        },
        actionText: 'Clear Filters'
      };
    }

    if (user?.role === 'customer') {
      return {
        type: 'tickets',
        title: 'No tickets yet',
        description: 'Create your first support ticket to get started with SupportFlow.',
        action: () => navigate('/tickets/new'),
        actionText: 'Create Your First Ticket'
      };
    }

    return {
      type: 'tickets',
      title: 'No tickets found',
      description: 'There are no tickets to display at the moment.',
    };
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      {showHeader && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-6)'
        }}>
          <div>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text)',
              marginBottom: 'var(--space-1)'
            }}>
              {user?.role === 'customer' ? 'My Tickets' : 'All Tickets'}
            </h2>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: 'var(--text-sm)'
            }}>
              {filteredTickets.length === 1 
                ? '1 ticket found'
                : `${filteredTickets.length} tickets found`
              }
            </p>
          </div>

          {user?.role === 'customer' && (
            <button
              onClick={() => navigate('/tickets/new')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--primary-gradient)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: 'var(--shadow-sm)'
              }}
              className="hover-lift"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              New Ticket
            </button>
          )}
        </div>
      )}

      {/* Tickets Grid */}
      {filteredTickets.length === 0 ? (
        <EmptyState {...getEmptyStateProps()} />
      ) : (
        <div style={{
          display: 'grid',
          gap: 'var(--space-4)',
          gridTemplateColumns: '1fr'
        }}>
          {filteredTickets.map((ticket, index) => (
            <div 
              key={ticket._id}
              className="slide-up"
              style={{ 
                animationDelay: `${index * 0.05}s`,
                animationFillMode: 'both'
              }}
            >
              <TicketCard ticket={ticket} />
            </div>
          ))}
        </div>
      )}

      {/* Load More Button (if limit is set and there are more tickets) */}
      {limit && filteredTickets.length === limit && tickets.length > limit && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 'var(--space-8)'
        }}>
          <button
            onClick={() => {/* Implement load more logic */}}
            className="outline hover-lift"
            style={{
              padding: 'var(--space-3) var(--space-6)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)'
            }}
          >
            Load More Tickets
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketList;
