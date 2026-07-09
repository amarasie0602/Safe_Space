// A small hand-drawn mark for the "Coffee & Comfort" theme — a plant
// growing from a cup, echoing the same flat, no-photo illustration style
// as EmptyState/NotFound rather than a stock photo.
const GrowthIllustration = () => (
  <svg width="112" height="112" viewBox="0 0 112 112" fill="none" aria-hidden="true">
    <circle cx="56" cy="56" r="52" fill="var(--color-primary-bg)" opacity="0.6" />
    <ellipse cx="56" cy="86" rx="30" ry="6" fill="var(--color-terracotta-bg)" />
    <rect x="53" y="38" width="6" height="16" rx="3" fill="var(--color-sage)" />
    <path
      d="M56 40 C40 38 34 24 40 12 C56 16 60 28 56 40Z"
      fill="var(--color-sage)"
    />
    <path
      d="M56 40 C72 38 78 24 72 12 C56 16 52 28 56 40Z"
      fill="var(--color-sage)"
      opacity="0.85"
    />
    <rect x="30" y="52" width="52" height="38" rx="10" fill="var(--color-terracotta)" />
    <path
      d="M82 60h6a9 9 0 0 1 0 18h-6"
      fill="none"
      stroke="var(--color-terracotta)"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <circle cx="22" cy="30" r="3" fill="var(--color-sage)" opacity="0.7" />
    <circle cx="90" cy="34" r="2.5" fill="var(--color-primary)" opacity="0.6" />
  </svg>
);

export default GrowthIllustration;
