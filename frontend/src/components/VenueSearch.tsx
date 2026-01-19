import { useState } from 'react';
import './VenueSearch.css';

interface VenueSearchProps {
  onSearch: (type: string) => void;
}

const VENUE_TYPES = [
  { value: 'cafe', label: '☕ Cafe' },
  { value: 'restaurant', label: '🍽️ Restaurant' },
  { value: 'bar', label: '🍺 Bar/Pub' },
  { value: 'park', label: '🌳 Park' },
  { value: 'library', label: '📚 Library' },
];

function VenueSearch({ onSearch }: VenueSearchProps) {
  const [selectedType, setSelectedType] = useState('cafe');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      await onSearch(selectedType);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="venue-search">
      <h3>Find Venues</h3>
      <div className="venue-search-controls">
        <div className="form-group">
          <label htmlFor="venueType">Venue Type</label>
          <select
            id="venueType"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            disabled={isSearching}
          >
            {VENUE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="primary"
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search Venues'}
        </button>
      </div>
      <p className="venue-hint">
        Venues will appear as green markers on the map
      </p>
    </div>
  );
}

export default VenueSearch;
