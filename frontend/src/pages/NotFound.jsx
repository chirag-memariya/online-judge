import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate();
    const handleNavigation = ()=>{
        navigate('/');
    }
    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat">
                <div className="max-w-md mx-auto text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
                    <div className="text-9xl font-bold text-indigo-600 mb-4">404</div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">Oops! Page Not Found</h1>
                    <button 
                        type="button"   
                        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                        onClick={()=> handleNavigation()}
                        >
                        
                        Go back Home
                    </button>
                </div>
            </div>
        </>
    )
}

export default NotFound