import { useEffect, useState } from 'react';
import api from '../../api/axios';

const FlaggedPostsQueue = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await api.get('/admin/posts');
      setPosts(data.filter((post) => post.status === 'under_review'));
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Flagged Posts</h1>
      {posts.map((post) => (
        <div key={post._id}>
          <p>{post.content}</p>
          <span>{post.category}</span>
        </div>
      ))}
    </div>
  );
};

export default FlaggedPostsQueue;
