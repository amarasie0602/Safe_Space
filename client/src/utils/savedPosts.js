// Bookmarking has no backend support (no saved-posts field/endpoint exists),
// so this is stored per-browser only. It won't sync across devices.
const STORAGE_KEY = 'safespace_saved_posts';

export const getSavedPostIds = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const isSaved = (postId) => getSavedPostIds().includes(postId);

export const toggleSavedPost = (postId) => {
  const current = getSavedPostIds();
  const next = current.includes(postId)
    ? current.filter((id) => id !== postId)
    : [...current, postId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next.includes(postId);
};
