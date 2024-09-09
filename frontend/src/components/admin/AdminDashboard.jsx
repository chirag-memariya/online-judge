import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import Footer from '../common/Footer';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    // const {isAdmin, isAuthenticated} = useAuth();
    // console.log("isAdmin: "+isAdmin+" isAuthenticated: "+isAuthenticated);  
    return (
        <>
            <AdminNavbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default AdminDashboard;
