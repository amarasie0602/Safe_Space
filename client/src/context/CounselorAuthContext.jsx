import { createContext, useState } from 'react';

export const CounselorAuthContext = createContext(null);

const getStoredCounselor = () => {
  const stored = localStorage.getItem('counselor');
  return stored ? JSON.parse(stored) : null;
};

export const CounselorAuthProvider = ({ children }) => {
  const [counselor, setCounselor] = useState(getStoredCounselor);

  const login = ({ token, counselor: counselorData }) => {
    // A browser session is either a regular user or a counselor, never
    // both — see the matching guard in AuthContext.login.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('counselorToken', token);
    localStorage.setItem('counselor', JSON.stringify(counselorData));
    setCounselor(counselorData);
  };

  const logout = () => {
    localStorage.removeItem('counselorToken');
    localStorage.removeItem('counselor');
    setCounselor(null);
  };

  return (
    <CounselorAuthContext.Provider value={{ counselor, login, logout }}>
      {children}
    </CounselorAuthContext.Provider>
  );
};
