import { useEffect, useState } from 'react';
import api from '../api/axios';

const CATEGORIES = ['mental_health', 'family', 'financial', 'academic', 'relationships', 'addiction'];

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await api.get('/posts');
      setPosts(data);
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
      {visiblePosts.map((post) => (
        <div key={post._id}>
          <p>{post.content}</p>
          <span>{post.category}</span>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
