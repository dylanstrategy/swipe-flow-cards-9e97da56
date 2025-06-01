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
      { id: 'price', label: 'Affordable rent within budget' },
      { id: 'location', label: 'Safe neighborhood' },
      { id: 'layout', label: 'Spacious layout and storage' },
      { id: 'moveInDate', label: 'Available move-in date' },
      { id: 'amenities', label: 'Modern amenities (gym, laundry, etc.)' },
      { id: 'transit', label: 'Close to public transportation' },
      { id: 'quietness', label: 'Quiet environment' },
      { id: 'petPolicy', label: 'Pet-friendly policy' },
      { id: 'parking', label: 'Parking availability' },
      { id: 'naturalLight', label: 'Natural light and views' },
      { id: 'maintenance', label: 'Responsive maintenance' },
      { id: 'leaseTerms', label: 'Flexible lease terms' }
    ],
    lifestyleTags: [],
    features: [
      // New simplified priority structure
      { id: 'naturalLightQuiet', label: 'Natural Light & Quiet', selected: false },
      { id: 'modernFunctional', label: 'Modern & Functional Unit', selected: false },
      { id: 'reliableWifiTech', label: 'Reliable Wi-Fi & Tech', selected: false },
      { id: 'walkabilityTransit', label: 'Walkability & Transit Access', selected: false },
      { id: 'amenitiesLife', label: 'Amenities that Fit My Life', selected: false },
      { id: 'safetySecurity', label: 'Safety & Security', selected: false },
      { id: 'cleanlinessMainten', label: 'Cleanliness & Maintenance', selected: false },
      { id: 'petFriendlyLiving', label: 'Pet-Friendly Living', selected: false },
      { id: 'communityVibe', label: 'Community Vibe', selected: false },
      { id: 'affordabilityValue', label: 'Affordability & Value', selected: false }
    ]
  });

  const canProceedFromCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return discoveryData.moveInTimeframe !== '' && discoveryData.location.trim() !== '';
      case 2:
        return discoveryData.priorities.filter(p => p.rank).length >= 5;
      case 3:
        return discoveryData.lifestyleTags.length > 0;
      case 4:
        // Allow proceeding even with 0 features (skip option)
        return true;
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
