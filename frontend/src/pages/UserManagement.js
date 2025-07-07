import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const UserManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    // Redirect non-admins
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.request('/users');
      setUsers(response);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      await apiService.request(`/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      
      // Update local state
      setUsers(prev => 
        prev.map(u => 
          u._id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getRoleConfig = (role) => {
    const configs = {
      admin: {
        label: 'Admin',
        icon: '👑',
        gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
        bg: 'rgba(231, 76, 60, 0.1)',
        text: '#e74c3c'
      },
      agent: {
        label: 'Agent',
        icon: '🎧',
        gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
        bg: 'rgba(52, 152, 219, 0.1)',
        text: '#3498db'
      },
      customer: {
        label: 'Customer',
        icon: '👤',
        gradient: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
        bg: 'rgba(108, 117, 125, 0.1)',
        text: '#6c757d'
      }
    };
    return configs[role] || configs.customer;
  };

  const getPermissionList = (role) => {
    const permissions = {
      admin: [
        'Manage all tickets',
        'Assign tickets to agents',
        'Manage user roles',
        'Access admin panel',
        'View all analytics'
      ],
      agent: [
        'View assigned tickets',
        'Update ticket status',
        'Add comments',
        'Assign tickets to self'
      ],
      customer: [
        'Create new tickets',
        'View own tickets',
        'Add comments',
        'Upload attachments'
      ]
    };
    return permissions[role] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-spinner lg"></div>
          <p className="text-muted">Loading users...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center" style={{ maxWidth: "400px", padding: "var(--space-8)" }}>
          <div style={{ fontSize: "64px", marginBottom: "var(--space-4)" }}>🚫</div>
          <h2 className="text-xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    agents: users.filter(u => u.role === 'agent').length,
    customers: users.filter(u => u.role === 'customer').length
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "1200px", padding: "var(--space-8) var(--space-6)" }}>
        {/* Header */}
        <div className="animate-slide-up" style={{ marginBottom: "var(--space-8)" }}>
          <h1 className="text-4xl font-bold mb-2">👑 User Management</h1>
          <p className="text-xl text-muted">Manage user accounts and permissions</p>
        </div>

        {/* Stats Cards */}
        <div className="animate-slide-up delay-100" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-6)",
          marginBottom: "var(--space-8)"
        }}>
          {[
            { label: "Total Users", value: userStats.total, icon: "👥", color: "var(--primary)" },
            { label: "Admins", value: userStats.admins, icon: "👑", color: "#e74c3c" },
            { label: "Agents", value: userStats.agents, icon: "🎧", color: "#3498db" },
            { label: "Customers", value: userStats.customers, icon: "👤", color: "#6c757d" }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="card hover-lift"
              style={{
                padding: "var(--space-6)",
                textAlign: "center",
                background: "var(--surface)",
                borderLeft: `4px solid ${stat.color}`
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "var(--space-2)" }}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="card animate-shake" style={{
            background: "var(--error-gradient)",
            color: "white",
            padding: "var(--space-4)",
            marginBottom: "var(--space-8)",
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

        {/* Users List */}
        <div className="card animate-slide-up delay-200" style={{ padding: "var(--space-6)" }}>
          <h2 className="text-2xl font-semibold mb-6">All Users</h2>

          <div style={{ overflowX: "auto" }}>
            <div style={{
              display: "grid",
              gap: "var(--space-4)",
              gridTemplateColumns: "1fr"
            }}>
              {users.map((userData, index) => {
                const roleConfig = getRoleConfig(userData.role);
                const permissions = getPermissionList(userData.role);
                
                return (
                  <div
                    key={userData._id}
                    className="animate-slide-up hover-lift"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      background: "var(--bg-secondary)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border-light)",
                      padding: "var(--space-6)",
                      transition: "all var(--transition)"
                    }}
                  >
                    {/* User Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "var(--radius-full)",
                          background: roleConfig.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "var(--text-xl)",
                          fontWeight: "var(--font-bold)"
                        }}>
                          {userData.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        {/* User Info */}
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {userData.name}
                            {userData._id === user._id && (
                              <span style={{
                                background: "var(--success-light)",
                                color: "var(--success-text)",
                                fontSize: "var(--text-xs)",
                                padding: "var(--space-1) var(--space-2)",
                                borderRadius: "var(--radius-sm)",
                                fontWeight: "var(--font-medium)",
                                marginLeft: "var(--space-2)"
                              }}>
                                You
                              </span>
                            )}
                          </h3>
                          <p className="text-muted mb-2">{userData.email}</p>
                          
                          {/* Current Role Badge */}
                          <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "var(--space-2)",
                            background: roleConfig.bg,
                            color: roleConfig.text,
                            padding: "var(--space-2) var(--space-3)",
                            borderRadius: "var(--radius-full)",
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-semibold)",
                            border: `1px solid ${roleConfig.text}33`
                          }}>
                            <span>{roleConfig.icon}</span>
                            <span>{roleConfig.label}</span>
                          </div>
                        </div>
                      </div>

                      {/* Role Management */}
                      {userData._id !== user._id && (
                        <div style={{ minWidth: "200px" }}>
                          <label className="text-sm font-medium text-muted mb-2" style={{ display: "block" }}>
                            Change Role:
                          </label>
                          <select
                            value={userData.role}
                            onChange={(e) => updateUserRole(userData._id, e.target.value)}
                            disabled={updatingUserId === userData._id}
                            style={{
                              width: "100%",
                              padding: "var(--space-2) var(--space-3)",
                              borderRadius: "var(--radius)",
                              border: "2px solid var(--border)",
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-medium)",
                              transition: "border-color var(--transition-fast)"
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "var(--primary)";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "var(--border)";
                            }}
                          >
                            <option value="customer">👤 Customer</option>
                            <option value="agent">🎧 Agent</option>
                            <option value="admin">👑 Admin</option>
                          </select>
                          
                          {updatingUserId === userData._id && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="loading-spinner sm"></div>
                              <span className="text-xs text-muted">Updating...</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Permissions */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted mb-3" style={{ 
                        textTransform: "uppercase", 
                        letterSpacing: "0.025em" 
                      }}>
                        Permissions
                      </h4>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "var(--space-2)"
                      }}>
                        {permissions.map((permission, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2"
                            style={{
                              padding: "var(--space-2)",
                              background: "var(--surface)",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "var(--text-sm)"
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--success)" }}>
                              <polyline points="20,6 9,17 4,12"/>
                            </svg>
                            <span>{permission}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Account Details */}
                    <div style={{
                      marginTop: "var(--space-4)",
                      paddingTop: "var(--space-4)",
                      borderTop: "1px solid var(--border-light)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div className="text-xs text-muted">
                        Joined: {new Date(userData.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted">
                        ID: {userData._id.slice(-6)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 