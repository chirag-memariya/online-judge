import React from 'react';
import UserList from '../components/userlist/UserList';

const Leaderboard = () => {
  return (
    <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
        <UserList/>
    </div>
  );
};

export default Leaderboard;
