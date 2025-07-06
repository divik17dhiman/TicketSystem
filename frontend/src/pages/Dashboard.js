import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import TicketCard from '../components/tickets/TicketCard';
import TicketFilters from '../components/TicketFilters';

const Dashboard = () => {
  const { user } = useAuth();
  const { tickets, loading, error, fetchTickets, getAgents } = useTickets();
  const [hasFetched, setHasFetched] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('latest');
  const [agents, setAgents] = useState([]);

  // Prevent multiple fetch calls
  useEffect(() => {
    if (user && !hasFetched) {
      setHasFetched(true);
      fetchTickets();
    }
  }, [user, fetchTickets, hasFetched]);

  // Load agents for filter dropdown
  useEffect(() => {
    const loadAgents = async () => {
      if (user?.role !== 'customer') {
        try {
          const agentList = await getAgents();
          setAgents(agentList);
        } catch (error) {
          console.error('Failed to load agents:', error);
        }
      }
    };
    loadAgents();
  }, [user, getAgents]);

  // Get ticket stats
  const getTicketStats = () => {
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in-progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length
    };
    return stats;
  };

  const stats = getTicketStats();

  // Apply search, filters, and sorting
  const filteredAndSortedTickets = useMemo(() => {
    let result = tickets;

    // Apply tab filter first
    if (activeTab !== 'all') {
      result = result.filter(ticket => ticket.status === activeTab);
    }

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.user?.name.toLowerCase().includes(searchLower) ||
        ticket.comments?.some(comment => 
          comment.message.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply filters
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
    if (filters.dateFrom) {
      result = result.filter(ticket => 
        new Date(ticket.createdAt) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      result = result.filter(ticket => 
        new Date(ticket.createdAt) <= new Date(filters.dateTo + 'T23:59:59')
      );
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
        case 'comments':
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [tickets, activeTab, searchTerm, filters, sortBy]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    );
  }

  return (
    <main style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            {user?.role === 'agent' || user?.role === 'admin' ? 'Support Dashboard' : 'My Tickets'}
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            {user?.role === 'customer' 
              ? 'Track and manage your support requests'
              : 'Manage customer support tickets'}
          </div>
        </div>
        {user?.role === 'customer' && (
          <Link to="/tickets/new">
            <button style={{
              fontWeight: 500,
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.7em 1.5em',
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.18s'
            }}>
              + New Ticket
            </button>
          </Link>
        )}
      </div>

      {error && (
        <div style={{
          background: '#fdecea',
          color: '#b71c1c',
          padding: '1rem',
          borderRadius: 8,
          marginBottom: 20
        }}>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'var(--surface)',
          padding: '1rem',
          borderRadius: 8,
          boxShadow: 'var(--shadow)',
          textAlign: 'center',
          borderLeft: '4px solid #3498db'
        }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#3498db' }}>{stats.total}</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Total</div>
        </div>
        <div style={{
          background: 'var(--surface)',
          padding: '1rem',
          borderRadius: 8,
          boxShadow: 'var(--shadow)',
          textAlign: 'center',
          borderLeft: '4px solid #27ae60'
        }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#27ae60' }}>{stats.open}</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Open</div>
        </div>
        <div style={{
          background: 'var(--surface)',
          padding: '1rem',
          borderRadius: 8,
          boxShadow: 'var(--shadow)',
          textAlign: 'center',
          borderLeft: '4px solid #f39c12'
        }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f39c12' }}>{stats.inProgress}</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>In Progress</div>
        </div>
        <div style={{
          background: 'var(--surface)',
          padding: '1rem',
          borderRadius: 8,
          boxShadow: 'var(--shadow)',
          textAlign: 'center',
          borderLeft: '4px solid #2563eb'
        }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2563eb' }}>{stats.resolved}</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Resolved</div>
        </div>
      </div>

      {/* Main Content Layout - Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '2rem',
        alignItems: 'flex-start'
      }}>
        {/* Left Column - Main Content */}
        <div style={{ minWidth: 0 }}>
          {/* Status Tabs */}
          <div style={{
            background: 'var(--surface)',
            borderRadius: 8,
            boxShadow: 'var(--shadow)',
            marginBottom: '2rem',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg)',
              overflowX: 'auto'
            }}>
              {[{
                key: 'all',
                label: `All (${stats.total})`
              },
              {
                key: 'open',
                label: `Open (${stats.open})`
              },
              {
                key: 'in-progress',
                label: `In Progress (${stats.inProgress})`
              },
              {
                key: 'resolved',
                label: `Resolved (${stats.resolved})`
              },
              {
                key: 'closed',
                label: `Closed (${stats.closed})`
              }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1,
                    minWidth: '120px',
                    padding: '1rem 1.5rem',
                    border: 'none',
                    background: activeTab === tab.key ? 'var(--surface)' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
                    borderBottom: activeTab === tab.key ? '3px solid var(--primary)' : '3px solid transparent',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '1.5rem', minHeight: '300px' }}>
              {filteredAndSortedTickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ fontSize: 48, marginBottom: '1rem' }}>📋</div>
                  <h3 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>
                    {searchTerm || Object.values(filters).some(v => v) 
                      ? 'No tickets match your search criteria' 
                      : `No ${activeTab === 'all' ? '' : activeTab.replace('-', ' ') + ' '}tickets found`
                    }
                  </h3>
                  {user?.role === 'customer' && activeTab === 'all' && !searchTerm && (
                    <Link to="/tickets/new">
                      <button style={{
                        background: 'var(--primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.7em 1.5em',
                        fontSize: 16,
                        cursor: 'pointer',
                        marginTop: '1rem'
                      }}>
                        Create your first ticket
                      </button>
                    </Link>
                  )}
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '1.5rem'
                }}>
                  {filteredAndSortedTickets.map(ticket => (
                    <TicketCard key={ticket._id} ticket={ticket} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Filters Sidebar */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          <TicketFilters
            onSearchChange={setSearchTerm}
            onFilterChange={setFilters}
            onSortChange={setSortBy}
            agents={agents}
            totalResults={filteredAndSortedTickets.length}
          />
        </div>
      </div>

      {/* Mobile Responsive Adjustments */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .dashboard-main {
            grid-template-columns: 1fr !important;
          }
          .dashboard-sidebar {
            position: static !important;
            order: -1;
          }
        }
      `}</style>
    </main>
  );
};

export default Dashboard;
