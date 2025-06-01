
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwipeableScreen from '@/components/schedule/SwipeableScreen';
import PriceAndTimeStep from './steps/PriceAndTimeStep';
import PrioritiesStep from './steps/PrioritiesStep';
import LifestyleStep from './steps/LifestyleStep';
import OptionsStep from './steps/OptionsStep';

interface DiscoveryData {
  priceRange: [number, number];
  moveInTimeframe: string;
  location: string;
  proximityRadius: number;
  priorities: Array<{ id: string; label: string; rank?: number }>;
  lifestyleTags: string[];
  features: Array<{ id: string; label: string; selected: boolean; importance?: number }>;
}

const SwipeableDiscoveryFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData>({
    priceRange: [1500, 3500],
    moveInTimeframe: '',
    location: '',
    proximityRadius: 5,
    priorities: [
      { id: 'price', label: 'Price' },
      { id: 'location', label: 'Location' },
      { id: 'layout', label: 'Layout / Size' },
      { id: 'moveInDate', label: 'Move-in Date' },
      { id: 'amenities', label: 'Amenities' },
      { id: 'petPolicy', label: 'Pet Policy' },
      { id: 'quietness', label: 'Quietness / Soundproofing' },
      { id: 'transit', label: 'Proximity to Transit' },
      { id: 'leaseTerms', label: 'Flexibility of Lease Terms' }
    ],
    lifestyleTags: [],
    features: [
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
    ]
  });

  const canProceedFromCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return discoveryData.moveInTimeframe !== '' && discoveryData.location.trim() !== '';
      case 2:
        return discoveryData.priorities.filter(p => p.rank).length >= 3;
      case 3:
        return discoveryData.lifestyleTags.length > 0;
      case 4:
        return discoveryData.features.filter(f => f.selected).length > 0;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - save preferences and navigate to matches
      localStorage.setItem('userPreferences', JSON.stringify(discoveryData));
      console.log('Discovery completed:', discoveryData);
      navigate('/matches');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const updateDiscoveryData = (updates: Partial<DiscoveryData>) => {
    setDiscoveryData(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PriceAndTimeStep
            priceRange={discoveryData.priceRange}
            moveInTimeframe={discoveryData.moveInTimeframe}
            location={discoveryData.location}
            proximityRadius={discoveryData.proximityRadius}
            onUpdate={updateDiscoveryData}
            onContinue={handleNextStep}
            canContinue={canProceedFromCurrentStep()}
          />
        );
      case 2:
        return (
          <PrioritiesStep
            priorities={discoveryData.priorities}
            onUpdate={(priorities) => updateDiscoveryData({ priorities })}
          />
        );
      case 3:
        return (
          <LifestyleStep
            lifestyleTags={discoveryData.lifestyleTags}
            onUpdate={(lifestyleTags) => updateDiscoveryData({ lifestyleTags })}
          />
        );
      case 4:
        return (
          <OptionsStep
            features={discoveryData.features}
            onUpdate={(features) => updateDiscoveryData({ features })}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Getting Started';
      case 2:
        return 'Your Priorities';
      case 3:
        return 'What Makes Home';
      case 4:
        return 'Desired Features';
      default:
        return 'Discovery';
    }
  };

  // For the first step, render without SwipeableScreen wrapper
  if (currentStep === 1) {
    return renderCurrentStep();
  }

  // For subsequent steps, use SwipeableScreen with swipe gestures
  return (
    <SwipeableScreen
      title={getStepTitle()}
      currentStep={currentStep}
      totalSteps={4}
      onClose={handleClose}
      onSwipeUp={canProceedFromCurrentStep() ? handleNextStep : undefined}
      onSwipeLeft={currentStep > 1 ? handlePrevStep : undefined}
      canSwipeUp={canProceedFromCurrentStep()}
    >
      {renderCurrentStep()}
    </SwipeableScreen>
  );
};

export default SwipeableDiscoveryFlow;
