import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketForm from './pages/TicketForm';
import TicketDetails from './pages/TicketDetails';
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/globals.css';
import './styles/animations.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TicketProvider>
          <Router>
            <div style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg)'
            }}>
              <Navbar />
              <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
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
                  <Route 
                    path="/admin/users" 
                    element={
                      <ProtectedRoute>
                        <UserManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </TicketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
