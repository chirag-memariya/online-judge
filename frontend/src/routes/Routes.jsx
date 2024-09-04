import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Problem from '../pages/Problem';
import Leaderboard from '../pages/Leaderboard';
import UserDetailPage from '../components/user/UserDetailPage';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" 
          element={<Home />}
        />
        {/* Authenticated Routes */}

        <Route
          path="/problem"
          element={
            isAuthenticated ? (
              <Problem />
            ) : (
              <Navigate to="/login" state={{ from: '/problem',item: null}} />
            )
          }
        />
        <Route
          path="/leaderboard"
          element={
            isAuthenticated ? (
              <Leaderboard />
            ) : (
              <Navigate to="/login" state={{ from: '/leaderboard' }} />
            )
          }
        />
        <Route
          path="/user/:userId"
          element={
            isAuthenticated ? (
              <UserDetailPage />
            ) : (
              <Navigate to="/login" state={{ from: `/user/:userId` }} />
            )
          }
        />

        {/* Redirect to Home if already authenticated */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />

        {/* Fallback Route for undefined paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

// Optional: NotFound Component for 404 Errors
const NotFound = () => (
  <div>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

export default AppRoutes;
