import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from "lucide-react";


const EditProblem = () => {
  const [title, setTitle] = useState('');
  const [statement, setStatement] = useState('');
  const [inputOutputSample, setInputOutputSample] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { problemId } = useParams(); // Get the problem ID from the URL

  // Check if the user is an admin
  if (!isAdmin) {
    return <div>Access Denied: You do not have the required permissions to view this page.</div>;
  }

  // Fetch the existing problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problems/${problemId}`);
        const problem = response.data;

        // Set the state with the fetched problem data
        setTitle(problem.title);
        setStatement(problem.statement);
        setInputOutputSample(problem.input_output_sample);
        setDifficulty(problem.difficulty);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching problem data:', err);
        setError('Failed to load problem data.');
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problems/edit/${problemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          statement,
          input_output_sample: inputOutputSample,
          difficulty,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update problem');
      }

      setSuccess(data.message);
      setLoading(false);
      navigate('/admin-dashboard/problem-list'); // Navigate to home or another page on success
    } catch (err) {
      console.error('Error updating problem:', err);
      setError('Problem update failed. Please try again.');
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
    <>
      <div className="flex-1 p-4 bg-white shadow rounded">
        <div className="bg-gray-900 p-10 text-white">
          <h2 className="text-3xl font-extrabold tracking-tight">Edit Problem</h2>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mt-4">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full mt-2 p-2 bg-white text-black rounded border border-gray-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="statement" className="block text-sm font-medium">
                Statement
              </label>
              <textarea
                id="statement"
                className="w-full mt-2 p-2 bg-white text-black rounded border border-gray-300"
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="inputOutputSample" className="block text-sm font-medium">
                Input/Output Sample
              </label>
              <textarea
                id="inputOutputSample"
                className="w-full mt-2 p-2 bg-white text-black rounded border border-gray-300"
                value={inputOutputSample}
                onChange={(e) => setInputOutputSample(e.target.value)}
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="difficulty" className="block text-sm font-medium">
                Difficulty
              </label>
              <select
                id="difficulty"
                className="w-full mt-2 p-2 bg-white text-black rounded border border-gray-300"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button type="submit" className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
              Update Problem
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProblem;
