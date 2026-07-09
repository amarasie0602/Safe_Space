import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const login = ({ token, user: userData }) => {
    // A browser session is either a regular user or a counselor, never
    // both — the axios interceptor prefers whichever token is present, so a
    // lingering counselor session would otherwise silently hijack requests
    // made after logging in here.
    localStorage.removeItem('counselorToken');
    localStorage.removeItem('counselor');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
