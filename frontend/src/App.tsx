import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import StepIndicator from './components/app/StepIndicator';
import PropertyForm from '../src/pages/PropertyForm';
import TenantProfileForm from './pages/TenantProfileForm';
import AmenitySuggestions from './pages/AmenitySuggestions';

type AppStep = 'property' | 'tenant' | 'amenities';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('property');
  const [createdProperty, setCreatedProperty] = useState<any>(null);
  const [createdTenantProfile, setCreatedTenantProfile] = useState<any>(null);

  const handlePropertyCreated = (property: any) => {
    setCreatedProperty(property);
    setCurrentStep('tenant');
  };

  const handleTenantProfileCreated = (profile: any) => {
    setCreatedTenantProfile(profile);
    setCurrentStep('amenities');
  };

  const handleStartOver = () => {
    setCurrentStep('property');
    setCreatedProperty(null);
    setCreatedTenantProfile(null);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'property':
        return 'Create Your Property';
      case 'tenant':
        return 'Define Your Ideal Tenant';
      case 'amenities':
        return 'Discover Perfect Amenities';
      default:
        return 'Multifamily Property Management';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 'property':
        return 'Start by adding your property location, units, and key features';
      case 'tenant':
        return 'Help us understand your target tenant demographics and preferences';
      case 'amenities':
        return 'Get personalized amenity suggestions based on your tenant profile';
      default:
        return '';
    }
  };

  const steps = [
    { id: 'property', label: 'Property', number: 1 },
    { id: 'tenant', label: 'Tenant', number: 2 },
    { id: 'amenities', label: 'Amenities', number: 3 }
  ];

  const completedSteps = [];
  if (createdProperty) completedSteps.push('property');
  if (createdTenantProfile) completedSteps.push('tenant');

  return (
    <Layout title={getStepTitle()} subtitle={getStepSubtitle()}>
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      <div className="max-w-4xl mx-auto">
        {currentStep === 'property' && (
          <div className="animate-slide-up">
            <PropertyForm onPropertyCreated={handlePropertyCreated} />
          </div>
        )}

        {currentStep === 'tenant' && createdProperty && (
          <div className="animate-slide-up">
            <TenantProfileForm 
              propertyId={createdProperty.id}
              onProfileCreated={handleTenantProfileCreated}
            />
          </div>
        )}

        {currentStep === 'amenities' && createdTenantProfile && (
          <div className="animate-slide-up">
            <AmenitySuggestions 
              tenantProfile={createdTenantProfile}
              onStartOver={handleStartOver}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;