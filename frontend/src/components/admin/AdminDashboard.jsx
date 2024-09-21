import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import Footer from '../common/Footer';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
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
