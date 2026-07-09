import Icon from './Icon';

const GRADIENTS = [
  ['#c8a27c', '#b97a56'],
  ['#a3b18a', '#8b6f5a'],
  ['#d6cfc7', '#c8a27c'],
  ['#8b6f5a', '#a3b18a'],
  ['#b97a56', '#d6cfc7'],
];

// Fixed set of illustrated placeholder avatars users pick from — never a
// real photo, so the pseudonymous identity model stays intact.
export const AVATAR_PRESETS = [
  { icon: 'leaf', colors: GRADIENTS[0] },
  { icon: 'wave', colors: GRADIENTS[1] },
  { icon: 'cloud', colors: GRADIENTS[2] },
  { icon: 'star', colors: GRADIENTS[3] },
  { icon: 'heart', colors: GRADIENTS[4] },
  { icon: 'sun', colors: GRADIENTS[0] },
  { icon: 'moon', colors: GRADIENTS[1] },
  { icon: 'shield', colors: GRADIENTS[2] },
  { icon: 'users', colors: GRADIENTS[3] },
  { icon: 'home', colors: GRADIENTS[4] },
];

const hashSeed = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % GRADIENTS.length;
  }
  return Math.abs(hash);
};

const AnonymousAvatar = ({ seed = '', avatarId, size }) => {
  const preset = typeof avatarId === 'number' ? AVATAR_PRESETS[avatarId] : null;
  const [from, to] = preset ? preset.colors : GRADIENTS[hashSeed(String(seed))];
  const style = { background: `linear-gradient(135deg, ${from}, ${to})` };
  if (size) {
    style.width = size;
    style.height = size;
  }

  return (
    <span className="anon-avatar" style={style} aria-hidden="true">
      {preset && <Icon name={preset.icon} size={size ? Math.round(size * 0.45) : 17} className="anon-avatar-icon" />}
    </span>
  );
};

export default AnonymousAvatar;
