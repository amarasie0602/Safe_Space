import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { ToastContext } from '../context/ToastContext';
import { recordSupportedThread } from '../utils/supportedThreads';
import { recordMyReply } from '../utils/myReplies';

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
    recordMyReply(data, id, thread.title);
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
      recordSupportedThread(thread);
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
      <span className="badge">{thread.category.replace('_', ' ')}</span>
      <h1>{thread.title}</h1>
      <p>{thread.body}</p>
      <button className="btn btn-ghost btn-sm" onClick={handleUpvoteThread}>
        ▲ {thread.upvotes}
      </button>

      <h2>Replies</h2>
      {replies.length === 0 && <div className="empty-state">No replies yet.</div>}
      {replies.map((reply) => (
        <Card key={reply._id}>
          <p>{reply.body}</p>
          <div className="card-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => handleUpvoteReply(reply._id)}>
              ▲ {reply.upvotes}
            </button>
            {reply.flagged ? (
              <span className="badge badge-danger">flagged</span>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={() => handleFlag(reply._id)}>
                Flag
              </button>
            )}
          </div>
        </Card>
      ))}

      <h2>Write a reply</h2>
      <form className="form form-wide" onSubmit={handleReplySubmit}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a reply"
          required
        />
        <button type="submit" className="btn btn-primary">
          Reply
        </button>
      </form>
    </div>
  );
};

export default ThreadDetail;
