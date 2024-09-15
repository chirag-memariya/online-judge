import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Assuming useAuth provides admin functionalities like editUserById

const AdminEditProfile = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const {userId, editUser, isAdmin } = useAuth(); // Assuming editUserById is available in AuthContext
//   const { userId } = useParams(); // Get user ID from URL params
// const [userId,setUserId]=useState('66d9b7274f8c9d308fead1cd');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      // Ensure only admin can access this page
      setError('Access denied. Admin privileges required.');
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`);
        const user = response.data;

        // Set the state with the fetched user data
        setFirstName(user.firstname || '');
        setLastName(user.lastname || '');
        setEmail(user.email || '');
        const formattedDob = user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '';
        setDob(formattedDob);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, isAdmin]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await editUser(userId, firstname, lastname, email, password, dob );
      setSuccess('User updated successfully.');
      navigate(`/admin-dashboard`); // Navigate to users list or admin dashboard on success
    } catch (err) {
      console.error('Error updating user:', err);
      setError('User update failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="ring"></div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 p-4 bg-white shadow rounded">
        <div className="bg-gray-900 p-10 text-white">
          <h2 className="text-3xl font-extrabold tracking-tight">Edit User (Admin)</h2>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
          <form onSubmit={handleEditSubmit} className="mt-6">
            <div className="mt-4">
              <label htmlFor="firstname" className="block text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                className="w-full mt-2 p-2 bg-white text-black rounded border border-gray-300"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="lastname" className="block text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                className="w-full mt-2 p-2 bg-white text-black rounded border border-gray-300"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full mt-2 p-2 bg-white text-black rounded border border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="dob" className="block text-sm font-medium">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                className="w-full mt-2 p-2 bg-white text-black rounded border border-gray-300"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="w-full p-2 bg-white text-black rounded border border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                className="w-full p-2 bg-white text-black rounded border border-gray-300"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminEditProfile;
