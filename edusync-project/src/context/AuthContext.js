import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from '../utils/axiosConfig';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initializedRef.current) return;

    const storedToken = localStorage.getItem('token');
    if (storedToken && storedToken !== 'dummy-token') {
      try {
        const decoded = jwtDecode(storedToken);
        if (Date.now() >= decoded.exp * 1000) {
          logout();
          return;
        }

        const userData = {
          token: storedToken,
          role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
          name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
          email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
          id: decoded["UserId"]
        };

        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (err) {
        console.error('Token decode failed:', err);
        logout();
      }
    }
    initializedRef.current = true;
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const loginResponse = await axios.post('/Auth/login', {
        email,
        passwordHash: password
      });

      const decoded = jwtDecode(loginResponse.data.token);
      const userData = {
        token: loginResponse.data.token,
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        id: decoded["UserId"]
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      setUser(userData);
      return userData;
    } catch (err) {
      setError('Login failed. Check your credentials.');
      throw err;
    }
  };

  const register = async (userData) => {
    const registerData = {
      name: userData.name,
      email: userData.email,
      passwordHash: userData.password,
      role: userData.role
    };
    const response = await axios.post('/Auth/register', registerData);
    return response.data;
  };

  const logout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, register, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
  