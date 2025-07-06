import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketForm from './pages/TicketForm';
import TicketDetails from './pages/TicketDetails';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/globals.css';
import './styles/animations.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TicketProvider>
          <Router>
            <div className="app">
              <Navbar />
              <main className="main-content">
                <div className="flex-1">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/tickets/new" 
                      element={
                        <ProtectedRoute>
                          <TicketForm />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/tickets/:id" 
                      element={
                        <ProtectedRoute>
                          <TicketDetails />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </div>
              </main>
            </div>
          </Router>
        </TicketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
