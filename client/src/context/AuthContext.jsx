import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext({
  user: null,
  login: () => Promise.resolve({ success: false, error: 'Not initialized' }),
  register: () => Promise.resolve({ success: false, error: 'Not initialized' }),
  logout: () => Promise.resolve(),
  updateUser: () => { },
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  isProvider: false,
  isCustomer: false
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          // Optional: Verify token valid by calling getCurrentUser
          // const { user } = await authService.getCurrentUser();
          // setUser(user);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = React.useCallback(async (email, password, loginType = null) => {
    try {
      const data = await authService.login({ email, password });

      if (!data.user) {
        return {
          success: false,
          error: 'Login failed: No user data received'
        };
      }

      // Normalize user object - ensure role is always lowercase
      const normalizedUser = {
        ...data.user,
        role: (data.user.Role || data.user.role || '').toLowerCase(),
        Role: (data.user.Role || data.user.role || '').toLowerCase()
      };

      console.log('Login successful, normalized user:', normalizedUser);

      setUser(normalizedUser);
      // Also update localStorage with normalized user
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      
      return { success: true, user: normalizedUser };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.error || error.message || 'Invalid email or password'
      };
    }
  }, []);

  const register = React.useCallback(async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.error || error.message || 'Registration failed'
      };
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  }, []);

  const updateUser = React.useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const value = React.useMemo(() => {
    // Normalize role to handle both 'role' and 'Role' from backend
    const userRole = user?.role || user?.Role;
    
    return {
      user: user || null,
      login,
      register,
      logout,
      updateUser,
      loading: Boolean(loading),
      isAuthenticated: !!user,
      isAdmin: userRole === 'admin',
      isProvider: userRole === 'provider',
      isCustomer: userRole === 'customer'
    };
  }, [user, loading, login, register, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
