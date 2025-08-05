import React from 'react';
import LoadingSpinner from '../globals/LoadingSpinner';

interface SearchInputProps {
  searchTerm: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSearching: boolean;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  onInputChange,
  isSearching,
  placeholder = "Search for an address (e.g: Maple Street, Robins, Linn County, Iowa, United States)"
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={onInputChange}
        placeholder={placeholder}
        className="input-field pr-10"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        {isSearching ? (
          <LoadingSpinner size="sm" color="text-gray-400" />
        ) : (
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default SearchInput;