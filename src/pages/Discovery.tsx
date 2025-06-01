
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PriorityRanker from '@/components/discovery/PriorityRanker';
import FeatureSelector from '@/components/discovery/FeatureSelector';
import { Button } from '@/components/ui/button';

export interface Priority {
  id: string;
  label: string;
  rank?: number;
}

export interface Feature {
  id: string;
  label: string;
  selected: boolean;
  importance?: number;
}

const Discovery = () => {
  const navigate = useNavigate();
  const [priorities, setPriorities] = useState<Priority[]>([
    { id: 'price', label: 'Price' },
    { id: 'location', label: 'Location' },
    { id: 'layout', label: 'Layout / Size' },
    { id: 'moveInDate', label: 'Move-in Date' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'petPolicy', label: 'Pet Policy' },
    { id: 'quietness', label: 'Quietness / Soundproofing' },
    { id: 'transit', label: 'Proximity to Transit' },
    { id: 'leaseTerms', label: 'Flexibility of Lease Terms' }
  ]);

  const [features, setFeatures] = useState<Feature[]>([
    { id: 'washerDryer', label: 'In-unit washer/dryer', selected: false },
    { id: 'outdoorSpace', label: 'Outdoor space / balcony', selected: false },
    { id: 'gym', label: 'Gym or fitness center', selected: false },
    { id: 'modernAppliances', label: 'Modern appliances', selected: false },
    { id: 'naturalLight', label: 'Natural light', selected: false },
    { id: 'storage', label: 'Storage', selected: false },
    { id: 'smartHome', label: 'Smart home features', selected: false },
    { id: 'coLiving', label: 'Co-living setup or private unit', selected: false },
    { id: 'parking', label: 'Parking', selected: false },
    { id: 'doorman', label: 'Doorman / Package Room', selected: false },
    { id: 'furnished', label: 'Furnished option', selected: false },
    { id: 'walkInCloset', label: 'Walk-in closet', selected: false },
    { id: 'elevator', label: 'Elevator', selected: false }
  ]);

  const handleStartMatching = () => {
    // Store preferences in localStorage for now
    const preferences = {
      priorities: priorities.filter(p => p.rank).sort((a, b) => (a.rank || 0) - (b.rank || 0)),
      features: features.filter(f => f.selected)
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    console.log('Preferences saved:', preferences);
    
    // Navigate to matches page
    navigate('/matches');
  };

  const selectedPrioritiesCount = priorities.filter(p => p.rank).length;
  const selectedFeaturesCount = features.filter(f => f.selected).length;
  const canProceed = selectedPrioritiesCount >= 3 && selectedFeaturesCount > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            This move will be a breeze.
          </h1>
          <p className="text-gray-600 text-center">
            What's most important to you in your next home?
          </p>
          <p className="text-sm text-gray-500 text-center mt-1">
            (Rank your priorities and tell us what you want—Applaud will take it from there.)
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-8">
        {/* Priority Ranker */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Choose your top 3 priorities and drag to rank:
          </h2>
          <PriorityRanker 
            priorities={priorities} 
            onPrioritiesChange={setPriorities}
          />
          <p className="text-sm text-gray-500 mt-2">
            Selected: {selectedPrioritiesCount}/3
          </p>
        </div>

        {/* Feature Selector */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            What do you want in your next space? (Select all that apply)
          </h2>
          <FeatureSelector 
            features={features} 
            onFeaturesChange={setFeatures}
          />
          <p className="text-sm text-gray-500 mt-2">
            Selected: {selectedFeaturesCount} features
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Button
            onClick={handleStartMatching}
            disabled={!canProceed}
            className="w-full bg-black text-white py-3 px-6 rounded-xl font-semibold text-base hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Start Matching My Preferences
          </Button>
          {!canProceed && (
            <p className="text-sm text-gray-500 text-center mt-2">
              Please select at least 3 priorities and some features to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discovery;
