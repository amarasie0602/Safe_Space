import { useContext, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import AnonymousAvatar, { AVATAR_PRESETS } from '../components/AnonymousAvatar';
import ErrorMessage from '../components/ErrorMessage';

const ROLE_LABELS = {
  user: 'Member',
  moderator: 'Moderator',
  admin: 'Admin',
};

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [selected, setSelected] = useState(user.avatarId ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useContext(ToastContext);

  const dirty = selected !== (user.avatarId ?? 0);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const { data } = await api.patch('/auth/profile', { avatarId: selected });
      updateUser({ avatarId: data.avatarId });
      showToast('Profile updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save your avatar right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-summary">
        <AnonymousAvatar seed={user.id} avatarId={selected} size={72} />
        <div>
          <strong>{user.pseudonym}</strong>
          <p className="text-muted">{ROLE_LABELS[user.role] || 'Member'} · Anonymous identity</p>
        </div>
      </div>

      <p className="text-muted">
        Choose a placeholder avatar. SafeSpace never uses real photos — this is purely a visual
        pick so people can recognize your posts without knowing who you are.
      </p>

      <div className="avatar-picker">
        {AVATAR_PRESETS.map((preset, index) => (
          <button
            key={preset.icon}
            type="button"
            className={`avatar-picker-option${selected === index ? ' selected' : ''}`}
            onClick={() => setSelected(index)}
            aria-label={`Avatar option ${index + 1}`}
            aria-pressed={selected === index}
          >
            <AnonymousAvatar avatarId={index} size={48} />
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} />}

      <button type="button" className="btn btn-primary" onClick={handleSave} disabled={!dirty || saving}>
        {saving ? 'Saving...' : 'Save avatar'}
      </button>
    </div>
  );
};

export default Profile;
