import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import SkeletonCard from '../components/SkeletonCard';
import ErrorMessage from '../components/ErrorMessage';
import NetworkError from '../components/NetworkError';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import Icon from '../components/Icon';
import { CATEGORIES } from '../utils/categories';
import { isBlocked } from '../utils/blockedUsers';

const PostFeed = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadMoreError, setLoadMoreError] = useState('');
  const [blockedVersion, setBlockedVersion] = useState(0);
  const [supportState, setSupportState] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/posts', { params: { page: 1, limit: 10 } });
      setPosts(data.posts);
      setHasMore(data.hasMore);
      setPage(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load content right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setLoadMoreError('');
    try {
      const nextPage = page + 1;
      const { data } = await api.get('/posts', { params: { page: nextPage, limit: 10 } });
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch {
      setLoadMoreError('Unable to load more posts right now.');
    } finally {
      setLoadingMore(false);
    }
  };

  const visiblePosts = posts
    .filter((post) => !category || post.category === category)
    .filter((post) => !isBlocked(post.author?._id))
    .filter((post) => !search || post.content.toLowerCase().includes(search.toLowerCase()));

  const searchSuggestions = search
    ? [...new Set(posts.map((post) => post.content))].filter((content) =>
        content.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const sortedPosts = [...visiblePosts].sort((a, b) => {
    if (sort === 'supported') {
      const countA = supportState[a._id]?.count || 0;
      const countB = supportState[b._id]?.count || 0;
      return countB - countA;
    }
    return 0;
  });

  const handleBlocked = () => setBlockedVersion((prev) => prev + 1);

  const handleToggleSupport = (postId) => {
    setSupportState((prev) => {
      const current = prev[postId] || { supported: false, count: 0 };
      return {
        ...prev,
        [postId]: {
          supported: !current.supported,
          count: current.supported ? current.count - 1 : current.count + 1,
        },
      };
    });
  };

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
        <Icon name="lock" size={14} /> Your identity is safe here.
      </p>
      <SearchBar value={search} onChange={setSearch} placeholder="Search posts..." suggestions={searchSuggestions} />
      <div className="filter-row">
        <label className="sort-select">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="supported">Most Supported</option>
          </select>
        </label>
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
            <Icon name={c.icon} size={14} /> {c.label}
          </button>
        ))}
      </div>
      {loading && (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      )}
      {!loading && error && <NetworkError message={error} onRetry={fetchPosts} />}
      {!loading && !error && visiblePosts.length === 0 && posts.length > 0 && (
        <div className="empty-state">No posts found. Try a different search or category.</div>
      )}
      {!loading && !error && visiblePosts.length === 0 && posts.length === 0 && (
        <EmptyState message="You're not alone. Share when you're ready." />
      )}
      {!loading &&
        !error &&
        sortedPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            showFlagged={user?.role === 'admin'}
            onBlocked={handleBlocked}
            supported={supportState[post._id]?.supported || false}
            supportCount={supportState[post._id]?.count || 0}
            onToggleSupport={() => handleToggleSupport(post._id)}
          />
        ))}
      {loadMoreError && <ErrorMessage message={loadMoreError} />}
      {!loading && !error && !category && !search && hasMore && (
        <div className="load-more">
          <button type="button" className="btn btn-ghost" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading more...' : 'Load more'}
          </button>
        </div>
      )}
      {user && (
        <Link to="/posts/new" className="fab" aria-label="Create a new post" title="Create a new post">
          +
        </Link>
      )}
    </div>
  );
};

export default PostFeed;
