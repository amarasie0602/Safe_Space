import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  // A browser session is either a regular user or a counselor, never both,
  // so whichever token is present is the one to send.
  const token = localStorage.getItem('counselorToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// These endpoints return 401 as a normal validation outcome (wrong password,
// wrong recovery code) that the calling page already shows inline — a
// session-expiry redirect here would blow away that in-progress form instead.
const AUTH_ATTEMPT_PATHS = [
  '/auth/login',
  '/auth/reset-password',
  '/auth/me/recovery-code/regenerate',
  '/counselors/login',
];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthAttempt = AUTH_ATTEMPT_PATHS.some((path) => error.config?.url?.includes(path));
    if (error.response?.status === 401 && !isAuthAttempt) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
