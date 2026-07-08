import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ToastContext } from '../context/ToastContext';
import { CATEGORIES } from '../utils/categories';
import MoodQuickOptions from '../components/MoodQuickOptions';

const CreatePost = ({ onCreated }) => {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [content, setContent] = useState('');
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleMoodSelect = (mood) => {
    setCategory(mood.category);
    setContent(mood.content);
  };

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
      <p className="text-muted">Not sure what to say? Try one of these:</p>
      <MoodQuickOptions onSelect={handleMoodSelect} />
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          What&apos;s on your mind?
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </label>
        <button type="submit" className="btn btn-primary">
          Share
        </button>
        <p className="reassurance">
          <span aria-hidden="true">🔒</span> Your identity is safe here — no real name, no email,
          just your nickname.
        </p>
      </form>
      <p className="text-muted">
        Please keep posts kind and on-topic — see our <Link to="/guidelines">Community Guidelines</Link>.
      </p>
    </div>
  );
};

export default CreatePost;
