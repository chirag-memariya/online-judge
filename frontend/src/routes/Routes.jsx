import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Problem from '../pages/Problem';
import ProblemList from '../pages/ProblemList';
import Leaderboard from '../pages/Leaderboard';
import NotFound from '../pages/NotFound';
import AdminHome from '../pages/admin/AdminHome';
import AdminSettings from '../pages/admin/AdminSettings';
import ManageUsers from '../pages/admin/ManageUsers';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import UserProfile from '../components/user/UserProfile';

import CreateProblem from '../components/admin/CreateProblem';
import EditProblem from '../components/admin/EditProblem';
import EditProfile from '../components/user/EditProfile';
import Dashboard from '../pages/Dashboard';

// import EditProfile from '../components/user/EditProfile';

const AppRoutes = () => {
  const { isAdmin, isAuthenticated } = useAuth(); // Destructuring to get user info

  return (
    <>
      <Router>
        <Routes>
          {/* Public Route */}
          {/* <Route path="/" element={<MainLayout />}></Route> */}
          
          <Route path="/" element={<Dashboard />}>
            <Route index element={<ProblemList />} />
            <Route path="problemlist" element={<ProblemList />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>

          <Route path="/problem/edit" element={<EditProblem />} />
          <Route path="/user/profile/edit" element={<EditProfile />} />


          {/* Redirect to Home if already authenticated */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
          />

          {/* User Authenticated Routes */}
          {isAuthenticated && (
            <>
              <Route path="/problem" element={<Problem />} />
              {/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
              <Route path="/user/profile" element={<UserProfile />} />
            </>
          )}

          {/* Admin Authenticated Routes */}
          {isAuthenticated && isAdmin && (
            <>
              <Route path="/admin/home" element={<AdminHome />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/manage-users" element={<ManageUsers />} />
              <Route path="/problems/create" element={<CreateProblem />} />

            </>
          )}

          {/* Redirect to login if not authenticated */}
          {!isAuthenticated && (
            <>
              <Route path="/problem" element={<Navigate to="/login" state={{ from: '/problem', item: null }} />} />
              <Route path="/leaderboard" element={<Navigate to="/login" state={{ from: '/leaderboard' }} />} />
              <Route path="/user/profile" element={<Navigate to="/login" state={{ from: `/user/profile` }} />} />
              <Route path="/admin/home" element={<Navigate to="/login" />} />
              <Route path="/admin/settings" element={<Navigate to="/login" />} />
              <Route path="/admin/manage-users" element={<Navigate to="/login" />} />
            </>
          )}

          {/* Fallback Route for undefined paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRoutes;
