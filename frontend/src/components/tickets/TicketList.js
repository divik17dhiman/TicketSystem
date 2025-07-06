import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await ApiService.getTickets();
      setTickets(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': '#007bff',
      'in-progress': '#ffc107',
      'resolved': '#28a745',
      'closed': '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) return <div>Loading tickets...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="ticket-list">
      <h2>My Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <div className="tickets">
          {tickets.map(ticket => (
            <div key={ticket._id} className="ticket-card">
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
              <div className="ticket-meta">
                <span 
                  className="status" 
                  style={{ backgroundColor: getStatusColor(ticket.status) }}
                >
                  {ticket.status}
                </span>
                <span className="priority">{ticket.priority}</span>
                <span className="category">{ticket.category}</span>
              </div>
              <div className="ticket-footer">
                <small>Created: {new Date(ticket.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;
