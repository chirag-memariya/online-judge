import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Problem from '../pages/Problem';
import Leaderboard from '../pages/Leaderboard';
import UserDetailPage from '../components/user/UserDetailPage';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/problem" element={<Problem />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/user/:userId" element={<UserDetailPage />} />
      
    </Routes>
  </Router>
);

export default AppRoutes;
