export const MOODS = [
  {
    label: 'I feel anxious',
    category: 'mental_health',
    content: "I've been feeling really anxious lately and could use some support.",
  },
  {
    label: 'I need advice',
    category: 'academic',
    content: 'I could really use some advice on what to do next.',
  },
  {
    label: 'Just need to vent',
    category: 'family',
    content: 'I just need to get this off my chest.',
  },
  {
    label: 'Feeling lonely',
    category: 'relationships',
    content: "I've been feeling pretty lonely lately and wanted to share.",
  },
];

const MoodQuickOptions = ({ onSelect }) => (
  <div className="mood-options">
    {MOODS.map((mood) => (
      <button
        key={mood.label}
        type="button"
        className="mood-chip"
        onClick={() => onSelect(mood)}
      >
        {mood.label}
      </button>
    ))}
  </div>
);

export default MoodQuickOptions;
