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
        const response = await axios.get(`http://localhost:8000/users/${userId}`);
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
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <button
            onClick={handleViewAllSubmissions}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            All Submissions
          </button>
      {user ? (
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">User Details</h2>
          <p><strong>First Name:</strong> {user.firstname}</p>
          <p><strong>Last Name:</strong> {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Date of Birth:</strong> {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Registration Date:</strong> {new Date(user.registration_date).toLocaleDateString()}</p>
          <p><strong>Score:</strong> {user.score ?? 'N/A'}</p>

          {/* Buttons for Edit and Delete */}
          <div className="mt-4 flex gap-4">
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
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Total solved Problem</h3>
            {/* Replace with actual activity data */}
            <ul className="list-disc ml-5">
              <li>1</li>
              <li>2</li>
              <li>3</li>
            </ul>
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserProfile;
