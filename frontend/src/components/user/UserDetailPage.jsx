import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserDetailPage = () => {
  const { userId } = useParams(); // Get userId from URL parameters
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        setError('Error fetching user data');
        console.error("Error while fetching user data.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      {user ? (
        <div className="bg-white shadow rounded-lg p-4">
          <p><strong>First Name:</strong> {user.firstname}</p>
          <p><strong>Last Name:</strong> {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Date of Birth:</strong> {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Registration Date:</strong> {new Date(user.registration_date).toLocaleDateString()}</p>
          <p><strong>Score:</strong> {user.score ?? 'N/A'}</p> {/* Added the Score Field */}
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserDetailPage;
