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

    const handleNavigation = (userId) => {
        navigate(`/user/${userId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/users?sort=score");
                setItems(response.data);
            } catch (error) {
                console.log("Error while fetching users.", error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <div className="relative overflow-x-auto">
                <br />
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <caption className="font-bold text-slate-600">LEADERBOARD</caption>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Rank
                            </th>
                            <th scope="col" className="px-6 py-3">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Score
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr
                                key={item._id}
                                className={`${
                                    index === selectedIndex ? "bg-gray-500" : "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                }`}
                                onClick={() => handleNavigation(item._id)}
                            >
                                <td className="px-6 py-4">{index + 1}</td>
                                <td
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    onMouseEnter={() => handleClick(index)}
                                >
                                    {item.firstname} {item.lastname}
                                </td>
                                <td className="px-6 py-4">{item.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />
            </div>
        </>
    );
};

export default UserList;
