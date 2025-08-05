import React, { useState } from 'react';
import { trpc } from '../utils/trpc';
import CardHeader from '../components/globals/CardHeader';
import { Card, CardBody } from '../components/globals/Card';
import Button from '../components/globals/Button';
import TagList from '../components/globals/TagList';
import ButtonGrid from '../components/tenant_profile_form/ButtonGrid';

interface TenantProfileFormProps {
  propertyId: string;
  onProfileCreated: (profile: any) => void;
}

const TenantProfileForm: React.FC<TenantProfileFormProps> = ({ 
  propertyId, 
  onProfileCreated 
}) => {
  const [ageRange, setAgeRange] = useState('');
  const [incomeRange, setIncomeRange] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [newPreference, setNewPreference] = useState('');
  const [loading, setLoading] = useState(false);

  const createProfile = trpc.tenant.generateProfile.useMutation({
    onSuccess: (data) => {
      onProfileCreated(data);
    },
    onError: (error) => {
      alert('Error creating tenant profile: ' + error.message);
      throw(error)
    },
  });

  const addPreference = () => {
    if (newPreference.trim() && !preferences.includes(newPreference.trim())) {
      setPreferences([...preferences, newPreference.trim()]);
      setNewPreference('');
    }
  };

  const removePreference = (index: number) => {
    setPreferences(preferences.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ageRange || !incomeRange) {
      alert('Please select both age range and income range');
      return;
    }

    setLoading(true);
    try {
      await createProfile.mutateAsync({
        propertyId,
        ageRange,
        incomeRange,
        lifestyle: lifestyle || undefined,
        preferences: preferences.length > 0 ? preferences : undefined,
      });
    } catch (error) {
      throw(error)
    } finally {
      setLoading(false);
    }
  };

  const ageRanges = [
    '18-25',
    '25-35',
    '35-45',
    '45-55',
    '55+'
  ];

  const incomeRanges = [
    '$30,000-$50,000',
    '$50,000-$75,000',
    '$75,000-$100,000',
    '$100,000+'
  ];

  const lifestyleOptions = [
    'Young Professional',
    'Student',
    'Family',
    'Retiree',
    'Professional',
    'Entrepreneur'
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">

        <Card>
          <CardHeader icon="👥" title="Tenant Demographics" />   
          <CardBody className="space-y-6">
            <ButtonGrid
              label="Age Range"
              options={ageRanges}
              selectedValue={ageRange}
              onSelect={setAgeRange}
              required={true}
              columns={{ base: 2, sm: 3, lg: 5 }}
            />

            <ButtonGrid
              label="Income Range"
              options={incomeRanges}
              selectedValue={incomeRange}
              onSelect={setIncomeRange}
              required={true}
              columns={{ base: 1, sm: 2, lg: 4 }}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon="🎯" title="Lifestyle & Preferences" />   
          <CardBody className="space-y-6">
            <ButtonGrid
              label="Lifestyle Category"
              options={lifestyleOptions}
              selectedValue={lifestyle}
              onSelect={setLifestyle}
              columns={{ base: 1, sm: 2, lg: 3 }}
            />

            <div className="form-group">
              <label className="form-label">Custom Preferences</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  placeholder="Add tenant preference (gym, parking, etc.)"
                  className="input-field"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
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

        {(ageRange || incomeRange || lifestyle) && (
          <Card>
            <CardHeader icon="📋" title="Profile Summary" />   
            <CardBody>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                {ageRange && (
                  <div><strong>Age Range:</strong> {ageRange} years old</div>
                )}
                {incomeRange && (
                  <div><strong>Income:</strong> {incomeRange} annually</div>
                )}
                {lifestyle && (
                  <div><strong>Lifestyle:</strong> {lifestyle}</div>
                )}
                {preferences.length > 0 && (
                  <div><strong>Preferences:</strong> {preferences.join(', ')}</div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        <div className="text-center space-y-4">
          <Button
            type="submit"
            disabled={!ageRange || !incomeRange}
            loading={loading || createProfile.isLoading}
            variant="primary"
            size="lg"
            icon={ageRange && incomeRange ? "🎯" : "📋"}
            className="text-lg px-8 py-4"
          >
            {ageRange && incomeRange ? "Generate Tenant Profile" : "Select Demographics First"}
          </Button>
          
          {(!ageRange || !incomeRange) && (
            <p className="text-sm text-gray-500">
              Please select both age range and income range to continue
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default TenantProfileForm;