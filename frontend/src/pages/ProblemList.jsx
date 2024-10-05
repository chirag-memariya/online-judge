import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { List, ChevronRight, Loader2 } from 'lucide-react';
import '../styles.css';

const getDifficultyButtonClasses = (difficulty) => {
  const baseClasses = `
    relative group flex items-center justify-center
    w-24 h-8 overflow-hidden text-sm font-medium rounded-md
    transition-all duration-300 transform hover:scale-105
    hover:shadow-lg active:scale-100
  `;

  const innerSpanClasses = `
    relative flex items-center justify-center
    w-full h-full transition-all ease-in duration-200 
    bg-black/20 group-hover:bg-black/0
  `;

  const hoverEffectClasses = `
    after:absolute after:inset-0 after:rounded-md after:opacity-0 
    after:group-hover:opacity-100 after:transition-opacity after:duration-300
    after:bg-gradient-to-r after:from-white/10 after:via-white/5 after:to-transparent 
    after:transform after:-skew-x-12
  `;

  const difficultyConfigs = {
    easy: {
      buttonClasses: `${baseClasses} ${hoverEffectClasses} bg-gradient-to-br from-green-500/90 to-emerald-600/90 hover:from-green-500 hover:to-emerald-600 focus:ring-2 focus:outline-none focus:ring-green-800/50`,
    },
    medium: {
      buttonClasses: `${baseClasses} ${hoverEffectClasses} bg-gradient-to-br from-yellow-500/90 to-orange-600/90 hover:from-yellow-500 hover:to-orange-600 focus:ring-2 focus:outline-none focus:ring-yellow-800/50`,
    },
    hard: {
      buttonClasses: `${baseClasses} ${hoverEffectClasses} bg-gradient-to-br from-red-500/90 to-rose-600/90 hover:from-red-500 hover:to-rose-600 focus:ring-2 focus:outline-none focus:ring-red-800/50`,
    },
    default: {
      buttonClasses: `${baseClasses} ${hoverEffectClasses} bg-gradient-to-br from-gray-500/90 to-slate-600/90 hover:from-gray-500 hover:to-slate-600 focus:ring-2 focus:outline-none focus:ring-gray-800/50`,
    }
  };

  const config = difficultyConfigs[difficulty.toLowerCase()] || difficultyConfigs.default;

  return {
    buttonClasses: config.buttonClasses,
    innerSpanClasses,
  };
};

const ProblemList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNavigation = (item) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/problem', item } });
    } else {
      navigate(`/problem`, { state: { item } });
    }
  };

  const handleClick = (index) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problems`);
        setItems(response.data);
      } catch (error) {
        console.log("Error while fetching data.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  return (
    <div className="relative">
      {/* Enhanced decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 dark:bg-purple-800 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200 dark:bg-gray-700 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/10 dark:to-purple-500/20"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center">
            <List className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3 animate-pulse" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-gray-500 dark:from-purple-400 dark:to-gray-400">
              Problem Lists
            </span>
          </h2>

          <div className="overflow-x-hidden">
            <table className="min-w-full text-sm text-left m-2">
              <thead className="text-xs uppercase bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20">
                <tr>
                  <th scope="col" className="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white">Problem Title</th>
                  <th scope="col" className="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className={`transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg ${
                      index === selectedIndex ? "bg-blue-50 dark:bg-blue-900/50" :
                      index % 2 === 0 ? 'bg-white/50 dark:bg-gray-800/50' : 'bg-gray-50/50 dark:bg-gray-700/50'
                    } border-b dark:border-gray-700 cursor-pointer group`}
                    onMouseEnter={() => handleClick(index)}
                    onMouseLeave={() => setSelectedIndex(null)}
                    onClick={() => handleNavigation(item)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center">
                      <span className="mr-2">{item.title}</span>
                      <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 opacity-0 transition-all duration-300 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DifficultyButton difficulty={item.difficulty} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const DifficultyButton = ({ difficulty }) => {
  const { buttonClasses, innerSpanClasses } = getDifficultyButtonClasses(difficulty);

  return (
    <button className={buttonClasses}>
      <span className={innerSpanClasses}>
        {difficulty}
      </span>
    </button>
  );
};

export default ProblemList;
