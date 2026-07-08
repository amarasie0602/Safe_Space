// There's no backend record of which threads a user has upvoted (upvotes are
// just a counter). This tracks it per-browser so "Supported Discussions" in
// My Activity has something real to show.
const STORAGE_KEY = 'safespace_supported_threads';

export const getSupportedThreads = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const recordSupportedThread = (thread) => {
  const current = getSupportedThreads();
  if (!current.some((t) => t._id === thread._id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, thread]));
  }
};
