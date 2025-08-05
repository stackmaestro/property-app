import React from 'react';

interface MapOverlaysProps {
  locationName: string;
  latitude: number;
  longitude: number;
}

const MapOverlays: React.FC<MapOverlaysProps> = ({
  locationName,
  latitude,
  longitude
}) => {
  return (
    <>
      <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white px-3 py-1 rounded text-xs font-bold">
        🛰️ HD Satellite
      </div>

      <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-80 text-white px-3 py-2 rounded text-xs">
        <div className="font-bold mb-1">
          📍{" "}
          {locationName.length > 60
            ? locationName.substring(0, 60) + "..."
            : locationName}
        </div>
        <div className="opacity-80">
          Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>
      </div>
    </>
  );
};

export default MapOverlays;