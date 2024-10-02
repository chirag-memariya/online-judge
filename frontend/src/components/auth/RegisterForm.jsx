import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, UserPlus, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const RegisterForm = () => {

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDOB] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {register} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setError('password do not match!');
            return;
        }
        try {
            await register(firstname,lastname,email,password,dob);
            console.log('Registration successful');
            navigate('/login');
        } catch (error) {
            setError("registration failed: " + error.message);
        }
    }

    return (
<div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-6 py-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="bg-blue-600 p-3 rounded-2xl mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Join us today!</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 p-3 rounded-lg text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            )}
            
            {/* Name Fields - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Firstname */}
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    id="firstname"
                    className="pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all text-gray-900 dark:text-white"
                    placeholder="John"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* Lastname */}
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    id="lastname"
                    className="pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all text-gray-900 dark:text-white"
                    placeholder="Doe"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  className="pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>
            
            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  id="dob"
                  className="pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all text-gray-900 dark:text-white"
                  value={dob}
                  onChange={(e) => setDOB(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  id="password"
                  className="pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  id="confirm-password"
                  className="pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
            
            {/* Terms Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                  required
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                I accept the{' '}
                <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                  Terms and Conditions
                </a>
              </label>
            </div>
            
            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Account</span>
            </button>
            
            {/* Login Link */}
            <Link 
              to="/login"
              className="w-full py-3 px-4 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Login</span>
            </Link>
          </form>
        </div>
      </div>
    </div>


    )
}

export default RegisterForm