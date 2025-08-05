import React from 'react';

interface AmenityCardProps {
  amenity: {
    id: string;
    name: string;
    description: string;
    category: string;
    estimatedCost: number;
    targetDemographics?: string[];
  };
}

const AmenityCard: React.FC<AmenityCardProps> = ({ amenity }) => {
  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(cost);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      fitness: 'bg-green-100 text-green-800 border-green-200',
      social: 'bg-purple-100 text-purple-800 border-purple-200',
      work: 'bg-blue-100 text-blue-800 border-blue-200',
      family: 'bg-pink-100 text-pink-800 border-pink-200',
      pets: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      luxury: 'bg-amber-100 text-amber-800 border-amber-200',
      convenience: 'bg-gray-100 text-gray-800 border-gray-200',
      security: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900">{amenity.name}</h4>
        <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(amenity.category)}`}>
          {amenity.category}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">{amenity.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold text-primary-600">
          {formatCost(amenity.estimatedCost)}
        </div>
        <div className="text-xs text-gray-500">
          Estimated Cost
        </div>
      </div>
      
      {amenity.targetDemographics && amenity.targetDemographics.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Target Demographics:</div>
          <div className="flex flex-wrap gap-1">
            {amenity.targetDemographics.slice(0, 3).map((demo: string, index: number) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {demo}
              </span>
            ))}
            {amenity.targetDemographics.length > 3 && (
              <span className="text-xs text-gray-400">+{amenity.targetDemographics.length - 3} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AmenityCard;