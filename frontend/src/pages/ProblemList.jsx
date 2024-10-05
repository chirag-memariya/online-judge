import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { List, ChevronRight } from 'lucide-react';
import '../styles.css';

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

    const getDifficultyButtonClasses = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-500 hover:bg-green-600';
            case 'medium':
                return 'bg-yellow-500 hover:bg-yellow-600';
            case 'hard':
                return 'bg-red-500 hover:bg-red-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
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
            <div className="relative">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                
                <div className="relative overflow-hidden shadow-lg sm:rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/10 dark:to-blue-500/20"></div>
                    <div className="relative z-10 flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

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
                                            <button 
                                                className={`difficulty px-4 py-2 text-white rounded-md transition-all duration-300 hover:shadow-lg hover:scale-105 ${getDifficultyButtonClasses(item.difficulty)} w-24 h-8`}
                                            >
                                                {item.difficulty}
                                            </button>
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

export default ProblemList;
