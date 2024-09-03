import {createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();

export const useAuth = ()=>{
    return useContext(AuthContext);
};

export const AuthProvider = ({children}) =>{
    const [authData,setAuthData] = useState(()=>{
        const token =localStorage.getItem('authToken');
        return token ? {token} : null;
    }) 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

  // Attach token to every request
  const fetchWithAuth = async (url, options = {}) => {
    const token = authData?.token;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include', // to include cookies for CSRF protection
    });
  };


    // login function    
    const login = async (email,password) =>{
        setLoading(true);
        try {
            const responce = await fetch('http://localhost:8000/auth/login',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email,password}),
                credentials: 'include',
            });
            const data = await responce.json();
            if(!responce.ok){
                throw new Error(data.message || 'Failed to login');
            }

            // Store token in localStorage
            localStorage.setItem('authToken', data.token);
            setAuthData({ token: data.token });
            setUser(data.user);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    //register function
    const register = async (firstname,lastname,email,password,dob) => {
        setLoading(true);
        try {
            const responce = await fetch('http://localhost:8000/auth/register',{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({firstname,lastname,email,password,dob}),
                credentials: 'include',
            });
            const data = await responce.json();
            if(!responce.ok){
                throw new Error(data.message || 'Failed to register');
            }

            // Store token in localStorage
            localStorage.setItem('authToken', data.token);
            setAuthData({ token: data.token });
            setUser(data.user);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    //logout function 
    const logout = async ()=>{
        setLoading(true);
        try {
            await fetch('http://localhost:8000/auth/logout',{
                method: 'POST',
                credentials: 'include',
            });

            // Remove token from localStorage
            localStorage.removeItem('authToken');
            setAuthData(null);
            setUser(null);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Failed to logout',error);
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!authData,
    };
    return  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}