import { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';

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
      <h1>Posts</h1>
      <div>
        <button onClick={() => setCategory('')}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
      {loading && <p>Loading posts...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading &&
        !error &&
        visiblePosts.map((post) => (
          <Card key={post._id}>
            <p>{post.content}</p>
            <span>{post.category}</span>
            {user?.role === 'admin' && post.flagged && <span>flagged</span>}
          </Card>
        ))}
    </div>
  );
};

export default PostFeed;
