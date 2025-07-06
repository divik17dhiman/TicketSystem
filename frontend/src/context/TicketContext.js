import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import ApiService from '../services/api';
import { useAuth } from './AuthContext';

const TicketContext = createContext();

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchTickets = useCallback(async () => {
    // Check if already loading to prevent multiple simultaneous calls
    if (loading) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getTickets();
      setTickets(response);
    } catch (error) {
      setError(error.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, []); // Remove loading from dependencies

  const createTicket = async (ticketData) => {
    try {
      const response = await ApiService.createTicket(ticketData);
      setTickets(prev => [response, ...prev]);
      return { success: true, ticket: response };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create ticket'
      };
    }
  };

  const updateTicket = async (ticketId, updateData) => {
    try {
      const response = await ApiService.updateTicket(ticketId, updateData);
      
      setTickets(prev => {
        const updated = prev.map(ticket => {
          if (ticket._id === ticketId) {
            return response;
          }
          return ticket;
        });
        return updated;
      });
      
      return { success: true, ticket: response };
    } catch (error) {
      console.error('Update ticket error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update ticket'
      };
    }
  };

  const getTicketById = (ticketId) => {
    return tickets.find(ticket => ticket._id === ticketId);
  };

  const fetchTicketDetails = useCallback(async (ticketId) => {
    try {
      const response = await ApiService.getTicketById(ticketId);
      
      // Update the ticket in the tickets array with fresh data
      setTickets(prev => {
        const updated = prev.map(ticket =>
          ticket._id === ticketId ? response : ticket
        );
        return updated;
      });
      
      return { success: true, ticket: response };
    } catch (error) {
      console.error('Fetch ticket details error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch ticket details'
      };
    }
  }, []); // Empty dependency array since it doesn't depend on any state

  const addComment = async (ticketId, message, images = []) => {
    try {
      const response = await ApiService.addComment(ticketId, { message, images });
      console.log('Add comment response:', response);
      
      // Update the specific ticket with the full response (which should include all comments)
      setTickets(prev =>
        prev.map(ticket =>
          ticket._id === ticketId ? response : ticket
        )
      );
      
      return { success: true, ticket: response };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to add comment'
      };
    }
  };

  const searchTickets = useCallback(async (searchTerm, filters = {}) => {
    try {
      const response = await ApiService.searchTickets(searchTerm, filters);
      return response;
    } catch (error) {
      console.error('Search tickets error:', error);
      return [];
    }
  }, []);

  const getAgents = useCallback(async () => {
    try {
      const response = await ApiService.getAgents();
      return response;
    } catch (error) {
      console.error('Get agents error:', error);
      return [];
    }
  }, []);

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

  useEffect(() => {
    if (user && !loading) { // Add loading check here too
      fetchTickets();
    }
  }, [user, fetchTickets]); // Keep fetchTickets dependency but it won't change now

  const value = {
    tickets,
    loading,
    error,
    fetchTickets,
    createTicket,
    updateTicket,
    addComment,
    getTicketById,
    fetchTicketDetails,
    getTicketStats,
    searchTickets,
    getAgents
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};
