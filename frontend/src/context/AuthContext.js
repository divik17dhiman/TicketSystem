import React, { createContext, useContext, useReducer, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user, // Make sure we're setting the user object correctly
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadUser = async () => {
    try {
      const user = await ApiService.getProfile();
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await ApiService.login({ email, password });
      console.log('Login response:', response); // Debug log
      
      // Ensure we have both token and user data
      if (response.token && response.user) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: response });
        return { success: true, user: response.user };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await ApiService.register({ name, email, password });
      console.log('Register response:', response); // Debug log
      
      // Ensure we have both token and user data
      if (response.token && response.user) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: response });
        return { success: true, user: response.user };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Register error:', error);
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Guest login function for UI testing
  const guestLogin = () => {
    const guestUser = {
      token: 'guest-token-' + Date.now(),
      user: {
        id: 'guest-user-id',
        name: 'Guest User',
        email: 'guest@example.com',
        role: 'customer'
      }
    };
    
    dispatch({ type: 'LOGIN_SUCCESS', payload: guestUser });
    return { success: true, user: guestUser.user };
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      guestLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
