// components/AddAdminUser.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";



const AddAdminUser = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDOB] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { addNewAdmin } = useAuth();  // Use the new function from the context
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/add-admin`,
                {firstname, lastname, email, password,date_of_birth:dob})
                setSuccess('Admin added successfully!');
                navigate('/admin-dashboard');
        } catch (err) {
            setError('Failed to add admin: ' + err.message);
            console.error('Error updating user:', err);
        }finally{
            setLoading(false);
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
    return (
<section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6 py-12">
  <div className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
    <h1 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl dark:text-white mb-6">
      Add Admin User
    </h1>
    {error && <div className="text-red-500 mb-4">{error}</div>}
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Firstname
        </label>
        <input
          type="text"
          name="firstname"
          id="firstname"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Firstname"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Lastname
        </label>
        <input
          type="text"
          name="lastname"
          id="lastname"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Lastname"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Your email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
      </div>
      <div>
        <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          id="dob"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={dob}
          onChange={(e) => setDOB(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirm-password"
          id="confirm-password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        ADD
      </button>
    </form>
  </div>
</section>

    )
};

export default AddAdminUser;
