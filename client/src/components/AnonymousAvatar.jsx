const GRADIENTS = [
  ['#c8a27c', '#b97a56'],
  ['#a3b18a', '#8b6f5a'],
  ['#d6cfc7', '#c8a27c'],
  ['#8b6f5a', '#a3b18a'],
  ['#b97a56', '#d6cfc7'],
];

const hashSeed = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % GRADIENTS.length;
  }
  return Math.abs(hash);
};

const AnonymousAvatar = ({ seed = '' }) => {
  const [from, to] = GRADIENTS[hashSeed(String(seed))];

  return (
    <span
      className="anon-avatar"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    />
  );
};

export default AnonymousAvatar;
