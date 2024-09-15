import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CreateProblem = () => {
  const [title, setTitle] = useState('');
  const [statement, setStatement] = useState('');
  const [inputOutputSample, setInputOutputSample] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);


  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Check if the user is an admin
  if (!isAdmin) {
    return <div>Access Denied: You do not have the required permissions to view this page.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problems/create`, {
        method: 'POST',
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
        throw new Error(data.message || 'Failed to create problem');
      }
      setSuccess(data.message);
      setLoading(false);
      navigate('/admin/problems');
    } catch (err) {
      console.error('Error creating problem:', err);
      setError('Problem creation failed. Please try again.');
      // navigate('/');
    }
  };

  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="ring"></div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 p-4 bg-white shadow rounded">
      <div className="bg-gray-900 p-10 text-white">
        <h2 className="text-3xl font-extrabold tracking-tight">Create a New Problem</h2>
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
            Create Problem
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default CreateProblem;
