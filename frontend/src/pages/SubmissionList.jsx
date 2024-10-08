import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { XCircleIcon, CheckCircle2, Clock, FileCode, User, Loader2 } from "lucide-react";
import '../styles.css'; // Import the scoped CSS

const SubmissionList = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/submissions`);
                // Filter out submissions where problem or user is null
                const filteredSubmissions = response.data.filter(submission => submission.problem !== null && submission.user !== null);
                setSubmissions(filteredSubmissions);
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

    if (error) {
        console.log(error);
    }

    if (submissions.length === 0) {
        return <div>No submissions found.</div>;
    }

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
        <div className="relative min-h-screen bg-gradient-to-br from-white via-white/80 to-blue-50/50 dark:from-gray-900 dark:via-gray-800/80 dark:to-blue-900/30 ">
            {/* Enhanced decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 dark:bg-purple-800 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200 dark:bg-gray-700 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 overflow-x-auto p-5 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <h2 className="text-center text-3xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
                    <FileCode className="mr-2" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        Submissions
                    </span>
                </h2>
                <div className="overflow">
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
                                    className={`transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg ${index % 2 === 0 ? 'bg-white/50 dark:bg-gray-800/50' : 'bg-gray-50/50 dark:bg-gray-700/50'
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
        </div>
    );
};

export default SubmissionList;
