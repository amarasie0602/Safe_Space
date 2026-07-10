import { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { BlockedUsersContext } from '../context/BlockedUsersContext';
import AnonymousAvatar, { AVATAR_PRESETS } from '../components/AnonymousAvatar';
import ErrorMessage from '../components/ErrorMessage';
import Icon from '../components/Icon';

const ROLE_LABELS = {
  user: 'Member',
  moderator: 'Moderator',
  admin: 'Admin',
};

const BIO_MAX = 160;

const formatJoinDate = (isoDate) => {
  if (!isoDate) return null;
  return new Date(isoDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
};

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [selected, setSelected] = useState(user.avatarId ?? 0);
  const [bio, setBio] = useState(user.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const { showToast } = useContext(ToastContext);
  const { blockedUsers, unblockUser } = useContext(BlockedUsersContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/auth/me/stats');
        setStats(data);
      } catch {
        // Stats are a nice-to-have on this page — fail quietly.
      }
    };
    fetchStats();
  }, []);

  const dirty = selected !== (user.avatarId ?? 0) || bio !== (user.bio ?? '');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const { data } = await api.patch('/auth/profile', { avatarId: selected, bio });
      updateUser({ avatarId: data.avatarId, bio: data.bio });
      showToast('Profile updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save your profile right now.');
    } finally {
      setSaving(false);
    }
  };

  const joinDate = formatJoinDate(user.createdAt);

  const handleUnblock = async (blockedUser) => {
    try {
      await unblockUser(blockedUser._id);
      showToast(`Unblocked ${blockedUser.pseudonym}`);
    } catch {
      showToast('Unable to unblock that user right now.');
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-summary">
        <AnonymousAvatar seed={user.id} avatarId={selected} size={72} />
        <div>
          <strong>{user.pseudonym}</strong>
          <p className="text-muted">
            {ROLE_LABELS[user.role] || 'Member'} · Anonymous identity
            {joinDate && ` · Member since ${joinDate}`}
          </p>
        </div>
      </div>

      {stats && (
        <div className="profile-stats">
          <div className="profile-stat">
            <Icon name="message" size={16} />
            <span>
              <strong>{stats.postCount}</strong> posts
            </span>
          </div>
          <div className="profile-stat">
            <Icon name="heart" size={16} />
            <span>
              <strong>{stats.replyCount}</strong> replies
            </span>
          </div>
        </div>
      )}

      <h2>About me</h2>
      <p className="text-muted">
        A short, optional note other members see on your posts and threads. Keep it anonymous —
        no real names, locations, or identifying details.
      </p>
      <label className="field">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
          placeholder="e.g. Here to listen as much as I'm here to share."
          rows={3}
        />
        <span className={`char-count${bio.length >= BIO_MAX ? ' char-count-over' : ''}`}>
          {BIO_MAX - bio.length} characters left
        </span>
      </label>

      <h2>Avatar</h2>
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
        {saving ? 'Saving...' : 'Save profile'}
      </button>

      <h2>Blocked users</h2>
      <p className="text-muted">
        Blocked users' posts and threads are hidden from your feed. They aren't notified.
      </p>
      {blockedUsers.length === 0 && <p className="text-muted">You haven't blocked anyone.</p>}
      {blockedUsers.map((blockedUser) => (
        <div key={blockedUser._id} className="card-meta" style={{ justifyContent: 'space-between' }}>
          <span className="post-card-header">
            <AnonymousAvatar seed={blockedUser._id} avatarId={blockedUser.avatarId} size={28} />
            {blockedUser.pseudonym}
          </span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleUnblock(blockedUser)}>
            Unblock
          </button>
        </div>
      ))}
    </div>
  );
};

export default Profile;
