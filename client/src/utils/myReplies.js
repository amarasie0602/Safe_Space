// There's no backend endpoint to fetch "all replies by me" across every
// thread, so this keeps a local activity log for My Activity to read from.
const STORAGE_KEY = 'safespace_my_replies';

export const getMyReplies = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const recordMyReply = (reply, threadId, threadTitle) => {
  const current = getMyReplies();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([{ ...reply, threadId, threadTitle }, ...current])
  );
};
