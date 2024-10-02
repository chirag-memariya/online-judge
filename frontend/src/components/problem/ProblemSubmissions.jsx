import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle2, Clock, FileCode, User } from "lucide-react";

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
            return <AlertCircle className="text-red-500" />;
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
        className="fixed right-4 top-4 flex items-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out z-50"
      >
        <Home className="w-5 h-5 mr-2" />
        Home
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
