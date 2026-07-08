import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { CATEGORIES } from '../utils/categories';

const PostFeed = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const visiblePosts = category ? posts.filter((post) => post.category === category) : posts;

  return (
    <div>
      <div className="page-header">
        <h1>Posts</h1>
        {user && (
          <Link to="/posts/new" className="btn btn-primary btn-sm">
            New Post
          </Link>
        )}
      </div>
      <div className="tabs">
        <button className={`tab${category === '' ? ' active' : ''}`} onClick={() => setCategory('')}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            className={`tab${category === c.value ? ' active' : ''}`}
            onClick={() => setCategory(c.value)}
          >
            <span aria-hidden="true">{c.icon}</span> {c.label}
          </button>
        ))}
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && visiblePosts.length === 0 && (
        <div className="empty-state">No posts yet.</div>
      )}
      {!loading &&
        !error &&
        visiblePosts.map((post) => (
          <PostCard key={post._id} post={post} showFlagged={user?.role === 'admin'} />
        ))}
    </div>
  );
};

export default PostFeed;
