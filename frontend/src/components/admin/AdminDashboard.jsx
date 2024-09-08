import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import Footer from '../common/Footer';

const AdminDashboard = () => {
    const location = useLocation();
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
