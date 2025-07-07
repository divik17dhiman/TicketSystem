import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';

const TicketAssignment = ({ ticket, onUpdate }) => {
  const { user } = useAuth();
  const { getAgents } = useTickets();
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(ticket.assignedTo?._id || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const agentList = await getAgents();
      setAgents(agentList);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const handleAssignment = async (agentId) => {
    if (agentId === selectedAgent) return;
    
    setIsUpdating(true);
    try {
      const updateData = agentId ? { assignedTo: agentId } : { assignedTo: null };
      const result = await onUpdate(updateData);
      
      if (result.success) {
        setSelectedAgent(agentId);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Only show for agents and admins
  if (user?.role === 'customer') {
    return ticket.assignedTo ? (
      <div className="flex items-center gap-3" style={{
        padding: "var(--space-3) var(--space-4)",
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border-light)"
      }}>
        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "var(--radius-full)",
          background: "var(--success-gradient)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-semibold)"
        }}>
          {ticket.assignedTo.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-medium">
            Assigned to {ticket.assignedTo.name}
          </div>
          <div className="text-xs text-muted">
            {ticket.assignedTo.role === 'admin' ? '👑 Admin' : '🎧 Agent'}
          </div>
        </div>
      </div>
    ) : (
      <div style={{
        padding: "var(--space-3) var(--space-4)",
        background: "var(--warning-light)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--warning-border)",
        color: "var(--warning-text)"
      }}>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span className="text-sm font-medium">Unassigned</span>
        </div>
      </div>
    );
  }

  const currentAgent = ticket.assignedTo;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        background: "var(--surface)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border-light)",
        padding: "var(--space-4)",
        boxShadow: "var(--shadow-sm)"
      }}>
        <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
          🎯 Assignment
        </h4>

        {/* Current Assignment */}
        <div style={{ marginBottom: "var(--space-4)" }}>
          {currentAgent ? (
            <div className="flex items-center justify-between p-3" style={{
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border-light)"
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--success-gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-semibold)"
                }}>
                  {currentAgent.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {currentAgent.name}
                  </div>
                  <div className="text-xs text-muted">
                    {currentAgent.role === 'admin' ? '👑 Admin' : '🎧 Agent'}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="hover-scale"
                style={{
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  border: "none",
                  borderRadius: "var(--radius)",
                  padding: "var(--space-2) var(--space-3)",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-semibold)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                Reassign
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3" style={{
              background: "var(--warning-light)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--warning-border)"
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: "var(--text-lg)"
                }}>
                  ?
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--warning-text)" }}>
                    Unassigned
                  </div>
                  <div className="text-xs" style={{ color: "var(--warning-text)", opacity: 0.8 }}>
                    No agent assigned
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="hover-scale"
                style={{
                  background: "var(--primary-gradient)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius)",
                  padding: "var(--space-2) var(--space-4)",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-semibold)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                Assign
              </button>
            </div>
          )}
        </div>

        {/* Assignment Dropdown */}
        {showDropdown && (
          <div className="animate-slide-up" style={{
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-md)",
            padding: "var(--space-3)",
            maxHeight: "240px",
            overflowY: "auto"
          }}>
            <div className="text-xs font-semibold text-muted mb-3" style={{ textTransform: "uppercase", letterSpacing: "0.025em" }}>
              Available Agents
            </div>

            {/* Unassign Option */}
            {currentAgent && (
              <button
                onClick={() => handleAssignment('')}
                disabled={isUpdating}
                className="hover-lift"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3)",
                  marginBottom: "var(--space-2)",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  textAlign: "left"
                }}
              >
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "var(--text-base)"
                }}>
                  ✖️
                </div>
                <div>
                  <div className="text-sm font-medium">Unassign Ticket</div>
                  <div className="text-xs text-muted">Remove current assignment</div>
                </div>
              </button>
            )}

            {/* Agent Options */}
            {agents.map((agent) => (
              <button
                key={agent._id}
                onClick={() => handleAssignment(agent._id)}
                disabled={isUpdating || agent._id === selectedAgent}
                className="hover-lift"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3)",
                  marginBottom: "var(--space-2)",
                  background: agent._id === selectedAgent ? "var(--primary-light)" : "var(--bg)",
                  border: `1px solid ${agent._id === selectedAgent ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: "var(--radius)",
                  cursor: agent._id === selectedAgent ? "default" : "pointer",
                  transition: "all var(--transition-fast)",
                  textAlign: "left",
                  opacity: agent._id === selectedAgent ? 0.7 : 1
                }}
              >
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-full)",
                  background: agent.role === 'admin' ? "var(--error-gradient)" : "var(--primary-gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-semibold)"
                }}>
                  {agent.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{agent.name}</span>
                    {agent._id === user._id && (
                      <span style={{
                        background: "var(--success-light)",
                        color: "var(--success-text)",
                        fontSize: "var(--text-xs)",
                        padding: "var(--space-1) var(--space-2)",
                        borderRadius: "var(--radius-sm)",
                        fontWeight: "var(--font-medium)"
                      }}>
                        Me
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted">
                    {agent.role === 'admin' ? '👑 Admin' : '🎧 Agent'} • {agent.email}
                  </div>
                </div>
              </button>
            ))}

            {/* Quick Assign to Self */}
            {user && !currentAgent && agents.find(a => a._id === user._id) && (
              <div style={{ 
                marginTop: "var(--space-4)", 
                paddingTop: "var(--space-3)", 
                borderTop: "1px solid var(--border-light)" 
              }}>
                <button
                  onClick={() => handleAssignment(user._id)}
                  disabled={isUpdating}
                  className="hover-scale"
                  style={{
                    width: "100%",
                    background: "var(--primary-gradient)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--radius)",
                    padding: "var(--space-3)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-semibold)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  {isUpdating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="loading-spinner sm"></div>
                      Assigning...
                    </div>
                  ) : (
                    '🙋‍♂️ Assign to Me'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isUpdating && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--radius)"
          }}>
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketAssignment; 