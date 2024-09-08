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
import UserManagement from '../components/admin/UserManagement';
import AdminEditUser from '../components/admin/AdminEditUser';
import AddAdminUser from '../components/admin/AddAdminUser';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminProblemList from '../components/admin/AdminProblemList';
import AdminEditProfile from '../components/admin/AdminEditProfile';
import AdminLogin from '../components/auth/AdminLogin';
import AdminProfile from '../components/admin/AdminProfile';
import isAdmin from '../utils/authUtils';



// import EditProfile from '../components/user/EditProfile';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/admin/usermanagement" element={<UserManagement />}></Route>
          <Route path="/admin/user/edit/:userId" element={<AdminEditUser />}></Route>
          
          <Route path="/admin/login" element={<AdminLogin />}></Route>
          <Route path="/admin/edit" element={<AdminEditProfile />}></Route>
          
          <Route path="/admin/add-admin" element={<AddAdminUser />}></Route>
          <Route path="/admin/problems/edit/:problemId" element={<EditProblem />} />
          <Route path="/admin/problems/create" element={<CreateProblem />} />
          <Route path="/admin/problems" element={<AdminProblemList />} />



          {/* user-dashboard */}
          <Route path="/" element={<Dashboard />}>
            <Route index element={<ProblemList />} />
            {/* <Route path="problemlist" element={<ProblemList />} /> */}
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>

          {/* admin-dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminProfile />} />
            {/* <Route path="add-admin" element={<ProblemList />} /> */}
            <Route path="problem-list" element={<AdminProblemList />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="create-problem" element={<CreateProblem />} />


          </Route>

          <Route path="/user/profile/edit" element={<EditProfile />} />


          {/* Redirect to Home if already authenticated */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/admin/login"
            element={isAuthenticated && isAdmin()  ? <Navigate to="/admin-dashboard" /> : <Login />}
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
          {isAuthenticated && isAdmin() && (
            <>
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/manage-users" element={<ManageUsers />} />

            </>
          )}

          {/* Redirect to login if not authenticated */}
          {!isAuthenticated && (
            <>
              <Route path="/problem" element={<Navigate to="/login" state={{ from: '/problem', item: null }} />} />
              <Route path="/leaderboard" element={<Navigate to="/login" state={{ from: '/leaderboard' }} />} />
              <Route path="/user/profile" element={<Navigate to="/login" state={{ from: `/user/profile` }} />} />
              <Route path="/admin/profile" element={<Navigate to="/admin/login" state={{ from: `/admin/profile` }} />} />
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
