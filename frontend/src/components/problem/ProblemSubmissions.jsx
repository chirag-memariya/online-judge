import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { XCircleIcon, CheckCircle2, Clock, Loader2, User } from "lucide-react";

import { Home } from 'lucide-react'; // Importing icons

const ProblemSubmissions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const problemId = location.state?.problemId;
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();

  // Fetch submissions for the specific problem when the component mounts
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/submissions/problem/${problemId}`);
        setSubmissions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

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

  const handleHomeClick = () => {
    if (isAdmin) {
      navigate('/admin-dashboard');
    } else {
      navigate('/');
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict.toLowerCase()) {
        case 'accepted':
            return <CheckCircle2 className="text-green-500" />;
        case 'wrong answer':
            return <XCircleIcon className="text-red-500" />;
        default:
            return <Clock className="text-yellow-500" />;
    }
};

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800 p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Home Button */}
      <button
          onClick={handleHomeClick}
          className="fixed right-4 top-4 flex items-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white focus:ring-4 focus:outline-none focus:ring-blue-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 active:shadow-md"
        >
          <span className="relative px-5 py-2.5 flex items-center transition-all ease-in duration-200 bg-gray-900/50 rounded-md group-hover:bg-transparent">
            <Home className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
            Home
          </span>
        </button>

      <h2 className="text-center text-3xl font-semibold text-gray-900 dark:text-white mb-4">
        All Submissions
      </h2>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
              Verdict
            </th>
          </tr>
        </thead>
        <tbody>
          {submissions.length > 0 ? (
            submissions.map((submission, index) => (
              <tr
                key={submission._id}
                className={`transition duration-200 ease-in-out transform hover:translate-x-4 hover:shadow-lg ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
                  } border-b dark:border-gray-700`}
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {submission.user?.firstname} {submission.user?.lastname}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white flex items-center">
                                    {getVerdictIcon(submission.verdict)}
                                    <span className="ml-2">{submission.verdict}</span>
                                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 text-center"
                colSpan="3"
              >
                No submissions available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemSubmissions;
