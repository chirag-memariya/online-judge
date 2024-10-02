import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus, Shield } from 'lucide-react';
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
<div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-6 py-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-30"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100 dark:border-gray-700">
          {/* Logo and Title */}
          <div className="flex flex-col items-center">
            <div className="bg-blue-600 p-3 rounded-2xl mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Please enter your details</p>
          </div>
          
          {/* Form Container */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 p-3 rounded-lg text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            )}
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  className="pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  id="password"
                  className="pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>
            
            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Forgot password?
              </a>
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </button>
            
            {/* Register and Admin Login Links */}
            <div className="space-y-4">
              <Link to="/register" className="w-full py-3 px-4 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </Link>
              
              <Link to="/admin/login" className="w-full py-3 px-4 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Admin Login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
