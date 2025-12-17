import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create axios instance with baseURL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5080'
});

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        // Set default api header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token and get admin data
        await verifyToken();
      } else {
        setLoading(false);
      }
    };
    
    initAuth();
  }, [token]);

  const verifyToken = async () => {
    try {
      console.log('🔍 AuthContext: Verifying token...');
      console.log('🔍 Token from localStorage:', localStorage.getItem('adminToken')?.substring(0, 20) + '...');
      console.log('🔍 Making request to:', api.defaults.baseURL + '/api/admin/me');
      console.log('🔍 Authorization header:', api.defaults.headers.common['Authorization']?.substring(0, 30) + '...');
      
      const response = await api.get('/api/admin/me');
      console.log('✅ Token verified successfully!', response.data);
      setAdmin(response.data.data.admin);
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Full error:', error.message);
      
      // Don't logout immediately - let user try to login again
      // logout();
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    console.log('🟢 AuthContext: login called with username:', username);
    try {
      console.log('🟢 AuthContext: Making API request to http://localhost:5080/api/admin/login');
      const response = await api.post('/api/admin/login', {
        username,
        password
      });
      console.log('🟢 AuthContext: API response received:', response.data);

      const { token: newToken, admin: adminData } = response.data.data;

      console.log('🟢 AuthContext: Storing token and admin data');
      localStorage.setItem('adminToken', newToken);
      setToken(newToken);
      setAdmin(adminData);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      console.log('✅ AuthContext: Login successful!');
      return { success: true };
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAdmin(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const updateAdmin = (updatedAdmin) => {
    setAdmin(updatedAdmin);
  };

  const value = {
    admin,
    token,
    loading,
    isAuthenticated: !!admin,
    login,
    logout,
    updateAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

