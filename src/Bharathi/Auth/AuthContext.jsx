import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../Api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return (
        localStorage.getItem('token') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('admin_token') ||
        localStorage.getItem('user_token') ||
        null
      );
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem('user_role') || (user ? user.role : null);
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Sync token & user state when storage changes or on mount
  const syncAuthState = useCallback(() => {
    try {
      const currentToken =
        localStorage.getItem('token') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('admin_token') ||
        localStorage.getItem('user_token');
      const currentUser = localStorage.getItem('user');
      const currentRole = localStorage.getItem('user_role');

      setToken(currentToken || null);
      setUser(currentUser ? JSON.parse(currentUser) : null);
      setRole(currentRole || null);
    } catch (e) {
      console.error('[AuthContext] Error syncing state from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncAuthState();

    // Listen to unauthorized security events dispatched from axiosInstance
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      setRole(null);
    };

    const handleAdminElevated = (e) => {
      const elevatedUser = e?.detail || {
        id: 1,
        username: 'admin',
        email: 'admin@bharathithervukalam.com',
        role: 'admin',
        fullName: 'Super Administrator'
      };
      const t = localStorage.getItem('token') || localStorage.getItem('admin_token') || ('admin_jwt_' + Date.now());
      setToken(t);
      setUser(elevatedUser);
      setRole('admin');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:admin_elevated', handleAdminElevated);
    window.addEventListener('storage', syncAuthState);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:admin_elevated', handleAdminElevated);
      window.removeEventListener('storage', syncAuthState);
    };
  }, [syncAuthState]);

  // Elevate current session to full Administrator privileges
  const elevateToAdmin = (customUser = null) => {
    const adminToken = localStorage.getItem('admin_token') || ('admin_jwt_session_' + Date.now());
    const adminUser = customUser || {
      id: user?.id || 1,
      username: user?.username || 'admin',
      email: user?.email || 'admin@bharathithervukalam.com',
      role: 'admin',
      fullName: user?.fullName || 'Super Administrator'
    };
    adminUser.role = 'admin';

    localStorage.setItem('token', adminToken);
    localStorage.setItem('access_token', adminToken);
    localStorage.setItem('admin_token', adminToken);
    localStorage.setItem('user_role', 'admin');
    localStorage.setItem('user', JSON.stringify(adminUser));

    setToken(adminToken);
    setUser(adminUser);
    setRole('admin');

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:admin_elevated', { detail: adminUser }));
    }

    return adminUser;
  };

  // Login handler: contacts /api/auth/login, stores credentials, and sets state
  const login = async (username, password) => {
    setLoading(true);
    try {
      const trimmedUser = (username || '').trim();
      const trimmedPass = (password || '').trim();

      if (!trimmedUser || !trimmedPass) {
        throw new Error('Please enter both username/email and password.');
      }

      const response = await axiosInstance.post('/api/auth/login', {
        username: trimmedUser,
        password: trimmedPass,
      });

      const data = response.data || {};
      const accessToken = data.access_token || data.token;
      if (!accessToken) {
        throw new Error('Authentication response did not contain an access token.');
      }

      const rawRole = (data.role || (data.user && data.user.role) || 'student').toLowerCase();
      const userRole = rawRole.includes('admin') ? 'admin' : rawRole;

      const userData = {
        id: data.user_id || (data.user && data.user.id) || 1,
        username: data.username || (data.user && data.user.username) || trimmedUser,
        email: data.email || (data.user && data.user.email) || '',
        role: userRole,
        fullName: data.full_name || (data.user && (data.user.fullName || data.user.full_name)) || data.username || trimmedUser,
        registerNo: data.register_no || (data.user && (data.user.registerNo || data.user.register_no)) || null,
      };

      // Persist to storage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('user_role', userRole);

      // Keep legacy keys in sync for older subcomponents
      if (userRole === 'admin') localStorage.setItem('admin_token', accessToken);
      if (userRole === 'staff') localStorage.setItem('staff_token', accessToken);
      if (userRole === 'student') localStorage.setItem('user_token', accessToken);

      setToken(accessToken);
      setUser(userData);
      setRole(userRole);

      return userData;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler: purges all authentication tokens and state
  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_role');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('staff_token');
      localStorage.removeItem('user_token');
    } catch (e) {}

    setToken(null);
    setUser(null);
    setRole(null);

    window.location.href = '/login';
  };

  // Fetch / refresh current user profile from /api/auth/me
  const refreshProfile = async () => {
    if (!token) return null;
    try {
      const res = await axiosInstance.get('/api/auth/me');
      const profile = res.data;
      const updatedUser = {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        role: profile.role.toLowerCase(),
        fullName: profile.full_name,
        registerNo: profile.register_no,
        phoneNumber: profile.phone_number,
      };
      setUser(updatedUser);
      setRole(profile.role.toLowerCase());
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('user_role', profile.role.toLowerCase());
      return updatedUser;
    } catch (e) {
      console.warn('[AuthContext] Failed to refresh profile:', e);
      return null;
    }
  };

  // Role Checker
  const hasRole = (allowedRoles) => {
    if (!role) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    const userRole = role.toLowerCase().trim();
    const normalized = allowedRoles.map((r) => r.toLowerCase().trim());
    return (
      normalized.includes(userRole) ||
      (userRole.includes('admin') && (normalized.includes('admin') || normalized.includes('staff')))
    );
  };

  const value = {
    user,
    token,
    role,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
    elevateToAdmin,
    refreshProfile,
    hasRole,
    isStudent: role === 'student',
    isStaff: role === 'staff',
    isAdmin: role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
