import Icon from './Icon';

export const MOODS = [
  {
    label: 'Calm',
    icon: 'leaf',
    category: 'mental_health',
    content: 'Feeling settled today, just wanted to check in with this community.',
  },
  {
    label: 'Anxious',
    icon: 'wave',
    category: 'mental_health',
    content: "I've been feeling really anxious lately and could use some support.",
  },
  {
    label: 'Overwhelmed',
    icon: 'cloud',
    category: 'work_burnout',
    content: "Everything feels like too much right now and I don't know where to start.",
  },
  {
    label: 'Need Advice',
    icon: 'message',
    category: 'relationships',
    content: 'I could really use some advice on what to do next.',
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
        <Icon name={mood.icon} size={14} /> {mood.label}
      </button>
    ))}
  </div>
);

export default MoodQuickOptions;
