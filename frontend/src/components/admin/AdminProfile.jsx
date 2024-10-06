import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from "lucide-react";


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

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 relative">
        <div className="relative">
          <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
          
          {/* Gradient ring */}
          <div className="absolute inset-0 -m-2">
            <div className="h-20 w-20 rounded-full border-4 border-transparent 
                            bg-gradient-to-r from-blue-500 to-purple-500 
                            opacity-20 animate-spin [animation-duration:3s]" 
                 style={{ clipPath: 'inset(0 0 50% 50%)' }}></div>
          </div>
          
          {/* Orbiting dots */}
          {[...Array(8)].map((_, i) => (
            <div key={i} 
                 className="absolute inset-0 animate-spin"
                 style={{ 
                   animationDuration: '3s',
                   transform: `rotate(${i * 45}deg)`
                 }}>
              <div className="h-2 w-2 rounded-full bg-blue-500 absolute -top-1"
                   style={{
                     animationDelay: `${i * 0.2}s`,
                     opacity: 0.4 + (i * 0.1)
                   }}></div>
            </div>
          ))}
        </div>
        
        {/* Optional progress bar */}
        <div className="absolute bottom-0 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    );
  }
  
  // Add this to your CSS
  const cssAnimation = `
  @keyframes loading {
    0% { width: 0% }
    50% { width: 100% }
    100% { width: 0% }
  }
  `;
  if (error) return <p>{error}</p>;

  return (
<div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
  <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
    Admin Dashboard
  </h1>
  <button
    onClick={handleAddNewAdmin}
    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-6"
  >
    Add New Admin
  </button>
  {admin ? (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Admin Details
      </h2>
      <p>
  <strong className="font-medium text-gray-900 dark:text-white">First Name:</strong> 
  <span className="text-gray-700 dark:text-gray-300">{admin.firstname}</span>
</p>
<p>
  <strong className="font-medium text-gray-900 dark:text-white">Last Name:</strong> 
  <span className="text-gray-700 dark:text-gray-300">{admin.lastname}</span>
</p>
<p>
  <strong className="font-medium text-gray-900 dark:text-white">Email:</strong> 
  <span className="text-gray-700 dark:text-gray-300">{admin.email}</span>
</p>
<p>
  <strong className="font-medium text-gray-900 dark:text-white">Date of Birth:</strong> 
  <span className="text-gray-700 dark:text-gray-300">{admin.date_of_birth ? new Date(admin.date_of_birth).toLocaleDateString() : 'N/A'}</span>
</p>
<p>
  <strong className="font-medium text-gray-900 dark:text-white">Registration Date:</strong> 
  <span className="text-gray-700 dark:text-gray-300">{new Date(admin.registration_date).toLocaleDateString()}</span>
</p>

      {/* Buttons for Edit and Delete */}
      <div className="mt-6 flex gap-4">
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
    <p className="text-gray-900 dark:text-white">Admin not found</p>
  )}
</div>

  );
};

export default AdminProfile;
