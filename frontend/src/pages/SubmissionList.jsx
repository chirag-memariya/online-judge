import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle2, Clock, FileCode, User } from "lucide-react";
import '../styles.css'; // Import the scoped CSS

const SubmissionList = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/submissions`);
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
      return (
          <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
      );
  }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (submissions.length === 0) {
        return <div>No submissions found.</div>;
    }

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
        <div className="relative min-h-screen">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Content */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-5">
                <h2 className="text-center text-3xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
                    <FileCode className="mr-2" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        All Submissions
                    </span>
                </h2>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">User</th>
                            <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">Problem</th>
                            <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">Verdict</th>
                            <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">Date Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((submission, index) => (
                            <tr
                                key={submission._id}
                                className={`transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg ${
                                    index % 2 === 0 ? 'bg-white/50 dark:bg-gray-800/50' : 'bg-gray-50/50 dark:bg-gray-700/50'
                                } border-b dark:border-gray-700`}
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    <div className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        {submission.user?.firstname} {submission.user?.lastname}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                                    {submission.problem?.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white flex items-center">
                                    {getVerdictIcon(submission.verdict)}
                                    <span className="ml-2">{submission.verdict}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                                    {new Date(submission.submitted_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubmissionList;
