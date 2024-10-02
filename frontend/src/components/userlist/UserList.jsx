import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award, Zap, User } from 'lucide-react';

const UserList = () => {
    const [items, setItems] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleClick = (index) => {
        setSelectedIndex(index);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users?sort=score`);
                const sortedItems = response.data.filter((item) => item.role !== "admin")
                    .sort((a, b) => b.score - a.score);

                let rank = 1;
                sortedItems.forEach((item, index) => {
                    if (index > 0 && sortedItems[index].score === sortedItems[index - 1].score) {
                        item.rank = sortedItems[index - 1].rank;
                    } else {
                        item.rank = rank;
                        rank++;
                    }
                });

                setItems(sortedItems);
            } catch (error) {
                console.log("Error while fetching users.", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-6 w-6 text-yellow-500" />;
            case 2:
                return <Medal className="h-6 w-6 text-gray-400" />;
            case 3:
                return <Award className="h-6 w-6 text-yellow-700" />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Enhanced decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            {/* Content */}
            <div className="relative overflow-hidden shadow-lg sm:rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/10 dark:to-blue-500/20"></div>
                
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center">
                        <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3 animate-pulse" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            Leaderboard Elite
                        </span>
                    </h2>
                    
                    <div className="overflow-x-hidden">
                        <table className="w-full text-sm text-left m-2">
                            <thead className="text-xs uppercase bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white">Rank</th>
                                    <th scope="col" className="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white">User</th>
                                    <th scope="col" className="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr
                                        key={item._id}
                                        className={`transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg ${
                                            index === selectedIndex ? "bg-blue-50 dark:bg-blue-900/50" : 
                                            index % 2 === 0 ? 'bg-white/50 dark:bg-gray-800/50' : 'bg-gray-50/50 dark:bg-gray-700/50'
                                        } border-b dark:border-gray-700 cursor-pointer`}
                                        onMouseEnter={() => handleClick(index)}
                                        onMouseLeave={() => setSelectedIndex(null)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                {getRankIcon(item.rank)}
                                                <span className={`font-semibold ${
                                                    item.rank === 1 ? 'text-yellow-500' :
                                                    item.rank === 2 ? 'text-gray-400' :
                                                    item.rank === 3 ? 'text-yellow-700' :
                                                    'text-gray-700 dark:text-gray-300'
                                                }`}>
                                                    #{item.rank}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespca-nowrap">
                                            <div className='flex items-center'>
                                            <User className="mr-2 h-4 w-4" />
                                            {item.firstname} {item.lastname}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold">
                                            <div className="flex items-center space-x-2">
                                                <span className={`h-4 w-4 ${
                                                    item.rank <= 3 ? 'text-green-500' : 'text-gray-500'
                                                }`} />
                                                <span className={item.rank <= 3 ? 'text-green-500' : 'text-gray-700 dark:text-gray-300'}>
                                                    {item.score}
                                                </span>
                                            </div>
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

export default UserList;