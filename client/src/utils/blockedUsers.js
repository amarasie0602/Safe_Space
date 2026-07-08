// There is no backend concept of "blocking" a user — this is a browser-local
// blocklist only. It hides content from blocked authors in this browser, but
// does not stop them from seeing or interacting with you, and does not sync
// across devices. A real block feature would need backend support.
const STORAGE_KEY = 'safespace_blocked_users';

export const getBlockedUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const isBlocked = (userId) => getBlockedUsers().includes(userId);

export const blockUser = (userId) => {
  const current = getBlockedUsers();
  if (!current.includes(userId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, userId]));
  }
};

export const unblockUser = (userId) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getBlockedUsers().filter((id) => id !== userId)));
};
