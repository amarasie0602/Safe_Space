import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/Card';

const CATEGORIES = ['mental_health', 'family', 'financial', 'academic', 'relationships', 'addiction'];

const ThreadList = () => {
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
      <h1>Threads</h1>
      <div>
        <button onClick={() => setCategory('')}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
      {threads.length === 0 && <p>No threads yet.</p>}
      {threads.map((thread) => (
        <Card key={thread._id}>
          <Link to={`/threads/${thread._id}`}>{thread.title}</Link>
        </Card>
      ))}
    </div>
  );
};

export default ThreadList;
