// AdminEditUser.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AdminEditUser = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      console.log("UserId not Found: "+ userId);
      return; // Ensure userId is defined before fetching
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`);
        const user = response.data;

        // Set the state with the fetched user data
        setFirstName(user.firstname || ''); // Ensure value is never undefined
        setLastName(user.lastname || '');
        setEmail(user.email || '');
        setDob(user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '');
        setRole(user.role || 'user');
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/auth/edit/${userId}`, {
        firstname,
        lastname,
        email,
        password,
        date_of_birth: dob,
      });
      setSuccess('User updated successfully.');
      navigate('/admin-dashboard/user-management'); // Navigate to admin user management page or another page on success
    } catch (err) {
      console.error('Error updating user:', err);
      setError('User update failed. Please try again.');
    }
  };

  return (
    <>
      <div className="flex-1 p-4 bg-white shadow rounded">
        <div className="bg-gray-900 p-10 text-white">
          <h2 className="text-3xl font-extrabold tracking-tight">Edit User</h2>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
          <form onSubmit={handleSubmit} className="mt-6">
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

            <div className="mt-4">
              <label htmlFor="role" className="block text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                className="w-full mt-2 p-2 bg-white text-black rounded border border-gray-300"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                {/* Add more roles as needed */}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
              Update User
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminEditUser;
