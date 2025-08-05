import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import InteractiveMap from "./InteractiveMap";
import CardHeader from "../components/globals/CardHeader";
import { Card, CardBody } from "../components/globals/Card";
import Button from "../components/globals/Button";
import TagList from "../components/globals/TagList";
import PropertySuccessCard from "../components/property_form/PropertySuccessCard";

interface PropertyFormProps {
  onPropertyCreated: (property: any) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onPropertyCreated }) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [units, setUnits] = useState(1);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [newPreference, setNewPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [propertyCreated, setPropertyCreated] = useState(false);

  const createProperty = trpc.property.create.useMutation({
    onSuccess: (data) => {
      setPropertyCreated(true);
      onPropertyCreated(data);
    },
    onError: (error) => {
      alert("Error creating property: " + error.message);
      throw error;
    },
  });

  const handleLocationSelect = (
    locationName: string,
    lat: number,
    lng: number
  ) => {
    setSelectedLocation({
      address: locationName,
      lat,
      lng,
    });
  };

  const addPreference = () => {
    if (newPreference.trim() && !preferences.includes(newPreference.trim())) {
      setPreferences([...preferences, newPreference.trim()]);
      setNewPreference("");
    }
  };

  const removePreference = (index: number) => {
    setPreferences(preferences.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert("Please select a location from the search suggestions");
      return;
    }

    setLoading(true);
    try {
      await createProperty.mutateAsync({
        location: selectedLocation.address,
        units,
        preferences:
          preferences.length > 0 ? preferences.join(", ") : undefined,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setSelectedLocation(null);
    setUnits(1);
    setPreferences([]);
    setNewPreference("");
    setPropertyCreated(false);
  };

  if (propertyCreated && selectedLocation) {
    return (
      <PropertySuccessCard
        selectedLocation={selectedLocation}
        units={units}
        preferences={preferences}
        onStartOver={handleStartOver}
      />
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader icon="📍" title="Property Location" />
          <CardBody>
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 mb-4">
              <p className="text-primary-800 text-sm font-medium mb-3">
                🔍 Search and select your property location:
              </p>
              <InteractiveMap
                initialLocation=""
                onLocationSelect={handleLocationSelect}
              />
            </div>

            {selectedLocation ? (
              <div className="alert-success">
                <div className="font-bold mb-2 flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  Location Selected:
                </div>
                <div className="mb-2">
                  📍{" "}
                  {selectedLocation.address.length > 80
                    ? selectedLocation.address.substring(0, 80) + "..."
                    : selectedLocation.address}
                </div>
                <div className="text-sm opacity-80">
                  📍 Coordinates: {selectedLocation.lat.toFixed(6)},{" "}
                  {selectedLocation.lng.toFixed(6)}
                </div>
              </div>
            ) : (
              <div className="alert-warning">
                <span className="mr-2">⚠️</span>
                Please search and select a location from the suggestions above
                to continue
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon="🏠" title="Property Details" />
          <CardBody>
            <div className="form-group">
              <label htmlFor="units" className="form-label">
                Number of Units
              </label>
              <input
                type="number"
                id="units"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                min="1"
                max="1000"
                required
                className="input-field"
                placeholder="Enter number of units"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon="🏷️" title="Property Features & Preferences" />
          <CardBody>
            <div className="form-group">
              <label className="form-label">Add Features</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  placeholder="Enter a preference or feature..."
                  className="input-field"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPreference();
                    }
                  }}
                />
                <Button
                  onClick={addPreference}
                  variant="success"
                  disabled={!newPreference.trim()}
                  className="whitespace-nowrap"
                >
                  Add
                </Button>
              </div>

              <TagList
                tags={preferences}
                onRemoveTag={removePreference}
                label="Added preferences"
              />
            </div>
          </CardBody>
        </Card>

        <div className="text-center space-y-4">
          <Button
            type="submit"
            disabled={!selectedLocation}
            loading={loading || createProperty.isLoading}
            variant="primary"
            size="lg"
            icon={selectedLocation ? "🏢" : "📍"}
          >
            {selectedLocation ? "Create Property" : "Select Location First"}
          </Button>

          {!selectedLocation && (
            <p className="text-sm text-gray-500">
              Search for an address above to enable the Create Property button
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
