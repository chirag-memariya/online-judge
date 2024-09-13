import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [items, setItems] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const navigate = useNavigate();

    const handleClick = (index) => {
        setSelectedIndex(index);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users?sort=score`);
                setItems(response.data);
            } catch (error) {
                console.log("Error while fetching users.", error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
<div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800 p-4">
            <br />
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white text-left">
                            Rank
                        </th>
                        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white text-left">
                            User
                        </th>
                        <th scope="col" className="px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white text-left">
                            Score
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items
                        .filter((item) => item.role !== "admin")
                        .map((item, index) => (
                            <tr
                                key={item._id}
                                className={`cursor-pointer transition duration-200 ease-in-out transform hover:translate-x-4 ${
                                    index === selectedIndex ? "bg-indigo-100 dark:bg-indigo-900" : "bg-white dark:bg-gray-800"
                                } border-b dark:border-gray-700`}
                                onMouseEnter={() => handleClick(index)}
                                onMouseLeave={() => setSelectedIndex(null)}
                            >
                                <td className="px-6 py-4">{index + 1}</td>
                                <td
                                    className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                >
                                    {item.firstname} {item.lastname}
                                </td>
                                <td className="px-6 py-4">{item.score}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default UserList;
