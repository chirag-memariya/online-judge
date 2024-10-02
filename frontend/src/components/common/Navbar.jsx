import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Crown, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import profileLogo from '../../assets/person-male--v2.png';
import { User } from 'lucide-react';
import { UserCircle } from 'lucide-react';
import { UserPlus } from 'lucide-react';
import { UserCheck } from 'lucide-react';
import { UserX } from 'lucide-react';



export default function Navbar() {
    const { isAuthenticated, logout, userName } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/' },
        { name: 'Leaderboard', href: '/leaderboard' },
        { name: 'Submissions', href: '/submissionlist' },
    ];

    // Determine the current path for navigation highlighting
    const currentPath = location.pathname;

    const handleProfileNavigation = () => navigate('/user/profile');

    const handleLoginNavigation = () => navigate('/login');

    const handleLogout = async () => {
        try {
            await logout();
            console.log('Logout successful');
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
            {/* Decorative background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-30"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-30"></div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25"></div>
                                <div className="relative bg-white dark:bg-gray-800 p-1 rounded-lg">
                                    <Crown className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                                </div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                CodeThrone
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-6 md:flex md:space-x-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                                        ${currentPath === item.href
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                            : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* User Menu / Login Button */}
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <div className="relative ml-3">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                                >
                                    <UserCircle
                                        size={32}
                                        className="h-8 w-8 rounded-full border-2 border-indigo-600 dark:border-indigo-400 animate-pulse"
                                    />

                                    <span className="hidden md:block text-sm font-medium">{userName || 'User'}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {/* Dropdown Menu */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                        <button
                                            onClick={handleProfileNavigation}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleLoginNavigation}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                            >
                                Login
                            </button>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`md:hidden ml-4 transition-all duration-200 
                                ${isMenuOpen ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                                    ${currentPath === item.href
                                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                        : isMenuOpen
                                            ? 'text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100'
                                            : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
