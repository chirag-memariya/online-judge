import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const {userId, deleteUser} = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`);
        setUser(response.data);
      } catch (error) { 
        setError('Error fetching user data');
        console.error("Error while fetching user data.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
<div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
  <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
    User Dashboard
  </h1>
  <button
    onClick={handleViewAllSubmissions}
    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-6"
  >
    All Submissions
  </button>
  {user ? (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit User
        </button>
        <button
          onClick={handleDeleteUser}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete User
        </button>
      </div>

      {/* Additional sections like Activity or Achievements */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Total Solved Problems</h3>
        {/* Replace with actual activity data */}
        <ul className="list-disc ml-5 text-gray-900 dark:text-white">
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </div>
    </div>
  ) : (
    <p className="text-gray-900 dark:text-white">User not found</p>
  )}
</div>

  );
};

export default UserProfile;
