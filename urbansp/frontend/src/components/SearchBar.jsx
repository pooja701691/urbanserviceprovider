import { useState, useEffect, useRef } from 'react';

function SearchBar({ placeholder, onSearch, debounceMs = 400 }) {
  const [value, setValue] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
    return () => clearTimeout(timerRef.current);
  }, [value, debounceMs, onSearch]);

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="button" onClick={() => onSearch(value)}>Search</button>
    </div>
  );
}

export default SearchBar;
