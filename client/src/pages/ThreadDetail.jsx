import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const ThreadDetail = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [body, setBody] = useState('');

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

  if (!thread) return <p>Loading thread...</p>;

  return (
    <div>
      <h1>{thread.title}</h1>
      <p>{thread.body}</p>
      <h2>Replies</h2>
      {replies.map((reply) => (
        <div key={reply._id}>
          <p>{reply.body}</p>
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
