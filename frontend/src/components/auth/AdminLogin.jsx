import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Assuming you have a function for admin login in AuthContext


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log('Admin Login successful');
      navigate('/admin-dashboard');
    } catch (error) {
      setError('Admin Login failed: ' + error.message);
    }
  };

  return (

<section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6 py-8">
  <div className="flex flex-col items-center justify-center w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 p-6">
    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
      Admin Login
    </h2>
          {/* Form Container */}
          <div className="w-full bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 border border-gray-200">
        <div className="p-8 space-y-6">
    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
    <form className="w-full space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
        >
          Admin Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="w-full p-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="admin@company.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="w-full p-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        LOGIN AS ADMIN
      </button>

      <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400 mt-4">
        Not an admin?{' '}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          User Login
        </Link>
      </p>
    </form>
    
  </div>
  </div>
  </div>
</section>



  );
};

export default AdminLogin;
