import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProblemDiscription = ({ item }) => {
  if (!item) {
    return <p>Loading...</p>;
  }
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [problemId, setProblemId] = useState(item._id);

  const handleViewMySubmissions = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/user-problem/submissions', problemId } });
    } else {
      navigate(`/user-problem/submissions`, { state: { problemId } });
    }
  };
  const handleViewProblemSubmissions = () => {
    navigate(`/problem/submissions`, { state: { problemId } });
  };
  return (
<>
  <div className="flex-1 p-5 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
    {/* Buttons Section */}
    <div className="flex gap-4 mb-6">
      <button
        onClick={handleViewMySubmissions}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out"
      >
        My Submissions
      </button>
      <button
        onClick={handleViewProblemSubmissions}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out"
      >
        All Submissions
      </button>
    </div>

    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      {/* Problem Details Section */}
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-400 mb-2">
          Problem Details
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-4">
          {item.title} <span className="text-indigo-500">Problem</span>
        </h3>
        <div className="bg-gray-800 p-4 rounded-md">
          <p className="leading-7 text-gray-300 text-lg">
            {item.statement}
          </p>
        </div>
      </div>

      {/* Input/Output Sample Section */}
      <div className="mb-6">
        <h4 className="text-2xl font-bold text-indigo-400 mb-2">Sample</h4>
        <div className="bg-gray-800 p-4 rounded-md">
          {item.input_output_sample.split('\n').map((line, index) => (
            <div key={index} className="mb-2">
              {line.includes('Example') ? (
                <pre className="font-bold text-gray-200 text-lg mb-1">{line}</pre>
              ) : (
                <div className="pl-4">
                  <pre className="text-gray-200 text-lg whitespace-pre-wrap">
                    {line}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty Section */}
      <h4 className="text-2xl font-bold text-indigo-400 mt-6 mb-2">
        Difficulty
      </h4>
      <p className="leading-7 text-gray-300 text-lg">
        {item.difficulty}
      </p>
    </div>
  </div>
</>


  )
}

export default ProblemDiscription