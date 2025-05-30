import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/Header';
import BookmarkPage from './pages/bookmarks/BookmarkPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <BookmarkPage />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/bookmarks" element={<Navigate to="/" replace />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;