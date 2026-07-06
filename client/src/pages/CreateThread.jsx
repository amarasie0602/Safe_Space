import { useState } from 'react';
import api from '../api/axios';

const CATEGORIES = ['mental_health', 'family', 'financial', 'academic', 'relationships', 'addiction'];

const CreateThread = ({ onCreated }) => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/threads', { category, title, body });
    setTitle('');
    setBody('');
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
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" required />
      <button type="submit">Create Thread</button>
    </form>
  );
};

export default CreateThread;
