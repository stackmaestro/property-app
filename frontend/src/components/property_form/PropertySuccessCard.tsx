import React from 'react';
import CardHeader from '../globals/CardHeader';
import { Card, CardBody } from '../globals/Card';
import Button from '../globals/Button';
import InteractiveMap from '../../pages/InteractiveMap';

interface PropertySuccessCardProps {
  selectedLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  units: number;
  preferences: string[];
  onStartOver: () => void;
}

const PropertySuccessCard: React.FC<PropertySuccessCardProps> = ({
  selectedLocation,
  units,
  preferences,
  onStartOver
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader icon="🎉" title="Property Created Successfully!" />
        <CardBody className="space-y-4">
          <div className="alert-success">
            <div className="space-y-2">
              <div>
                <strong>Property Location:</strong> {selectedLocation.address}
              </div>
              <div>
                <strong>Units:</strong> {units}
              </div>
              {preferences.length > 0 && (
                <div>
                  <strong>Features:</strong> {preferences.join(", ")}
                </div>
              )}
              <div>
                <strong>Coordinates:</strong>{" "}
                {selectedLocation.lat.toFixed(6)},{" "}
                {selectedLocation.lng.toFixed(6)}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Property Satellite View
            </h3>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <InteractiveMap
                initialLocation={selectedLocation.address}
                onLocationSelect={() => {}}
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={onStartOver}
              variant="secondary"
              icon="🏗️"
            >
              Create Another Property
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PropertySuccessCard;