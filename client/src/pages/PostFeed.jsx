import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = ['mental_health', 'family', 'financial', 'academic', 'relationships', 'addiction'];

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
            key={c}
            className={`tab${category === c ? ' active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c.replace('_', ' ')}
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
          <Card key={post._id}>
            <p>{post.content}</p>
            <div className="card-meta">
              <span className="badge">{post.category.replace('_', ' ')}</span>
              {user?.role === 'admin' && post.flagged && <span className="badge badge-danger">flagged</span>}
            </div>
          </Card>
        ))}
    </div>
  );
};

export default PostFeed;
