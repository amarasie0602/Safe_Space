import { useState } from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Search...', suggestions = [] }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="search-bar">
      <span aria-hidden="true">🔍</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {focused && value && suggestions.length > 0 && (
        <ul className="search-suggestions" role="listbox">
          {suggestions.slice(0, 5).map((suggestion) => (
            <li key={suggestion} role="option" aria-selected="false">
              <button type="button" onMouseDown={() => onChange(suggestion)}>
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
