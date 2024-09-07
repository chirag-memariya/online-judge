import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(() => {
        const token = localStorage.getItem('authToken');
        return token ? { token } : null;
    })
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(() => localStorage.getItem('userId')); // Initialize from localStorage
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        // Load user data from localStorage when the component mounts
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    // // Attach token to every request
    // const fetchWithAuth = async (url, options = {}) => {
    //     const token = authData?.token;
    //     const headers = {
    //         'Content-Type': 'application/json',
    //         ...(options.headers || {}),
    //         ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    //     };

    //     return fetch(url, {
    //         ...options,
    //         headers,
    //         credentials: 'include', // to include cookies for CSRF protection
    //     });
    // };


    // login function    
    const login = async (email, password) => {
        setLoading(true);
        try {
            const responce = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            const data = await responce.json();
            if (!responce.ok) {
                throw new Error(data.message || 'Failed to login');
            }

            // Store token in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.user._id);
            setAuthData({ token: data.token });
            setUser({ ...data.user, id: data.user._id });
            setUserId(data.user._id);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);

        }
    };

    //register function
    const register = async (firstname, lastname, email, password, dob) => {
        setLoading(true);
        try {
            const responce = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstname, lastname, email, password, dob }),
                credentials: 'include',
            });
            const data = await responce.json();
            if (!responce.ok) {
                throw new Error(data.message || 'Failed to register');
            }

            // Store token in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.user._id);
            setAuthData({ token: data.token });
            setUser({ ...data.user, id: data.user._id });
            setUserId(data.user._id);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // editUser function
    const editUser = async (id, firstname, lastname, email, password, date_of_birth) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/auth/edit/${id}`, {
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
            setUserId(data.user._id);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    //delete user
    // Add deleteUser function
    const deleteUser = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/users/delete/${id}`, {
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
            setAuthData(null);
            setUser(null);
            setUserId(null); // Clear userId state

            alert('User deleted successfully.');
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };


    //logout function 
    const logout = async () => {
        setLoading(true);
        try {
            await fetch('http://localhost:8000/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            // Remove token from localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            setAuthData(null);
            setUser(null);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Failed to logout', error);
        }
    };

    const isAdmin = user?.role == 'admin';

    const value = {
        user,
        userId,
        isAdmin,
        login,
        register,
        logout,
        editUser,
        deleteUser,
        loading,
        isAuthenticated: !!authData,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}