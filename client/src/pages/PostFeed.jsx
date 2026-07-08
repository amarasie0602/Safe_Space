import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import { CATEGORIES } from '../utils/categories';
import { isBlocked } from '../utils/blockedUsers';

const PostFeed = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [blockedVersion, setBlockedVersion] = useState(0);

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

  const visiblePosts = posts
    .filter((post) => !category || post.category === category)
    .filter((post) => !isBlocked(post.author?._id))
    .filter((post) => !search || post.content.toLowerCase().includes(search.toLowerCase()));

  const searchSuggestions = search
    ? [...new Set(posts.map((post) => post.content))].filter((content) =>
        content.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleBlocked = () => setBlockedVersion((prev) => prev + 1);

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
      <p className="reassurance">
        <span aria-hidden="true">🔒</span> Your identity is safe here.
      </p>
      <SearchBar value={search} onChange={setSearch} placeholder="Search posts..." suggestions={searchSuggestions} />
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
      {!loading && !error && visiblePosts.length === 0 && posts.length > 0 && (
        <div className="empty-state">No posts found. Try a different search or category.</div>
      )}
      {!loading && !error && visiblePosts.length === 0 && posts.length === 0 && (
        <EmptyState message="You're not alone. Be the first to share 💜" />
      )}
      {!loading &&
        !error &&
        visiblePosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            showFlagged={user?.role === 'admin'}
            onBlocked={handleBlocked}
          />
        ))}
      {user && (
        <Link to="/posts/new" className="fab" aria-label="Create a new post">
          +
        </Link>
      )}
    </div>
  );
};

export default PostFeed;
