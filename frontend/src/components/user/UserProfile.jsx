import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, User, Trophy } from 'lucide-react';
import SolvedProblemsCircleViz from './SolvedProblemsCircleViz';

const UserProfile = () => {
  const { userId, deleteUser, isAdmin } = useAuth();
  const [user, setUser] = useState(null);
  const [solvedProblemsByDifficulty, setSolvedProblemsByDifficulty] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error while fetching user data.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchNumberOfProblems = async () => {
      try {
        const solvedProblems = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/submissions/solved-count/${userId}`);
        setSolvedProblemsByDifficulty(solvedProblems.data);
      } catch (error) {
        console.error("Error while fetching # of problems.", error);
      }
    };
    fetchNumberOfProblems();
  }, [userId]);

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return; 
    }
    try {
      await deleteUser(userId);
      navigate('/'); 
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleEditUser = () => {
    navigate(`/user/profile/edit`);
  };

  const handleViewAllSubmissions = () => {
    navigate(`/user/all-user-submissions`);
  };

  const handleHomeClick = () => {
    navigate(isAdmin ? '/admin-dashboard' : '/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-white/80 to-blue-50/50 dark:from-gray-900 dark:via-gray-800/80 dark:to-blue-900/30">
    {/* Decorative background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>

    {/* Content */}
    <div className="relative z-10 px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">

      <button
          onClick={handleHomeClick}
          className="fixed right-4 top-4 flex items-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white focus:ring-4 focus:outline-none focus:ring-blue-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 active:shadow-md"
        >
          <span className="relative px-5 py-2.5 flex items-center transition-all ease-in duration-200 bg-gray-900/50 rounded-md group-hover:bg-transparent">
            <Home className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
            Home
          </span>
        </button>

      <h1 className="text-center text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
        <User className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3 animate-pulse" />
        User Information
      </h1>

      <button
          onClick={handleViewAllSubmissions}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white focus:ring-4 focus:outline-none focus:ring-blue-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 active:shadow-md"
        >
          <span className="relative px-5 py-2.5 flex items-center transition-all ease-in duration-200 bg-gray-900/50 rounded-md group-hover:bg-transparent">
            <Trophy className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
            All Submissions
          </span>
        </button>

{user ? (
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 relative z-10">

    {/* User Info Card */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* First Name */}
      <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          First Name
        </h3>
        <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
          {user.firstname}
        </p>
      </div>

      {/* Last Name */}
      <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Last Name
        </h3>
        <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
          {user.lastname}
        </p>
      </div>

      {/* Email */}
      <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Email
        </h3>
        <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
          {user.email}
        </p>
      </div>

      {/* Date of Birth */}
      <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Date of Birth
        </h3>
        <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
          {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'N/A'}
        </p>
      </div>

      {/* Registration Date */}
      <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Registration Date
        </h3>
        <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
          {new Date(user.registration_date).toLocaleDateString()}
        </p>
      </div>

      {/* Score */}
      <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Score
        </h3>
        <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
          {user.score ?? 'N/A'}
        </p>
      </div>
    </div>

    {/* Total Solved Problems */}
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Total Solved Problems
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Object.entries(solvedProblemsByDifficulty).map(([difficulty, count]) => (
          <div
            key={difficulty}
            className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm text-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {difficulty}
            </h4>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {count}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Solved Problems Distribution Graph */}
    <div className="relative mt-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Solved Problems Distribution
      </h3>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-200 dark:bg-purple-800 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200 dark:bg-blue-800 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="shadow mt-6 relative z-10 bg-white dark:bg-gray-900 p-6 rounded-lg">
        <SolvedProblemsCircleViz userId={userId} />
      </div>
    </div>
  </div>
) : (
  <p className="text-gray-900 dark:text-white">User not found</p>
)}



    </div>
  </div>
);
};

export default UserProfile;
