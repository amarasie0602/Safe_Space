import { useState } from 'react';
import api from '../api/axios';

const CATEGORIES = ['mental_health', 'family', 'financial', 'academic', 'relationships', 'addiction'];

const CreatePost = ({ onCreated }) => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/posts', { category, content });
    setContent('');
    onCreated?.(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        required
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default CreatePost;
