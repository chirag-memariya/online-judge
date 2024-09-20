import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProblemSubmissions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const problemId = location.state?.problemId;
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {isAdmin} = useAuth();

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
      <div className="loading-container">
        <div className="ring"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (submissions.length === 0) {
    return <div>No submissions found for this problem.</div>;
  }
  const handleHomeClick = () => {
    if(isAdmin){
      navigate('/admin-dashboard')
    }else{
      navigate('/');
    }
  };


  return (
<div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800 p-4">
  {/* Home Button */}
  <button
  onClick={handleHomeClick}
  className="fixed right-4 top-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out z-50"
>
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
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
          Execution Time
        </th>
      </tr>
    </thead>
    <tbody>
      {submissions.map((submission, index) => (
        <tr
          key={submission._id}
          className={`transition duration-200 ease-in-out transform hover:translate-x-4 ${
            index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"
          } border-b dark:border-gray-700`}
        >
          <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
            {submission.user?.firstname} {submission.user?.lastname}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`px-4 py-1 rounded-full text-white ${
                submission.verdict === "Accepted"
                  ? "bg-green-600"
                  : submission.verdict === "Rejected"
                  ? "bg-red-600"
                  : "bg-yellow-600"
              }`}
            >
              {submission.verdict}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
            {submission.execution_time} ms
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default ProblemSubmissions;
