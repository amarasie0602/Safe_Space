export const CATEGORIES = [
  { value: 'mental_health', label: 'Mental Health', icon: 'leaf', tone: 'mocha' },
  { value: 'relationships', label: 'Relationships', icon: 'users', tone: 'sage' },
  { value: 'family', label: 'Family', icon: 'home', tone: 'sand' },
  { value: 'financial', label: 'Financial Stress', icon: 'coin', tone: 'clay' },
  { value: 'work_burnout', label: 'Work & Burnout', icon: 'briefcase', tone: 'taupe' },
  { value: 'gratitude', label: 'Gratitude & Wins', icon: 'heart', tone: 'bloom' },
];

export const getCategoryMeta = (value) =>
  CATEGORIES.find((c) => c.value === value) || { value, label: value, icon: 'leaf', tone: 'mocha' };
