import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/Card';
import CategoryTag from '../components/CategoryTag';
import Icon from '../components/Icon';
import SearchBar from '../components/SearchBar';
import ErrorMessage from '../components/ErrorMessage';
import { AuthContext } from '../context/AuthContext';
import { CATEGORIES } from '../utils/categories';

const ThreadList = () => {
  const { user } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState('');

  useEffect(() => {
    const fetchThreads = async () => {
      const { data } = await api.get('/threads', {
        params: { page: 1, limit: 10, ...(category && { category }), ...(search && { search }) },
      });
      setThreads(data.threads);
      setHasMore(data.hasMore);
      setPage(1);
    };
    fetchThreads();
  }, [category, search]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setLoadMoreError('');
    try {
      const nextPage = page + 1;
      const { data } = await api.get('/threads', {
        params: {
          page: nextPage,
          limit: 10,
          ...(category && { category }),
          ...(search && { search }),
        },
      });
      setThreads((prev) => [...prev, ...data.threads]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch {
      setLoadMoreError('Unable to load more threads right now.');
    } finally {
      setLoadingMore(false);
    }
  };

  const searchSuggestions = search
    ? [...new Set(threads.map((thread) => thread.title))].filter((title) =>
        title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const sortedThreads = [...threads].sort((a, b) => {
    if (sort === 'supported') {
      return (b.upvotes || 0) - (a.upvotes || 0);
    }
    return 0;
  });

  return (
    <div>
      <div className="page-header">
        <h1>Threads</h1>
        {user && (
          <Link to="/threads/new" className="btn btn-primary btn-sm">
            New Thread
          </Link>
        )}
      </div>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search thread titles..."
        suggestions={searchSuggestions}
      />
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
      {threads.length === 0 && <div className="empty-state">No threads found.</div>}
      {sortedThreads.map((thread) => (
        <Card key={thread._id}>
          <Link to={`/threads/${thread._id}`}>{thread.title}</Link>
          <div className="card-meta">
            <CategoryTag category={thread.category} />
            <span className="text-muted">{thread.upvotes} supports</span>
          </div>
        </Card>
      ))}
      {loadMoreError && <ErrorMessage message={loadMoreError} />}
      {hasMore && (
        <div className="load-more">
          <button type="button" className="btn btn-ghost" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading more...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreadList;
