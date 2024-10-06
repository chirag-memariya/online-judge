// UserManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // Icons from Lucide React


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching users');
        console.error("Error while fetching users.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    navigate(`/admin/user/edit/${userId}`);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/delete/${userId}`);
      console.warn("User: "+userId+" deleted successfully!");
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
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
<div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800 p-4">
  <h2 className="text-center text-3xl font-semibold text-gray-900 dark:text-white mb-4">User Management</h2>
  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">User ID</th>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">Name</th>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">Email</th>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user, index) => (
        <tr
          key={user._id}
          className={`transition duration-200 ease-in-out transform hover:translate-x-4 ${
            index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
          } border-b dark:border-gray-700`}
        >
          <td className="px-6 py-4 text-gray-900 dark:text-white">{user._id}</td>
          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
            {user.firstname} {user.lastname}
          </td>
          <td className="px-6 py-4 text-gray-900 dark:text-white">{user.email}</td>
          <td className="px-6 py-4 flex gap-2">
            <button
              onClick={() => handleEdit(user._id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(user._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default UserManagement;
