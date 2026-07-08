// Generic time slots — the backend has no concept of counselor-specific
// availability yet, so every slot is shown as open. A real system would
// filter these against the counselor's schedule and existing bookings.
const SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

const TimeSlotPicker = ({ selectedTime, onSelect }) => (
  <div className="time-slots" role="group" aria-label="Available time slots">
    {SLOTS.map((slot) => (
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

export default TimeSlotPicker;
