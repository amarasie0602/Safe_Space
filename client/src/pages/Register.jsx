import { useState } from 'react';
import api from '../api/axios';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', { pseudonym, password });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <label>
        Pseudonym
        <input value={pseudonym} onChange={(e) => setPseudonym(e.target.value)} required />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <ErrorMessage message={error} />}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
