import React from 'react';
import LoadingSpinner from '../globals/LoadingSpinner';

interface MapLoadingOverlayProps {
  isLoading: boolean;
  locationName: string;
}

const MapLoadingOverlay: React.FC<MapLoadingOverlayProps> = ({
  isLoading,
  locationName
}) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
      <div className="text-center">
        <LoadingSpinner
          size="lg"
          color="text-blue-600"
          className="mx-auto mb-2"
        />
        <p className="text-sm text-gray-600">
          Loading satellite imagery...
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {locationName.length > 50
            ? locationName.substring(0, 50) + "..."
            : locationName}
        </p>
      </div>
    </div>
  );
};

export default MapLoadingOverlay;