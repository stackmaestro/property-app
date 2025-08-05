import React from 'react';

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
  onLocationClick: (suggestion: Suggestion) => void;
  isVisible: boolean;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestions,
  onLocationClick,
  isVisible
}) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onLocationClick(suggestion)}
          className="w-full text-left px-4 py-3 bg-white hover:bg-blue-50 text-gray-900 hover:text-blue-900 border-b border-gray-100 last:border-b-0 transition-colors duration-150 focus:outline-none focus:bg-blue-50 focus:text-blue-900"
        >
          <div className="font-medium truncate">
            📍 {suggestion.display_name}
          </div>
          <div className="text-sm text-gray-500 hover:text-blue-600">
            Lat: {parseFloat(suggestion.lat).toFixed(4)}, Lng:{" "}
            {parseFloat(suggestion.lon).toFixed(4)}
          </div>
        </button>
      ))}
    </div>
  );
};

export default SuggestionsList;