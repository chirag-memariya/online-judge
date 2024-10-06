import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Book, Users, Lightbulb, Trophy } from 'lucide-react';
import { Loader2 } from 'lucide-react'; // Icons from Lucide React


const ProblemDescription = ({ item }) => {
  if (!item) {
    return(
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
      </div>)
  }

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [problemId] = useState(item._id);

  const handleViewMySubmissions = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/user-problem/submissions', problemId } });
    } else {
      navigate('/user-problem/submissions', { state: { problemId } });
    }
  };

  const handleViewProblemSubmissions = () => {
    navigate('/problem/submissions', { state: { problemId } });
  };

  return (
<div className="p-5 flex-1 bg-gradient-to-br from-gray-900 via-gray-800/80 to-blue-900/30 shadow-lg overflow-hidden">
      {/* Buttons Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={handleViewMySubmissions}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white focus:ring-4 focus:outline-none focus:ring-blue-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 active:shadow-md"
        >
          <span className="relative px-5 py-2.5 flex items-center transition-all ease-in duration-200 bg-gray-900/50 rounded-md group-hover:bg-transparent">
            <Trophy className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
            My Submissions
          </span>
        </button>
        <button
          onClick={handleViewProblemSubmissions}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white focus:ring-4 focus:outline-none focus:ring-blue-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 active:shadow-md"
        >
          <span className="relative px-5 py-2.5 flex items-center transition-all ease-in duration-200 bg-gray-900/50 rounded-md group-hover:bg-transparent">
            <Users className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
            All Submissions
          </span>
        </button>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800/80 to-blue-900/50 backdrop-blur-md p-8 rounded-lg shadow-lg border border-gray-700/40">


        {/* Problem Details Section */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Book className="h-5 w-5 text-indigo-400 mr-2" />
            <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
              Problem Details
            </p>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-4 text-white">
            {item.title} <span className="text-indigo-400">Problem</span>
          </h3>
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <p className="leading-7 text-gray-300 text-lg">
              {item.statement}
            </p>
          </div>
        </div>

        {/* Input/Output Sample Section */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Lightbulb className="h-5 w-5 text-indigo-400 mr-2" />
            <h4 className="text-2xl font-bold text-white">Sample</h4>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            {item.input_output_sample.split('\n').map((line, index) => (
              <div key={index} className="mb-2">
                {line.includes('Example') ? (
                  <pre className="font-bold text-indigo-300 text-lg mb-2">{line}</pre>
                ) : (
                  <div className="pl-4">
                    <pre className="text-gray-300 text-lg whitespace-pre-wrap font-mono">
                      {line}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Section */}
        <div className="flex items-center mb-2">
          <Trophy className="h-5 w-5 text-indigo-400 mr-2" />
          <h4 className="text-2xl font-bold text-white">
            Difficulty
          </h4>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <p className="leading-7 text-gray-300 text-lg">
            {item.difficulty}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;