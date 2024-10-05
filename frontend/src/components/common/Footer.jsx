import React from 'react';
import { Crown } from 'lucide-react'; // Import the Crown icon from lucide-react
import { Link } from 'react-router-dom';


const Footer = () => {
    return (
<footer className="relative bg-gradient-to-br from-white via-white/80 to-blue-50/50 dark:from-gray-900 dark:via-gray-800/80 dark:to-blue-900/30 shadow">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 dark:bg-purple-800 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Logo with Zap Icon */}
                    <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
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

                    {/* Navigation Links */}
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 dark:text-gray-400 md:mb-0">
                        <li>
                            <Link to="#" className="mr-4 hover:text-blue-600 dark:hover:text-blue-400 md:mr-6">About</Link>
                        </li>
                        <li>
                            <Link to="#" className="mr-4 hover:text-blue-600 dark:hover:text-blue-400 md:mr-6">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link to="#" className="mr-4 hover:text-blue-600 dark:hover:text-blue-400 md:mr-6">Terms</Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
                        </li>
                    </ul>
                </div>

                <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
                
                <div className="text-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        © 2024{' '}
                        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                            CodeThrone™
                        </Link>
                        . All Rights Reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
