const PATHS = {
  heart: <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z" />,
  message: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M8 16l-3 4v-4" />
    </>
  ),
  bookmark: <path d="M6 3h12v18l-6-4-6 4V3z" />,
  search: (
    <>
      <circle cx="10" cy="10" r="6" />
      <line x1="15" y1="15" x2="20" y2="20" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="7" y2="7" />
      <line x1="17" y1="17" x2="19.1" y2="19.1" />
      <line x1="4.9" y1="19.1" x2="7" y2="17" />
      <line x1="17" y1="7" x2="19.1" y2="4.9" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 119.5 4 7 7 0 0020 14.5z" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  leaf: (
    <>
      <path d="M12 3C7 3 4 8 4 13c0 4 3 7 8 7s8-3 8-7c0-5-3-10-8-10z" />
      <line x1="12" y1="6" x2="12" y2="20" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16.5" cy="9" r="2.3" />
      <path d="M4 20c0-3 2.5-5 5-5s5 2 5 5" />
      <path d="M14.5 20c0-2.5 1.8-4.3 4-4.3s3.9 1.4 3.9 4.3" />
    </>
  ),
  home: (
    <>
      <path d="M4 11L12 4l8 7" />
      <path d="M6 10v9h12v-9" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
      <line x1="3" y1="13" x2="21" y2="13" />
    </>
  ),
  cloud: <path d="M6.5 19a4.5 4.5 0 010-9 5.5 5.5 0 0110.6-1.7A4 4 0 0118 19H6.5z" />,
  wave: <polyline points="3,12 6,7 9,17 12,7 15,17 18,7 21,12" />,
  headphones: (
    <>
      <path d="M4 14v-2a8 8 0 0116 0v2" />
      <rect x="2" y="14" width="5" height="7" rx="1.5" />
      <rect x="17" y="14" width="5" height="7" rx="1.5" />
    </>
  ),
  'chevron-down': <polyline points="6,9 12,15 18,9" />,
  'chevron-up': <polyline points="6,15 12,9 18,15" />,
  bell: (
    <>
      <path d="M6 9a6 6 0 0112 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9z" />
      <path d="M10 19a2 2 0 004 0" />
    </>
  ),
  star: <path d="M12 3l2.6 5.6 6 .7-4.4 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.2 6-.7L12 3z" />,
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
  menu: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </>
  ),
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
};

const Icon = ({ name, size = 18, className = '' }) => (
  <svg
    className={`icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {PATHS[name] || null}
  </svg>
);

export default Icon;
