import React from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Outlet } from 'react-router-dom'
const Dashboard = () => {
    return (
        <>
            <Navbar />
            <div className="relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-30"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-30"></div>
            </div>

            {/* Main content area */}
            <div className="relative z-10">
                <Outlet />
            </div>
        </div>
            <Footer />
        </>

    )
}

export default Dashboard