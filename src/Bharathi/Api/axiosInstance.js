/**
 * Bharathi Thervukalam - Secure Axios Client with Request & Response Interceptors
 * Strict JWT Bearer Token Injection & 401/403 Automatic Eviction Handler.
 */

import axios from 'axios';

// Resolve Base URL dynamically: Environment -> LocalStorage override -> Default
export const API_BASE_URL = (() => {
  if (process.env.REACT_APP_API_URL) {
    const url = process.env.REACT_APP_API_URL.trim();
    return url.endsWith('/') ? url : `${url}/`;
  }
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('backend_api_url');
    if (custom && custom.trim()) {
      return custom.endsWith('/') ? custom.trim() : `${custom.trim()}/`;
    }
    // When running locally on dev server, connect to Python backend on port 5000
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/';
    }
  }
  return '/';
})();

// Create primary instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR:
 * Automatically injects the JWT Bearer Token into the Authorization header
 * for all outgoing HTTP requests.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('user_token') ||
        localStorage.getItem('admin_token') ||
        localStorage.getItem('staff_token');

      if (token) {
        config.headers.Authorization = `Bearer ${token.trim()}`;
      }
    } catch (err) {
      console.error('[Axios Request Interceptor] Failed to read token from storage:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR:
 * Listens for HTTP 401 Unauthorized and 403 Forbidden.
 * On 401: Immediately purges invalid/expired token and redirects to /login.
 * On 403: Throws role clearance violation error.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const requestUrl = error.config?.url || '';

    // Ignore 401 on login endpoint itself so login form can display "Invalid credentials"
    const isLoginEndpoint = requestUrl.includes('/api/auth/login') || requestUrl.includes('login');

    if (status === 401 && !isLoginEndpoint) {
      console.warn('[Security Guard] 401 Unauthorized detected. Purging authentication credentials.');

      // Clear all authentication artifacts
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_token');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('staff_token');
      } catch (e) {}

      // Trigger custom event so AuthContext updates state instantly
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { url: requestUrl } }));

        // Redirect to login if not already on an auth page
        const currentPath = window.location.pathname;
        if (!['/login', '/Student-Login', '/Admin-Login', '/Staff-Login'].includes(currentPath)) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}&reason=session_expired`;
        }
      }
    } else if (status === 403) {
      console.warn('[Security Guard] 403 Forbidden. Role lacks required permissions for:', requestUrl);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('auth:forbidden', {
            detail: {
              url: requestUrl,
              message: error.response?.data?.detail || 'Permission denied.',
            },
          })
        );
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
