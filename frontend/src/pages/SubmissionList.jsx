import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all submissions when the component mounts
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/submissions');
        setSubmissions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (submissions.length === 0) {
    return <div>No submissions found.</div>;
  }

  return (
<div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800 p-4">
  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">All Submissions</h2>
  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
          User
        </th>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
          Problem
        </th>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
          Verdict
        </th>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
          Execution Time
        </th>
        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
          Date Submitted
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
          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
            {submission.user?.firstname} {submission.user?.lastname}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
            {submission.problem?.title}
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
          <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
            {new Date(submission.submitted_at).toLocaleString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default SubmissionList;
