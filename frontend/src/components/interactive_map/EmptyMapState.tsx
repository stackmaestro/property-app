import React from 'react';

interface EmptyMapStateProps {
  initialLocation?: string;
}

const EmptyMapState: React.FC<EmptyMapStateProps> = ({ initialLocation }) => {
  return (
    <div className="flex items-center justify-center h-full text-center p-6">
      <div>
        <div className="text-4xl sm:text-5xl mb-4">🗺️</div>
        <div className="text-base sm:text-lg font-medium mb-2 text-gray-700">
          {initialLocation ? "Loading location..." : "Search for a location"}
        </div>
        <div className="text-sm text-gray-500 max-w-xs">
          {initialLocation
            ? `Finding: ${initialLocation}`
            : "Type an address above and select from suggestions to view satellite imagery"}
        </div>
      </div>
    </div>
  );
};

export default EmptyMapState;