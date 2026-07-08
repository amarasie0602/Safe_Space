const GRADIENTS = [
  ['#c4b5fd', '#f9a8d4'],
  ['#7dd3fc', '#a78bfa'],
  ['#fbcfe8', '#ddd6fe'],
  ['#a7f3d0', '#93c5fd'],
  ['#fde68a', '#fca5a5'],
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
