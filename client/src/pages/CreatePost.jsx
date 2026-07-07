import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ToastContext } from '../context/ToastContext';

const CATEGORIES = ['mental_health', 'family', 'financial', 'academic', 'relationships', 'addiction'];

const CreatePost = ({ onCreated }) => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState('');
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/posts', { category, content });
    setContent('');
    showToast('Post created');
    onCreated?.(data);
    navigate('/');
  };

  return (
    <div>
      <h1>New Post</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          What&apos;s on your mind?
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </label>
        <button type="submit" className="btn btn-primary">
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
