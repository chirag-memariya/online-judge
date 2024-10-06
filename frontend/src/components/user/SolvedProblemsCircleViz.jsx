import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react'; // Icons from Lucide React


const SolvedProblemsCircleViz = ({ userId }) => {
  const [solvedProblemsByDifficulty, setSolvedProblemsByDifficulty] = useState({
    easy: 0,
    medium: 0,
    hard: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/submissions/solved-count/${userId}`);
        setSolvedProblemsByDifficulty(response.data);
      } catch (error) {
        console.error("Error while fetching # of problems:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolvedProblems();
  }, [userId]);

  if (isLoading) {
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

  const total = Object.values(solvedProblemsByDifficulty).reduce((a, b) => a + b, 0);
  const colorMap = { easy: '#4CAF50', medium: '#FFC107', hard: '#F44336' };

  // If no problems are solved, avoid rendering arcs
  if (total === 0) {
    return (
      <div className="mt-8 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Solved Problems Distribution</h3>
        <svg viewBox="0 0 100 100" className="w-64 h-64">
          <circle cx="50" cy="50" r="40" fill="#f0f0f0" />
          <circle cx="50" cy="50" r="30" fill="white" />
          <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-xl font-bold">0</text>
        </svg>
        <div className="mt-4 flex justify-center space-x-4">
          <div className="flex items-center">
            <span className='text-gray-300 dark:text-white'>No problems solved yet</span>
          </div>
        </div>
      </div>
    );
  }

  const createArc = (startAngle, endAngle, color) => {
    const start = polarToCartesian(50, 50, 40, endAngle);
    const end = polarToCartesian(50, 50, 40, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M 50 50 L ${start.x} ${start.y} A 40 40 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  let startAngle = 0;
  const arcs = Object.entries(solvedProblemsByDifficulty).map(([difficulty, count]) => {
    const percentage = (count / total) * 100; // Calculate the percentage
    const endAngle = startAngle + (percentage * 3.6); // Convert percentage to angle (percentage * 360 degrees / 100)
    const arc = createArc(startAngle, endAngle, colorMap[difficulty]);
    startAngle = endAngle;
    return { difficulty, percentage, arc, color: colorMap[difficulty] };
  });

  return (
    <div className="mt-8 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Solved Problems Distribution</h3>
      <svg viewBox="0 0 100 100" className="w-64 h-64">
        {arcs.map(({ difficulty, arc, color }) => (
          <path key={difficulty} d={arc} fill={color} />
        ))}
        <circle cx="50" cy="50" r="30" fill="white" />
        <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-xl font-bold">{total}</text>
      </svg>
      <div className="mt-4 flex justify-center space-x-4">
        {arcs.map(({ difficulty, percentage, color }) => (
          <div key={difficulty} className="flex items-center">
            <div className="w-4 h-4 mr-2" style={{ backgroundColor: color }}></div>
            <span className="capitalize" style={{ color: 'white' }}>{difficulty}: {percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolvedProblemsCircleViz;
