import { useState } from 'react';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const toDateString = (year, month, day) => {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

const Calendar = ({ selectedDate, onSelect }) => {
  const initial = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const goPrevMonth = () => {
    const prev = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  };

  const goNextMonth = () => {
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const isPast = (day) => new Date(viewYear, viewMonth, day) < today;
  const isSelected = (day) => selectedDate === toDateString(viewYear, viewMonth, day);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button type="button" className="btn btn-ghost btn-sm" onClick={goPrevMonth} aria-label="Previous month">
          ‹
        </button>
        <span>{monthLabel}</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={goNextMonth} aria-label="Next month">
          ›
        </button>
      </div>
      <div className="calendar-grid" role="grid" aria-label={monthLabel}>
        {DAY_LABELS.map((label) => (
          <div key={label} className="calendar-day-label" role="columnheader">
            {label}
          </div>
        ))}
        {cells.map((day, index) =>
          day === null ? (
            <div key={`empty-${index}`} />
          ) : (
            <button
              key={day}
              type="button"
              role="gridcell"
              className={`calendar-day${isSelected(day) ? ' selected' : ''}`}
              disabled={isPast(day)}
              onClick={() => onSelect(toDateString(viewYear, viewMonth, day))}
            >
              {day}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Calendar;
