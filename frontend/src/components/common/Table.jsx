import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Table = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [items, setItems] = useState([]);

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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problems`);http://localhost:8000
                setItems(response.data);
            } catch (error) {
                console.log("Error while fetching data.", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800 p-4">
            <div className="mb-4">
                <button
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    Refresh
                </button>
            </div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white text-left">
                            Problem Lists
                        </th>
                        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white text-left">
                            Difficulty
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr
                            key={item.id || index}
                            className={`cursor-pointer transition duration-200 ease-in-out transform hover:translate-x-4 ${
                                index % 2 === 0
                                    ? "bg-white dark:bg-gray-800"
                                    : "bg-gray-50 dark:bg-gray-700"
                            } border-b dark:border-gray-700 ${
                                index === selectedIndex ? "bg-indigo-100 dark:bg-indigo-900" : ""
                            }`}
                            onMouseEnter={() => handleClick(index)}
                            onMouseLeave={() => setSelectedIndex(null)}
                        >
                            <td
                                className="px-6 py-4 font-medium dark:text-white whitespace-nowrap"
                                onClick={() => handleNavigation(item)}
                            >
                                {item.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    className={`px-4 py-2 text-white rounded-md ${getDifficultyButtonClasses(item.difficulty)} w-24 h-8`}
                                >
                                    {item.difficulty}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
