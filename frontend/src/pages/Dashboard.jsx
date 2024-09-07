import React from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Outlet, useLocation } from 'react-router-dom'
const Dashboard = () => {
    const location = useLocation();
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>

    )
}

export default Dashboard