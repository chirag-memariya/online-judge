import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook

const Logout = () => {
  const { logout } = useAuth(); // Access the logout function from AuthContext
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from AuthContext
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default Logout;
