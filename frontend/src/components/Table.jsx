import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Table = () => {
    const navigate = useNavigate();
    const {user} = useAuth();

    const handleNavigation = (item)=>{
        if(!user){
            navigate('/login', { state: { from: '/problem', item } });
        }else {
            navigate(`/problem`, { state: { item } });
          }
    }
    const [selectedIndex, setSelectedIndex] = useState([]);
    const [items, setItems] = useState([]);

    const handleClick = (index) => {
        setSelectedIndex(index);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responce = await axios.get("http://localhost:8000/problems");
                setItems(responce.data);

            } catch (error) {
                console.log("Error while fetching data.", error);
            }
        };
        fetchData();
    },[]);
    return (


        <div className="relative overflow-x-auto">
            <br />
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Problem Lists
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        items.map((item,index) =>
                            <tr key={item.id||index} className={`
                                    ${index === selectedIndex ? "bg-gray-500" : "bg-white border-b dark:bg-gray-800 dark:border-gray-700"}
                                `}>
                                {
                                    <th 
                                    scope="row" 
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" 
                                    onClick={() => handleNavigation(item)}
                                    onMouseEnter={() => handleClick(index)}
                                    >
                                        {item.title}
                                    </th>
                                }
                            </tr>
                        )

                    }
                </tbody>
            </table>
            <br />
        </div>

    )
}

export default Table