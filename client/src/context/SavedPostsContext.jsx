import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

export const SavedPostsContext = createContext(null);

export const SavedPostsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setSavedPosts([]);
      setLoaded(true);
      return;
    }
    try {
      const { data } = await api.get('/auth/me/saved-posts');
      setSavedPosts(data);
    } finally {
      setLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isSaved = (postId) => savedPosts.some((post) => post._id === postId);

  const toggleSaved = async (postId) => {
    const { data } = await api.patch(`/auth/saved-posts/${postId}`);
    if (data.saved) {
      refresh();
    } else {
      setSavedPosts((prev) => prev.filter((post) => post._id !== postId));
    }
    return data.saved;
  };

  return (
    <SavedPostsContext.Provider value={{ savedPosts, loaded, isSaved, toggleSaved }}>
      {children}
    </SavedPostsContext.Provider>
  );
};
