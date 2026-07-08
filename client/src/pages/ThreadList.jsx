import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/Card';
import CategoryTag from '../components/CategoryTag';
import Icon from '../components/Icon';
import { AuthContext } from '../context/AuthContext';
import { CATEGORIES } from '../utils/categories';

const ThreadList = () => {
  const { user } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchThreads = async () => {
      const { data } = await api.get('/threads', { params: category ? { category } : {} });
      setThreads(data);
    };
    fetchThreads();
  }, [category]);

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
      {threads.length === 0 && <div className="empty-state">No threads yet.</div>}
      {threads.map((thread) => (
        <Card key={thread._id}>
          <Link to={`/threads/${thread._id}`}>{thread.title}</Link>
          <div className="card-meta">
            <CategoryTag category={thread.category} />
            <span className="text-muted">{thread.upvotes} supports</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ThreadList;
