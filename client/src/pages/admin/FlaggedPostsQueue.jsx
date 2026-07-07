import { useEffect, useState } from 'react';
import api from '../../api/axios';

const FlaggedPostsQueue = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await api.get('/admin/posts');
      setPosts(data.filter((post) => post.status === 'under_review'));
    };
    fetchPosts();
  }, []);

  const handleStatusUpdate = async (postId, status) => {
    await api.patch(`/admin/posts/${postId}/status`, { status });
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  return (
    <div>
      <h1>Flagged Posts</h1>
      {posts.map((post) => (
        <div key={post._id}>
          <p>{post.content}</p>
          <span>{post.category}</span>
          <button onClick={() => handleStatusUpdate(post._id, 'visible')}>Approve</button>
          <button onClick={() => handleStatusUpdate(post._id, 'removed')}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default FlaggedPostsQueue;
