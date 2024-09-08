import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminProblemList = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [selectedIndex, setSelectedIndex] = useState([]);
    const [items, setItems] = useState([]);

    const handleClick = (index) => {
        setSelectedIndex(index);
    };

    const fetchProblems = async () => {
        try {
            const response = await axios.get('http://localhost:8000/problems');
            setItems(response.data);
        } catch (error) {
            console.log('Error while fetching data.', error);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const handleEdit = (id) => {
        navigate(`/admin/problems/edit/${id}`);
    };

    const handleProblemNavigation = (item) => {
        navigate(`/problem`, { state: { item } });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/problems/delete/${id}`);
            console.log("Problem deleted successfully");
            fetchProblems();
        } catch (error) {
            console.error("Error deleting problem:", error);
        }
    };

    const handleCreateNew = () => {
        navigate('/admin/problems/create');
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800 p-4">
            <div className="flex justify-between mb-4">
                <button
                    onClick={handleCreateNew}
                    className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Create New Problem
                </button>
            </div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white text-left">
                            Problem Lists
                        </th>
                        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white text-left">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr
                            key={item.id || index}
                            className={`cursor-pointer transition duration-200 ease-in-out transform hover:translate-x-4 ${
                                index === selectedIndex ? "bg-indigo-100 dark:bg-indigo-900" : "bg-white dark:bg-gray-800"
                            } border-b dark:border-gray-700`}
                            onMouseEnter={() => handleClick(index)}
                            onMouseLeave={() => setSelectedIndex(null)}
                        >
                            <td
                                className="px-6 py-4 font-medium dark:text-white whitespace-nowrap"
                                onClick={() => handleProblemNavigation(item)}
                            >
                                {item.title}
                            </td>
                            <td className="px-6 py-4 space-x-2">
                                <button
                                    onClick={() => handleEdit(item._id)}
                                    className="text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProblemList;
