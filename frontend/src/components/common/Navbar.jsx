import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Crown, ChevronDown, Menu, X, Zap } from 'lucide-react';
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
<nav className="relative bg-gradient-to-br from-white via-white/80 to-blue-50/50 dark:from-gray-900 dark:via-gray-800/80 dark:to-blue-900/30 shadow-lg sticky top-0 z-50">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 dark:bg-purple-800 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
                                <div className="relative bg-white dark:bg-gray-800 p-1 rounded-lg">
                                    <Crown className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                                </div>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
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
                                            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20 text-gray-900 dark:text-white'
                                            : 'text-gray-500 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 dark:hover:from-blue-600/20 dark:hover:to-purple-600/20'
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
                                        className="h-8 w-8 rounded-full border-2 border-blue-600 dark:border-blue-400 animate-pulse"
                                    />
                                    <span className="hidden md:block text-sm font-medium">{userName || 'User'}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {/* Dropdown Menu */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                        <button
                                            onClick={handleProfileNavigation}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-500/10"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleLoginNavigation}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                            >
                                Login
                            </button>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden ml-4 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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
                                        ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20 text-gray-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 dark:hover:from-blue-600/20 dark:hover:to-purple-600/20'
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
