import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();

  // Get the route the user was attempting to visit before being redirected to login
  const from = location.state?.from || '/';
  const item = location.state?.item || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log('Login successful');
      navigate(from, { state: { item } });
    } catch (error) {
      setError("Login failed: " + error.message);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6 py-8">
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      
      {/* Logo and Title */}
      <a href="#" className="flex items-center mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        <img
          className="w-10 h-10 mr-3"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        USER LOGIN
      </a>
      
      {/* Form Container */}
      <div className="w-full bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 border border-gray-200">
        <div className="p-8 space-y-6">
          
          {/* Error Message */}
          {error && <div className="text-sm font-medium text-red-600 bg-red-100 p-2 rounded-md">{error}</div>}
          
          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autocomplete="current-password"
              />
            </div>
            
            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:ring-offset-gray-800"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                Forgot password?
              </a>
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              LOGIN
            </button>
            
            {/* Register and Admin Login Links */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don’t have an account yet?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Register
                </Link>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Login as an admin?{' '}
                <Link to="/admin/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Admin Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  
  )
}

export default LoginForm
