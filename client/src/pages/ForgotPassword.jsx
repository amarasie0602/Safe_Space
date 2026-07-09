import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ErrorMessage from '../components/ErrorMessage';
import AuthCard from '../components/AuthCard';
import RecoveryCodeDialog from '../components/RecoveryCodeDialog';

const ForgotPassword = () => {
  const [pseudonym, setPseudonym] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const [nextRecoveryCode, setNextRecoveryCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('saving');
    try {
      const { data } = await api.post('/auth/reset-password', {
        pseudonym,
        recoveryCode,
        newPassword,
      });
      setNextRecoveryCode(data.recoveryCode);
      setStatus('done');
    } catch (err) {
      setStatus('idle');
      setError(err.response?.data?.message || 'Unable to reset your password right now.');
    }
  };

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter the recovery code you saved when you registered."
    >
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Nickname
          <input value={pseudonym} onChange={(e) => setPseudonym(e.target.value)} required />
        </label>
        <label className="field">
          Recovery code
          <input
            value={recoveryCode}
            onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX-XXXX"
            required
          />
        </label>
        <label className="field">
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        {error && <ErrorMessage message={error} />}
        <button type="submit" className="btn btn-primary" disabled={status === 'saving'}>
          {status === 'saving' ? 'Resetting...' : 'Reset password'}
        </button>
        <p className="text-muted">
          Remembered it after all? <Link to="/login">Log in</Link>
        </p>
      </form>
      {nextRecoveryCode && (
        <RecoveryCodeDialog recoveryCode={nextRecoveryCode} onContinue={() => navigate('/login')} />
      )}
    </AuthCard>
  );
};

export default ForgotPassword;
