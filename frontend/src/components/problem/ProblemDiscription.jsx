import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProblemDiscription = ({item}) => {
    if(!item){
        return <p>Loading...</p>;
    }
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();
    const [problemId,setProblemId] = useState(item._id);

    const handleViewMySubmissions = () => {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: '/user-problem/submissions', problemId} });
    } else {
        navigate(`/user-problem/submissions`, { state: { problemId } });
    }
    };
    const handleViewProblemSubmissions = () => {
      navigate(`/problem/submissions`,{state: {problemId}});
    };
    return (
    <>
<div className="flex-1 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
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

  {/* Problem Details Section */}
  <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
    <p className="text-sm font-medium uppercase tracking-wide text-gray-400 mb-2">
      Problem Details
    </p>
    <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-4">
      {item.title} <span className="text-indigo-500">Problem</span>
    </h3>
    <p className="leading-7 text-gray-300 mb-6">
      {item.statement}
    </p>

    {/* Input/Output Sample Section */}
    <h4 className="text-2xl font-bold text-indigo-400 mt-6 mb-2">
      Input/Output Sample
    </h4>
    <p className="leading-7 text-gray-300 mb-6">
      {item.input_output_sample}
    </p>

    {/* Difficulty Section */}
    <h4 className="text-2xl font-bold text-indigo-400 mt-6 mb-2">
      Difficulty
    </h4>
    <p className="leading-7 text-gray-300">
      {item.difficulty}
    </p>
  </div>
</div>



    </>
  )
}

export default ProblemDiscription