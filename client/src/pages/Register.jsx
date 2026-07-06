import { useState } from 'react';
import api from '../api/axios';

const Register = () => {
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/auth/register', { pseudonym, password });
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
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
