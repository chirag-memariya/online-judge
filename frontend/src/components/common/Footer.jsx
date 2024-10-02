import React from 'react';
import { Crown } from 'lucide-react'; // Import the Crown icon from lucide-react
import { Link } from 'react-router-dom';


const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 shadow relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-30"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-30"></div>
            </div>

            <div className="relative z-10 w-full max-w-screen-xl p-4 md:py-4 flex items-center justify-between">
                {/* Logo with Crown Icon */}
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
                <p className="absolute left-0 right-0 text-center text-indigo-300 text-sm mx-auto">
                    © 2024 CodeThrone. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
