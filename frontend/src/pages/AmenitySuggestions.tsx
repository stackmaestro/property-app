import React, { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import CardHeader from '../components/globals/CardHeader';
import { Card, CardBody } from '../components/globals/Card';
import Button from '../components/globals/Button';
import LoadingSpinner from '../components/globals/LoadingSpinner';
import AmenityCard from '../components/amenities/AmenityCard';
import Loading from '../components/amenities/Loading';
import ErrorCard from '../components/amenities/ErrorCard';

interface AmenitySuggestionsProps {
  tenantProfile: any;
  onStartOver: () => void;
}

const AmenitySuggestions: React.FC<AmenitySuggestionsProps> = ({ 
  tenantProfile, 
  onStartOver 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'cost' | 'category' | 'relevance'>('relevance');

  const { data: amenities, isLoading, error } = trpc.amenity.getSuggestions.useQuery({
    tenantProfileId: selectedCategory === 'all' ? undefined : tenantProfile.id,
    ageRange: selectedCategory === 'all' ? undefined : tenantProfile.ageRange,
    lifestyle: selectedCategory === 'all' ? undefined : tenantProfile.lifestyle,
    incomeRange: selectedCategory === 'all' ? undefined : tenantProfile.incomeRange,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  const { data: categories } = trpc.amenity.getCategories.useQuery();

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      fitness: '💪',
      social: '🎉',
      work: '💼',
      family: '👨‍👩‍👧‍👦',
      pets: '🐕',
      luxury: '✨',
      convenience: '🛎️',
      security: '🔒'
    };
    return icons[category] || '🏗️';
  };


  const sortedAmenities = amenities ? [...amenities].sort((a, b) => {
    switch (sortBy) {
      case 'cost':
        return a.estimatedCost - b.estimatedCost;
      case 'category':
        return a.category.localeCompare(b.category);
      case 'relevance':
      default:
        return 0;
    }
  }) : [];

  const groupedAmenities = sortedAmenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as { [key: string]: any[] });

  if (isLoading) {
    <Loading/>
  }

  if (error) {
    return (
      <ErrorCard 
        error={error}
        onStartOver={onStartOver}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader icon="👤" title="Target Tenant Profile" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Age Range</div>
              <div className="font-semibold text-gray-900">{tenantProfile.ageRange}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Income Range</div>
              <div className="font-semibold text-gray-900">{tenantProfile.incomeRange}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Lifestyle</div>
              <div className="font-semibold text-gray-900">{tenantProfile.lifestyle || 'Not specified'}</div>
            </div>
          </div>
          
          {tenantProfile.idealTenant && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="text-sm font-medium text-primary-800 mb-1">AI Generated Profile:</div>
              <div className="text-primary-700">{tenantProfile.idealTenant}</div>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories?.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="cost">Cost (Low to High)</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {Object.keys(groupedAmenities).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedAmenities).map(([category, categoryAmenities]) => (
            <Card key={category}>
              <CardHeader 
                icon={getCategoryIcon(category)} 
                title={category.charAt(0).toUpperCase() + category.slice(1) + ' Amenities'} 
                length={categoryAmenities.length} 
              />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryAmenities.map((amenity) => (
                    <AmenityCard key={amenity.id} amenity={amenity} />
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Amenities Found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or check back later for more suggestions.
            </p>
          </CardBody>
        </Card>
      )}

      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onStartOver}
            variant="secondary"
            icon="🔄"
          >
            Start Over
          </Button>
          
          <Button 
            onClick={() => window.print()}
            variant="primary"
            icon="📄"
          >
            Export Report
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">
          Amenity costs are estimates and may vary based on location and specifications
        </p>
      </div>
    </div>
  );
};

export default AmenitySuggestions;