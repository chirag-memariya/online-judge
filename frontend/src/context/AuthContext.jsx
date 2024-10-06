import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react'; // Icons from Lucide React


const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(() => {
        const token = localStorage.getItem('authToken');
        return token ? { token } : null;
    });
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
    const [userName, setUserName] = useState(() => localStorage.getItem('userName'));
    const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin'));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load user data from localStorage when the component mounts
        const storedUserId = localStorage.getItem('userId');
        const storedUserName = localStorage.getItem('userName');
        const storedIsAdmin = localStorage.getItem('isAdmin');
        const storedAuthToken = localStorage.getItem('authToken');
        if (storedUserId) {
            setUserId(storedUserId);
        }
        if (storedAuthToken) {
            setAuthData(storedAuthToken);
        }
        if (storedIsAdmin) {
            setIsAdmin(true);
        }
        if(storedUserName){
            setUserName(storedUserName);
        }
    }, []);

    useEffect(() => {
        // Fetch user data to determine if the user is an admin
        const fetchIsAdmin = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`);
                    const user2 = response.data;
                    setIsAdmin(user2.role === "admin"); // Set isAdmin state
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setIsAdmin(false);
                }
            }
        };

        fetchIsAdmin();
    }, [userId]); // Run effect when userId changes

    const isAdminHepler = async (userId) =>{
        if (userId) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`);
                const user2 = response.data;
                return user2.role === "admin"; // Set isAdmin state
            } catch (error) {
                console.error("Error fetching user data:", error);
                return false;
            }
        }else{
            return false;
        }
    };

    // login function
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to login');
            }

            // Store token in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.user._id);
            localStorage.setItem('userName', data.user.firstname+" "+data.user.lastname);
            localStorage.setItem('isAdmin',isAdminHepler(data.user._id));
            setAuthData({ token: data.token });
            setUser({ ...data.user, id: data.user._id });
            setUserId(data.user._id);
            setUserName(data.user.firstname+" "+data.user.lastname);
            setIsAdmin(data.user.role === "admin"); // Set isAdmin after login
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // register function
    const register = async (firstname, lastname, email, password, date_of_birth) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstname, lastname, email, password, date_of_birth }),
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to register');
            }

            // Store token in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.user._id);
            localStorage.setItem('userName', data.user.firstname+" "+data.user.lastname);
            localStorage.setItem('isAdmin',isAdminHepler(data.user._id));
            setAuthData({ token: data.token });
            setUser({ ...data.user, id: data.user._id });
            setUserId(data.user._id);
            setUserName(data.user.firstname+" "+data.user.lastname);
            setIsAdmin(data.user.role === "admin"); // Set isAdmin after registration
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // editUser function
    const editUser = async (id, firstname, lastname, email, password, date_of_birth) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/edit/${id}`, {
                method: 'PUT', // or 'PATCH' depending on your API
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstname, lastname, email, password, date_of_birth }),
                credentials: 'include',
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update user');
            }

            // Update user data in the state
            setUser({ ...data.user, id: data.user._id });
            localStorage.setItem('userId', data.user._id);
            localStorage.setItem('userName', data.user.firstname+" "+data.user.lastname);
            setUserId(data.user._id);
            setUserName(data.user.firstname+" "+data.user.lastname);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // deleteUser function
    const deleteUser = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete user');
            }

            // Remove token and user ID from localStorage on successful deletion
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('isAdmin');

            setAuthData(null);
            setUser(null);
            setUserId(null); // Clear userId state
            setUserName(null);
            setIsAdmin(false); // Clear isAdmin state

            alert('User deleted successfully.');
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // logout function
    const logout = async () => {
        setLoading(true);
        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            // Remove token from localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('isAdmin');
            setAuthData(null);
            setUser(null);
            setUserId(null); // Clear userId state
            setUserName(null); 
            setIsAdmin(false); // Clear isAdmin state
        } catch (error) {
            console.error('Failed to logout', error);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        userId, 
        userName,
        isAdmin,
        login,
        register,
        logout,
        editUser,
        deleteUser,
        loading,
        isAuthenticated: !!authData,
    };

    
    if (loading) {
        return (
          <div className="flex justify-center items-center h-64 relative">
            <div className="relative">
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
              
              {/* Gradient ring */}
              <div className="absolute inset-0 -m-2">
                <div className="h-20 w-20 rounded-full border-4 border-transparent 
                                bg-gradient-to-r from-blue-500 to-purple-500 
                                opacity-20 animate-spin [animation-duration:3s]" 
                     style={{ clipPath: 'inset(0 0 50% 50%)' }}></div>
              </div>
              
              {/* Orbiting dots */}
              {[...Array(8)].map((_, i) => (
                <div key={i} 
                     className="absolute inset-0 animate-spin"
                     style={{ 
                       animationDuration: '3s',
                       transform: `rotate(${i * 45}deg)`
                     }}>
                  <div className="h-2 w-2 rounded-full bg-blue-500 absolute -top-1"
                       style={{
                         animationDelay: `${i * 0.2}s`,
                         opacity: 0.4 + (i * 0.1)
                       }}></div>
                </div>
              ))}
            </div>
            
            {/* Optional progress bar */}
            <div className="absolute bottom-0 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        );
      }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
