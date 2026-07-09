// Short, original lines — not attributed to any real person, so nothing
// here is a misquote. Rotates once per day so it feels present without
// needing a backend.
export const AFFIRMATIONS = [
  "You don't have to have today figured out to be doing okay.",
  'Whatever pace you\'re moving at right now is still moving.',
  "Struggling with something doesn't mean you're failing at it.",
  'Small and steady still counts as progress.',
  "You're allowed to take up space here, exactly as you are today.",
  'One hard day does not undo all the good ones.',
  "Asking for support is a sign of strength, not the absence of it.",
  'Rest is not something you have to earn.',
  "You've made it through every hard day so far. That's worth noticing.",
  'Being gentle with yourself is not the same as giving up.',
  'It is okay to be a work in progress.',
  "You don't owe anyone a version of yourself that isn't struggling.",
  'Healing is rarely a straight line, and that is completely normal.',
  "The fact that it's hard doesn't mean you're doing it wrong.",
  'Someone here understands more of what you\'re feeling than you think.',
];

const dayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const getTodaysAffirmation = () => {
  const index = dayOfYear(new Date()) % AFFIRMATIONS.length;
  return AFFIRMATIONS[index];
};
