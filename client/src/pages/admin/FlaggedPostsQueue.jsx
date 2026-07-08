import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import CategoryTag from '../../components/CategoryTag';

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

  const handleDelete = async (postId) => {
    await api.delete(`/admin/posts/${postId}`);
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  return (
    <div>
      <h1>Flagged Posts</h1>
      {posts.length === 0 && <div className="empty-state">No flagged posts.</div>}
      {posts.map((post) => (
        <Card key={post._id}>
          <p>{post.content}</p>
          <div className="card-meta">
            <CategoryTag category={post.category} />
          </div>
          <div className="card-actions">
            <button className="btn btn-primary btn-sm" onClick={() => handleStatusUpdate(post._id, 'visible')}>
              Approve
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => handleStatusUpdate(post._id, 'removed')}>
              Remove
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post._id)}>
              Delete
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FlaggedPostsQueue;
