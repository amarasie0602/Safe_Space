const TimeSlotPicker = ({ slots, selectedTime, onSelect }) => {
  if (slots.length === 0) {
    return <p className="empty-state">No open slots on this date. Please pick another day.</p>;
  }

  return (
    <div className="time-slots" role="group" aria-label="Available time slots">
      {slots.map((slot) => (
        <button
          key={slot}
          type="button"
          className={`tab${selectedTime === slot ? ' active' : ''}`}
          onClick={() => onSelect(slot)}
        >
          {slot}
        </button>
      ))}
    </div>
  );
};

export default TimeSlotPicker;
