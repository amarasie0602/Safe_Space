import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import AuthCard from '../components/AuthCard';

const Login = () => {
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { pseudonym, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Good to see you again — your space is right where you left it.">
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Nickname
          <input value={pseudonym} onChange={(e) => setPseudonym(e.target.value)} required />
        </label>
        <label className="field">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <ErrorMessage message={error} />}
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <p className="text-muted">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default Login;
