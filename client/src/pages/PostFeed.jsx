import { useEffect, useState } from 'react';
import api from '../api/axios';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await api.get('/posts');
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post._id}>
          <p>{post.content}</p>
          <span>{post.category}</span>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
