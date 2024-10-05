import React from 'react';
import { Crown, Code, Sparkles, Trophy } from 'lucide-react';
import ProblemList from './ProblemList';

export default function CodeThroneHomepage({ items, isLoading, selectedIndex, handleClick, handleNavigation, setSelectedIndex }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white/80 to-blue-50/50 dark:from-gray-900 dark:via-gray-800/80 dark:to-blue-900/30">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_500px_at_50%_50%,#3b82f620,transparent)] animate-spin-slow dark:bg-[radial-gradient(circle_500px_at_50%_50%,#1d4ed820,transparent)]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h20v20H0z%22%20fill%3D%22%23000%22%20fill-opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h20v20H0z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')]"></div>
      </div>

      <div className="relative z-10 px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <Crown className="w-12 h-12 text-yellow-500 animate-pulse" />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
            Welcome to CodeThrone!
          </h1>
          <p className="mx-auto mb-12 text-xl text-gray-500 max-w-2xl dark:text-gray-400">
            Conquer coding challenges and claim your throne in the world of programming.
          </p>
        </div>

{/* Stats Section */}
<div className="grid grid-cols-1 gap-8 mb-16 sm:grid-cols-3">
  {[
    { icon: Code, label: 'Problems', value: '5+' },
    { icon: Trophy, label: 'Active Users', value: '10+' },
    { icon: Sparkles, label: 'Submissions', value: '100+' }
  ].map((stat, index) => (
    <div
      key={index}
      className="relative p-6 overflow-hidden transition-all duration-300 transform bg-gray-200 rounded-lg shadow-lg group hover:shadow-2xl hover:scale-105 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:opacity-10"></div>
      <stat.icon className="w-8 h-8 mb-4 text-blue-500" />
      <h3 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
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
  );
}