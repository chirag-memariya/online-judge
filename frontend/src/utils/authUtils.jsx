import axios from 'axios';

// Separate function to check if a user is an admin
const isAdmin = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const response = await axios.get(`http://localhost:8000/users/${userId}`);
      const user = response.data;
      if (user.role === 'admin') {
        return true; // User is admin
      } else {
        return false; // User is not admin
      }
    } else {
      console.log("userId not found!");
      return false;
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
    return false; // Return false in case of an error
  }
};

export default isAdmin;
