import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CounselorAuthContext } from '../context/CounselorAuthContext';
import ErrorMessage from '../components/ErrorMessage';
import AuthCard from '../components/AuthCard';

const CounselorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(CounselorAuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/counselors/login', { email, password });
      login(data);
      navigate('/counselor/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthCard title="Counselor Login" subtitle="Manage your anonymous session requests.">
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
          Log in
        </button>
      </form>
    </AuthCard>
  );
};

export default CounselorLogin;
