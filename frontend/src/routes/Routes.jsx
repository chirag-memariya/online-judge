import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ProblemList from '../pages/ProblemList';
import Leaderboard from '../pages/Leaderboard';
import SubmissionList from '../pages/SubmissionList';
import MySubmissions from '../pages/user/MySubmissions';
import NotFound from '../pages/NotFound';

// Components
import Problem from '../pages/Problem';
import UserProfile from '../components/user/UserProfile';
import EditProfile from '../components/user/EditProfile';
import UserSubmissions from '../components/user/UserSubmissions';
import SubmissionDetailPage from '../components/user/SubmissionsDetailPage';
import ProblemSubmissions from '../components/problem/ProblemSubmissions';

// Admin Components
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminLogin from '../components/auth/AdminLogin';
import AdminProfile from '../components/admin/AdminProfile';
import AdminProblemList from '../components/admin/AdminProblemList';
import CreateProblem from '../components/admin/CreateProblem';
import EditProblem from '../components/admin/EditProblem';
import UserManagement from '../components/admin/UserManagement';
import AdminEditUser from '../components/admin/AdminEditUser';
import AdminEditProfile from '../components/admin/AdminEditProfile';
import AddAdminUser from '../components/admin/AddAdminUser';
import AdminSettings from '../pages/admin/AdminSettings';
import ManageUsers from '../pages/admin/ManageUsers';

// ProtectedRoute component
const ProtectedRoute = ({ element, redirectTo, isAllowed }) => {
  return isAllowed ? element : <Navigate to={redirectTo} />;
};

// Main AppRoutes component
const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<ProtectedRoute isAllowed={!isAuthenticated} element={<Login />} redirectTo="/" />} />
        <Route path="/register" element={<ProtectedRoute isAllowed={!isAuthenticated} element={<Register />} redirectTo="/" />} />
        <Route path="/admin/login" element={<ProtectedRoute isAllowed={!isAuthenticated || isAdmin} element={<AdminLogin />} redirectTo="/admin-dashboard" />} />

        {/* User Authenticated Routes */}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<ProblemList />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="submissionlist" element={<SubmissionList />} />
        </Route>

        {isAuthenticated && (
          <>
            <Route path="/problem" element={<Problem />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/profile/edit" element={<EditProfile />} />
            <Route path="/user/all-user-submissions" element={<UserSubmissions />} />
            <Route path="/problem/submissions" element={<ProblemSubmissions />} />
            <Route path="/user-problem/submissions" element={<MySubmissions />} />
            <Route path="/user/submissions/submission-detail/:submissionId" element={<SubmissionDetailPage />} />
          </>
        )}

        {/* Admin Authenticated Routes */}
        {isAuthenticated && isAdmin && (
          <>
            <Route path="/admin-dashboard" element={<AdminDashboard />}>
              <Route index element={<AdminProfile />} />
              <Route path="problem-list" element={<AdminProblemList />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="submissionlist" element={<SubmissionList />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="create-problem" element={<CreateProblem />} />
            </Route>

            <Route path="/admin/usermanagement" element={<UserManagement />} />
            <Route path="/admin/user/edit/:userId" element={<AdminEditUser />} />
            <Route path="/admin/edit" element={<AdminEditProfile />} />
            <Route path="/admin/add-admin" element={<AddAdminUser />} />
            <Route path="/admin/problems/edit/:problemId" element={<EditProblem />} />
            <Route path="/admin/problems" element={<AdminProblemList />} />
            <Route path="/admin/problems/create" element={<CreateProblem />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
          </>
        )}

        {/* Redirect unauthenticated users */}
        {!isAuthenticated && (
          <>
            <Route path="/problem" element={<Navigate to="/login" state={{ from: '/problem' }} />} />
            <Route path="/leaderboard" element={<Navigate to="/login" state={{ from: '/leaderboard' }} />} />
            <Route path="/user/profile" element={<Navigate to="/login" state={{ from: '/user/profile' }} />} />
          </>
        )}

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
