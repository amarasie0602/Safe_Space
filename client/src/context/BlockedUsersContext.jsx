import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

export const BlockedUsersContext = createContext(null);

export const BlockedUsersProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setBlockedUsers([]);
      setLoaded(true);
      return;
    }
    try {
      const { data } = await api.get('/auth/me/blocked-users');
      setBlockedUsers(data);
    } finally {
      setLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isBlocked = (userId) => blockedUsers.some((u) => u._id === userId);

  const blockUser = async (userId) => {
    await api.post(`/auth/users/${userId}/block`);
    refresh();
  };

  const unblockUser = async (userId) => {
    setBlockedUsers((prev) => prev.filter((u) => u._id !== userId));
    await api.post(`/auth/users/${userId}/unblock`);
  };

  return (
    <BlockedUsersContext.Provider value={{ blockedUsers, loaded, isBlocked, blockUser, unblockUser }}>
      {children}
    </BlockedUsersContext.Provider>
  );
};
