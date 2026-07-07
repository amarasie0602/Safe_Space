import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

const ADJECTIVES = ['quiet', 'steady', 'hopeful', 'gentle', 'brave', 'calm', 'kind', 'bright'];
const NOUNS = ['fox', 'river', 'sky', 'maple', 'harbor', 'ember', 'willow', 'meadow'];

const suggestNickname = () => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 900) + 100;
  return `${adjective}_${noun}${number}`;
};

const Register = () => {
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', { pseudonym, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h1>Join SafeSpace</h1>
      <p className="text-muted">
        No real name, no email needed — just pick a nickname others will see and a password
        only you know.
      </p>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Nickname
          <div className="input-group">
            <input
              value={pseudonym}
              onChange={(e) => setPseudonym(e.target.value)}
              minLength={3}
              maxLength={32}
              required
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setPseudonym(suggestNickname())}
            >
              Suggest one
            </button>
          </div>
        </label>
        <label className="field">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        {error && <ErrorMessage message={error} />}
        <button type="submit" className="btn btn-primary">
          Create account
        </button>
      </form>
    </div>
  );
};

export default Register;
