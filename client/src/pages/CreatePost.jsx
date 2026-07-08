import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ToastContext } from '../context/ToastContext';
import { CATEGORIES } from '../utils/categories';
import MoodQuickOptions from '../components/MoodQuickOptions';
import ErrorMessage from '../components/ErrorMessage';
import Icon from '../components/Icon';

const MAX_LENGTH = 500;

const CreatePost = ({ onCreated }) => {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [content, setContent] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [status, setStatus] = useState('idle');
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleMoodSelect = (mood) => {
    setCategory(mood.category);
    setContent(mood.content);
    setValidationError('');
  };

  const validate = () => {
    if (!content.trim()) {
      return 'Please write something before publishing.';
    }
    if (!category) {
      return 'Select a category to continue.';
    }
    if (content.length > MAX_LENGTH) {
      return `Your post should be within ${MAX_LENGTH} characters.`;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (validation) {
      setValidationError(validation);
      return;
    }
    setValidationError('');
    setSubmitError('');
    setStatus('saving');
    try {
      const { data } = await api.post('/posts', { category, content });
      setStatus('published');
      setContent('');
      showToast('Post created');
      onCreated?.(data);
      navigate('/');
    } catch (err) {
      setStatus('failed');
      setSubmitError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const remaining = MAX_LENGTH - content.length;

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
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setValidationError('');
            }}
          />
          <span className={`char-count${remaining < 0 ? ' char-count-over' : ''}`}>
            {remaining} characters left
          </span>
        </label>
        {validationError && <ErrorMessage message={validationError} />}
        {submitError && <ErrorMessage message={submitError} />}
        <button type="submit" className="btn btn-primary" disabled={status === 'saving'}>
          {status === 'saving' ? 'Sharing...' : 'Share'}
        </button>
        <p className="reassurance">
          <Icon name="lock" size={14} /> Your identity is safe here — no real name, no email,
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
