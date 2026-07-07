import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/Card';
import { AuthContext } from '../context/AuthContext';

const CATEGORIES = ['mental_health', 'family', 'financial', 'academic', 'relationships', 'addiction'];

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
            key={c}
            className={`tab${category === c ? ' active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c.replace('_', ' ')}
          </button>
        ))}
      </div>
      {threads.length === 0 && <div className="empty-state">No threads yet.</div>}
      {threads.map((thread) => (
        <Card key={thread._id}>
          <Link to={`/threads/${thread._id}`}>{thread.title}</Link>
          <div className="card-meta">
            <span className="badge">{thread.category.replace('_', ' ')}</span>
            <span className="text-muted">{thread.upvotes} upvotes</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ThreadList;
