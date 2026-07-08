export const CATEGORIES = [
  { value: 'mental_health', label: 'Mental Health', icon: '🧠', tone: 'lavender' },
  { value: 'family', label: 'Family', icon: '👪', tone: 'blue' },
  { value: 'financial', label: 'Financial', icon: '💰', tone: 'gold' },
  { value: 'academic', label: 'Academic', icon: '📚', tone: 'mint' },
  { value: 'relationships', label: 'Relationships', icon: '💞', tone: 'pink' },
  { value: 'addiction', label: 'Recovery', icon: '🌱', tone: 'green' },
];

export const getCategoryMeta = (value) =>
  CATEGORIES.find((c) => c.value === value) || { value, label: value, icon: '💬', tone: 'lavender' };
