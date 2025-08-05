import React, { useState, useEffect, useCallback } from "react";
import SearchInput from "../components/interactive_map/SearchInput";
import SuggestionsList from "../components/interactive_map/SuggestionsList";
import MapLoadingOverlay from "../components/interactive_map/MapLoadingOverlay";
import MapOverlays from "../components/interactive_map/MapOverlays";
import EmptyMapState from "../components/interactive_map/EmptyMapState";
import SatelliteCanvas from "../components/interactive_map/SatelliteCanvas";

interface InteractiveMapProps {
  initialLocation?: string;
  onLocationSelect: (locationName: string, lat: number, lng: number) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  initialLocation = "",
  onLocationSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

  const { canvasRef, drawSatelliteMap } = SatelliteCanvas({ 
    onMapLoading: setMapLoading 
  });

  const searchLocations = useCallback(
    async (query: string) => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&addressdetails=1`
        );
        const data = await response.json();
        setSuggestions(data || []);

        if (
          initialLocation &&
          data.length > 0 &&
          !selectedLocation &&
          !initialized
        ) {
          const firstResult = data[0];
          handleLocationClick(firstResult);
          setInitialized(true);
        }
      } catch (error) {
        setSuggestions([]);
        throw error;
      } finally {
        setIsSearching(false);
      }
    },
    [initialLocation, selectedLocation, initialized]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  const handleLocationClick = useCallback(
    async (location: any) => {
      setSelectedLocation(location);
      setSearchTerm(location.display_name);
      setSuggestions([]);

      const lat = parseFloat(location.lat);
      const lng = parseFloat(location.lon);

      onLocationSelect(location.display_name, lat, lng);

      await drawSatelliteMap(lat, lng);
    },
    [onLocationSelect, drawSatelliteMap]
  );

  useEffect(() => {
    if (selectedLocation) {
      const lat = parseFloat(selectedLocation.lat);
      const lng = parseFloat(selectedLocation.lon);
      drawSatelliteMap(lat, lng);
    }
  }, [selectedLocation, drawSatelliteMap]);

  useEffect(() => {
    if (initialLocation && !initialized) {
      setSearchTerm(initialLocation);
      searchLocations(initialLocation);
    }
  }, [initialLocation, initialized, searchLocations]);

  useEffect(() => {
    if (initialLocation) {
      setInitialized(false);
      setSelectedLocation(null);
      setSearchTerm("");
    }
  }, [initialLocation]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchInput
          searchTerm={searchTerm}
          onInputChange={handleInputChange}
          isSearching={isSearching}
        />
        
        <SuggestionsList
          suggestions={suggestions}
          onLocationClick={handleLocationClick}
          isVisible={suggestions.length > 0}
        />
      </div>

      <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
        {selectedLocation ? (
          <>
            <MapLoadingOverlay
              isLoading={mapLoading}
              locationName={selectedLocation.display_name}
            />

            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover"
              style={{ imageRendering: "crisp-edges" }}
            />

            <MapOverlays
              locationName={selectedLocation.display_name}
              latitude={parseFloat(selectedLocation.lat)}
              longitude={parseFloat(selectedLocation.lon)}
            />
          </>
        ) : (
          <EmptyMapState initialLocation={initialLocation} />
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
