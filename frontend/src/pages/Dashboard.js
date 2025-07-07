import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import TicketCard from '../components/tickets/TicketCard';
import TicketFilters from '../components/TicketFilters';
import AnalyticsCard, { MiniBarChart, MiniLineChart } from '../components/ui/AnalyticsCard';
import EmptyState from '../components/ui/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const { tickets, loading, error, fetchTickets, getAgents } = useTickets();
  const [hasFetched, setHasFetched] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('latest');
  const [agents, setAgents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-spinner" style={{ width: "40px", height: "40px" }}></div>
          <p className="text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
        color: "white",
        padding: "var(--space-16) 0 var(--space-12)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background Pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="container" style={{ position: "relative" }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold" style={{ 
                marginBottom: "var(--space-2)",
                lineHeight: "var(--leading-tight)"
              }}>
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-xl" style={{ 
                opacity: 0.9,
                lineHeight: "var(--leading-normal)"
              }}>
                Here's what's happening with your support tickets today.
              </p>
            </div>
            
            {user?.role === 'customer' && (
              <Link
                to="/tickets/new"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-4) var(--space-6)",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "var(--radius-md)",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "var(--font-semibold)",
                  transition: "all var(--transition-fast)",
                  boxShadow: "var(--shadow-lg)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.3)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                Create New Ticket
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "var(--space-8) var(--space-6) var(--space-16)" }}>
        {/* Enhanced Analytics Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-6)",
          marginBottom: "var(--space-12)",
          marginTop: "calc(-1 * var(--space-12))",
          position: "relative",
          zIndex: 1
        }}>
          <AnalyticsCard
            title="Total Tickets"
            value={stats.total}
            subtitle="All time tickets created"
            trend={stats.total > 0 ? "+12.5%" : ""}
            trendDirection="up"
            variant="default"
            className="slide-up stagger-1"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            }
            chart={<MiniBarChart data={[3, 7, 12, 8, 15, 20, stats.total]} color="var(--primary)" />}
          />

          <AnalyticsCard
            title="Open Tickets"
            value={stats.open}
            subtitle="Tickets awaiting response"
            trend={stats.open > 0 ? "-5.2%" : ""}
            trendDirection="down"
            variant="warning"
            className="slide-up stagger-2"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
              </svg>
            }
            chart={<MiniLineChart data={[stats.open + 5, stats.open + 3, stats.open + 7, stats.open + 2, stats.open]} color="#f59e0b" />}
          />

          <AnalyticsCard
            title="In Progress"
            value={stats.inProgress}
            subtitle="Tickets being worked on"
            trend={stats.inProgress > 0 ? "+8.1%" : ""}
            trendDirection="up"
            variant="success"
            className="slide-up stagger-3"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
              </svg>
            }
            chart={<MiniBarChart data={[1, 3, 2, 5, 4, stats.inProgress]} color="#22c55e" />}
          />

          <AnalyticsCard
            title="Resolved Today"
            value={stats.resolved}
            subtitle="Tickets closed today"
            trend={stats.resolved > 0 ? "+15.3%" : ""}
            trendDirection="up"
            variant="success"
            className="slide-up stagger-4"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,11 12,14 22,4"/>
                <path d="M21,12c0,4.97 -4.03,9 -9,9s-9,-4.03 -9,-9 4.03,-9 9,-9c1.68,0 3.24,0.46 4.58,1.27"/>
              </svg>
            }
            chart={<MiniLineChart data={[2, 4, 3, 6, 8, stats.resolved]} color="#10b981" />}
          />
        </div>

        {/* Search and Filter Bar */}
        <div className="card" style={{ 
          padding: "var(--space-6)",
          marginBottom: "var(--space-8)",
          border: "1px solid var(--border-light)"
        }}>
          <div className="flex items-center gap-4 mb-4">
            <div style={{ flex: 1, position: "relative" }}>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{
                  position: "absolute",
                  left: "var(--space-3)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)"
                }}
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "var(--space-10)",
                  margin: 0,
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: "var(--text-base)"
                }}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="outline"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-4)"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
              </svg>
              Filters
              {Object.values(filters).some(v => v) && (
                <div style={{
                  width: "8px",
                  height: "8px",
                  background: "var(--primary)",
                  borderRadius: "var(--radius-full)"
                }}></div>
              )}
            </button>
          </div>

          {/* Status Tabs */}
          <div style={{
            display: "flex",
            gap: "var(--space-1)",
            borderRadius: "var(--radius)",
            background: "var(--bg-secondary)",
            padding: "var(--space-1)"
          }}>
            {[
              { key: 'all', label: 'All Tickets', count: stats.total },
              { key: 'open', label: 'Open', count: stats.open },
              { key: 'in-progress', label: 'In Progress', count: stats.inProgress },
              { key: 'resolved', label: 'Resolved', count: stats.resolved },
              { key: 'closed', label: 'Closed', count: stats.closed }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1,
                  padding: "var(--space-2) var(--space-4)",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: activeTab === tab.key ? "var(--surface)" : "transparent",
                  color: activeTab === tab.key ? "var(--text)" : "var(--text-muted)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-medium)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  boxShadow: activeTab === tab.key ? "var(--shadow-sm)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-2)"
                }}
              >
                {tab.label}
                <span style={{
                  background: activeTab === tab.key ? "var(--primary)" : "var(--border)",
                  color: activeTab === tab.key ? "white" : "var(--text-muted)",
                  fontSize: "var(--text-xs)",
                  padding: "0.125rem 0.375rem",
                  borderRadius: "var(--radius-full)",
                  fontWeight: "var(--font-semibold)"
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="card animate-slide-up" style={{ 
            padding: "var(--space-6)",
            marginBottom: "var(--space-8)",
            border: "1px solid var(--border-light)"
          }}>
            <TicketFilters
              filters={filters}
              onFilterChange={setFilters}
              agents={agents}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted">
            {searchTerm || Object.values(filters).some(v => v) 
              ? `Found ${filteredAndSortedTickets.length} tickets matching your criteria`
              : `Showing ${filteredAndSortedTickets.length} tickets`
            }
          </p>
        </div>

        {/* Tickets Grid */}
        <div style={{ marginBottom: "var(--space-8)" }}>
          {error && (
            <div style={{
              background: "var(--error-gradient)",
              color: "white",
              padding: "var(--space-4)",
              borderRadius: "var(--radius)",
              marginBottom: "var(--space-6)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          {filteredAndSortedTickets.length === 0 ? (
            <EmptyState
              type={searchTerm || Object.values(filters).some(v => v) ? "search" : "tickets"}
              title={
                searchTerm || Object.values(filters).some(v => v) 
                  ? 'No tickets match your search criteria' 
                  : `No ${activeTab === 'all' ? '' : activeTab.replace('-', ' ') + ' '}tickets found`
              }
              description={
                user?.role === 'customer' && activeTab === 'all' && !searchTerm 
                  ? "Create your first support ticket to get started with SupportFlow."
                  : "Try adjusting your filters or search terms to find what you're looking for."
              }
              action={
                user?.role === 'customer' && activeTab === 'all' && !searchTerm 
                  ? () => window.location.href = '/tickets/new'
                  : null
              }
                             actionText={user?.role === 'customer' && activeTab === 'all' && !searchTerm ? "Create Your First Ticket" : null}
               size="lg"
             />
          ) : (
            <div style={{
              display: "grid",
              gap: "var(--space-6)",
              gridTemplateColumns: "1fr"
            }}>
              {filteredAndSortedTickets.map((ticket, index) => (
                <div 
                  key={ticket._id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <TicketCard ticket={ticket} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
