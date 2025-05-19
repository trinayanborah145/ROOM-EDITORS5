import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import VideosPage from './pages/VideosPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';

const VideoApp: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <Layout fullWidth>
              <LoginPage />
            </Layout>
          } />
          <Route path="/register" element={
            <Layout fullWidth>
              <RegisterPage />
            </Layout>
          } />
          <Route path="/unauthorized" element={
            <Layout>
              <UnauthorizedPage />
            </Layout>
          } />

          {/* Protected routes */}
          <Route path="/videos" element={
            <ProtectedRoute>
              <Layout>
                <VideosPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Catch all - redirect to /videos */}
          <Route path="*" element={<Navigate to="/videos" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default VideoApp;
