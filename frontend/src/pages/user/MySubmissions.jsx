import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const MySubmissions = () => {
  const location = useLocation();
  const problemId = location.state?.problemId;
  const {userId} = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);


  // Fetch submissions based on userId and problemId
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/submissions/user/${userId}/problem/${problemId}`);
        setSubmissions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [userId, problemId]);

// Function to open the modal with the selected submission's details
const openModal = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
  };

  
  if (loading) {
    return <div>Loading submissions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (submissions.length === 0) {
    return <div>No submissions found for this user and problem combination.</div>;
  }

  return (
<div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800 p-4">
<h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
    Submissions
  </h2>
  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
          Verdict
        </th>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
          Execution Time
        </th>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
          Date Submitted
        </th>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
          Action
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
          <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
            {new Date(submission.submitted_at).toLocaleString()}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              onClick={() => openModal(submission)}
            >
              View Solution
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Modal for displaying submission details */}
  {showModal && selectedSubmission && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{selectedSubmission.verdict}</h3>
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={closeModal}
          >
            &times;
          </button>
        </div>
        <p className="mb-4">Execution Time: {selectedSubmission.execution_time} ms</p>
        <div className="overflow-y-auto h-64">
          <pre className="bg-gray-100 p-4 rounded-md">
            <code className="text-sm">
              {selectedSubmission.solution}
            </code>
          </pre>
        </div>
        <div className="mt-4 text-right">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default MySubmissions;
