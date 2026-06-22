import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Set default axios header
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }

    const loadUser = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`);
            setUser(res.data.data);
        } catch (err) {
            console.error(err);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        loadUser();
    };

    const register = async (username, email, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, { username, email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        loadUser();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            loadUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
