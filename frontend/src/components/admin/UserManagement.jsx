// UserManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users');
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
      await axios.delete(`http://localhost:8000/users/delete/${userId}`);
      console.warn("User: "+userId+" deleted successfully!");
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800 p-4">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white text-left">User ID</th>
              <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white text-left">Name</th>
              <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white text-left">Email</th>
              <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-4">{user._id}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.firstname} {user.lastname}</td>
                <td className="px-6 py-4">{user.email}</td>
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
    </div>
  );
};

export default UserManagement;
