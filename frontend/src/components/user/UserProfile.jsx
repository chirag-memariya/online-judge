import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap, User } from 'lucide-react'; // Added User icon for user profile
import SolvedProblemsCircleViz from './SolvedProblemsCircleViz';

const UserProfile = () => {
  const { userId, deleteUser } = useAuth();
  const [user, setUser] = useState(null);
  const [solvedProblemsByDifficulty, setSolvedProblemsByDifficulty] = useState({
    easy: 0,
    medium: 0,
    hard: 0
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
      return; // Exit if user cancels
    }
    try {
      await deleteUser(userId);
      navigate('/'); // Redirect to home or login page
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="ring"></div>
        <span>Loading...</span>
      </div>
    );
  }
  if (error) return <p>{error}</p>;

  return (
    <div className="relative p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
        <User className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3 animate-pulse" />
        User Dashboard
      </h1>
      <button
        onClick={handleViewAllSubmissions}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-6 transition duration-300 ease-in-out transform hover:scale-105"
      >
        All Submissions
      </button>
      {user ? (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 relative z-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            User Details
          </h2>
          <p><strong className="font-medium text-gray-900 dark:text-white">First Name:</strong> <span className="text-blue-600 dark:text-blue-400">{user.firstname}</span></p>
          <p><strong className="font-medium text-gray-900 dark:text-white">Last Name:</strong> <span className="text-blue-600 dark:text-blue-400">{user.lastname}</span></p>
          <p><strong className="font-medium text-gray-900 dark:text-white">Email:</strong> <span className="text-blue-600 dark:text-blue-400">{user.email}</span></p>
          <p><strong className="font-medium text-gray-900 dark:text-white">Date of Birth:</strong> <span className="text-blue-600 dark:text-blue-400">{user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'N/A'}</span></p>
          <p><strong className="font-medium text-gray-900 dark:text-white">Registration Date:</strong> <span className="text-blue-600 dark:text-blue-400">{new Date(user.registration_date).toLocaleDateString()}</span></p>
          <p><strong className="font-medium text-gray-900 dark:text-white">Score:</strong> <span className="text-blue-600 dark:text-blue-400">{user.score ?? 'N/A'}</span></p>

          {/* Buttons for Edit and Delete */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleEditUser}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Edit User
            </button>
            <button
              onClick={handleDeleteUser}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Delete User
            </button>
          </div>

          {/* Total Solved Problems Section with Decorative Background */}
          <div className="relative mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Total Solved Problems</h3>
            <div className="grid grid-cols-3 gap-4 relative z-10">
              {Object.entries(solvedProblemsByDifficulty).map(([difficulty, count]) => (
                <div key={difficulty} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition duration-300 ease-in-out">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 capitalize">{difficulty}</h4>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solved Problems Distribution Section */}
          <div className="relative mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Solved Problems Distribution</h3>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-200 dark:bg-purple-800 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200 dark:bg-blue-800 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <div className="shadow mt-6 relative z-10">
              <SolvedProblemsCircleViz userId={userId} />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-900 dark:text-white">User not found</p>
      )}
    </div>
  );
};

export default UserProfile;
