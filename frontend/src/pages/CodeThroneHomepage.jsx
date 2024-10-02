import React from 'react';
import { Crown, Code, Sparkles, Trophy } from 'lucide-react';
import ProblemList from './ProblemList'; // Assuming we have the ProblemList component

export default function CodeThroneHomepage({ items, isLoading, selectedIndex, handleClick, handleNavigation, setSelectedIndex }) {
  return (
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="text-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-5 flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/10 dark:to-blue-500/20"></div>
            
            <div className="relative mb-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25"></div>
              <div className="relative bg-white dark:bg-gray-800 p-2 rounded-lg">
                <Crown className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">CodeThrone!</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Conquer coding challenges and claim your throne in the world of programming.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
            {[
              { icon: Code, label: 'Problems', value: '5+' },
              { icon: Trophy, label: 'Active Users', value: '10+' },
              { icon: Sparkles, label: 'Submissions', value: '100+' }
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transform transition-all hover:scale-105">
                <stat.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h2>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Problem List Section */}
          <ProblemList
            items={items}
            isLoading={isLoading}
            selectedIndex={selectedIndex}
            handleClick={handleClick}
            handleNavigation={handleNavigation}
            setSelectedIndex={setSelectedIndex}
          />
        </div>
      </div>
    </div>
  );
}
