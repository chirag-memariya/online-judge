import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
  const { userId, isAdmin, deleteUser } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`);
        setAdmin(response.data);
      } catch (error) {
        setError('Error fetching admin data');
        console.error("Error while fetching admin data.", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchAdminData();
    } else {
      setError('Access denied. You are not an admin.');
      setLoading(false);
    }
  }, [userId]);

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete your admin account? This action cannot be undone.')) {
      return; // Exit if user cancels
    }
    try {
      await deleteUser(userId);
      navigate('/'); // Redirect to home or login page
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin. Please try again.');
    }
  };

  const handleEditAdmin = () => {
    navigate(`/admin/edit`);
  };

  const handleAddNewAdmin = () => {
    navigate(`/admin/add-admin`); // Navigate to the new admin creation page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button
    onClick={handleAddNewAdmin}
    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
  >
    Add New Admin
  </button>
      {
        admin ? (
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Admin Details</h2>
          <p><strong>First Name:</strong> {admin.firstname}</p>
          <p><strong>Last Name:</strong> {admin.lastname}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Date of Birth:</strong> {admin.date_of_birth ? new Date(admin.date_of_birth).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Registration Date:</strong> {new Date(admin.registration_date).toLocaleDateString()}</p>

          {/* Buttons for Edit and Delete */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleEditAdmin}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Admin
            </button>
            <button
              onClick={handleDeleteUser}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete Admin
            </button>
          </div>
        </div>
      ) : (
        <p>Admin not found</p>
      )}
    </div>
  );
};

export default AdminProfile;
