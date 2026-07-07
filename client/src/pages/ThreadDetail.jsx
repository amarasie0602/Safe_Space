import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { ToastContext } from '../context/ToastContext';

const ThreadDetail = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [body, setBody] = useState('');
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    const fetchThread = async () => {
      const { data } = await api.get(`/threads/${id}`);
      setThread(data);
    };
    fetchThread();
  }, [id]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post(`/threads/${id}/replies`, { body });
    setReplies((prev) => [...prev, data]);
    setBody('');
  };

  const handleFlag = async (replyId) => {
    await api.patch(`/replies/${replyId}/flag`);
    setReplies((prev) => prev.map((r) => (r._id === replyId ? { ...r, flagged: true } : r)));
    showToast('Reply flagged');
  };

  const handleUpvoteThread = async () => {
    setThread((prev) => ({ ...prev, upvotes: prev.upvotes + 1 }));
    try {
      await api.patch(`/threads/${id}/upvote`);
    } catch {
      setThread((prev) => ({ ...prev, upvotes: prev.upvotes - 1 }));
    }
  };

  const handleUpvoteReply = async (replyId) => {
    setReplies((prev) => prev.map((r) => (r._id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r)));
    try {
      await api.patch(`/replies/${replyId}/upvote`);
    } catch {
      setReplies((prev) => prev.map((r) => (r._id === replyId ? { ...r, upvotes: r.upvotes - 1 } : r)));
    }
  };

  if (!thread) return <LoadingSpinner />;

  return (
    <div>
      <h1>{thread.title}</h1>
      <p>{thread.body}</p>
      <button onClick={handleUpvoteThread}>Upvote ({thread.upvotes})</button>
      <h2>Replies</h2>
      {replies.map((reply) => (
        <div key={reply._id}>
          <p>{reply.body}</p>
          <button onClick={() => handleUpvoteReply(reply._id)}>Upvote ({reply.upvotes})</button>
          {reply.flagged ? <span>flagged</span> : <button onClick={() => handleFlag(reply._id)}>Flag</button>}
        </div>
      ))}
      <form onSubmit={handleReplySubmit}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a reply"
          required
        />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
};

export default ThreadDetail;
