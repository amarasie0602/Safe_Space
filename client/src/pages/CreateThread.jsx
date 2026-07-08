import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CATEGORIES } from '../utils/categories';

const CreateThread = ({ onCreated }) => {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/threads', { category, title, body });
    setTitle('');
    setBody('');
    onCreated?.(data);
    navigate(`/threads/${data._id}`);
  };

  return (
    <div>
      <h1>New Thread</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className="field">
          Body
          <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
        </label>
        <button type="submit" className="btn btn-primary">
          Create Thread
        </button>
      </form>
    </div>
  );
};

export default CreateThread;
