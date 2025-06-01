import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, X } from 'lucide-react';
import PriceAndTimeStep from './steps/PriceAndTimeStep';
import PriorityIntroStep from './steps/PriorityIntroStep';
import PrioritiesStep from './steps/PrioritiesStep';
import LifestyleIntroStep from './steps/LifestyleIntroStep';
import LifestyleStep from './steps/LifestyleStep';

interface DiscoveryData {
  priceRange: [number, number];
  moveInTimeframe: string;
  location: string;
  proximityRadius: number;
  priorities: Array<{ id: string; label: string; description: string; rank?: number }>;
  lifestyleTags: string[];
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
      { id: 'naturalLightQuiet', label: 'Natural Light & Quiet', description: 'A calm, well-lit space that\'s peaceful and relaxing.' },
      { id: 'modernFunctional', label: 'Modern & Functional Unit', description: 'Updated appliances, smart layout, and in-unit washer/dryer.' },
      { id: 'reliableWifiTech', label: 'Reliable Wi-Fi & Tech', description: 'Fast internet, smart features, and digital access built in.' },
      { id: 'walkabilityTransit', label: 'Walkability & Transit Access', description: 'Steps from groceries, restaurants, and public transit.' },
      { id: 'amenitiesLife', label: 'Amenities That Fit My Life', description: 'Gym, rooftop, coworking, pet perks — the extras that matter.' },
      { id: 'securityServices', label: 'Security & Services', description: 'Controlled entry, concierge, package room, well-lit access.' },
      { id: 'cleanMaintained', label: 'Clean & Well-Maintained', description: 'Fast response to issues and clean common spaces.' },
      { id: 'petFriendly', label: 'Pet-Friendly Living', description: 'A place where pets feel just as welcome as people.' },
      { id: 'communityVibe', label: 'Community Vibe', description: 'Friendly neighbors, shared spaces, or resident events.' },
      { id: 'parkingConvenience', label: 'Parking & Convenience', description: 'Easy access to on-site or nearby parking (including EV options).' },
      { id: 'affordabilityValue', label: 'Affordability & Value', description: 'Feels worth it — transparent pricing and quality for the cost.' }
    ],
    lifestyleTags: []
  });

  const canProceedFromCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return discoveryData.moveInTimeframe !== '' && discoveryData.location.trim() !== '';
      case 2:
        return true; // Priority intro step - always can proceed
      case 3:
        return discoveryData.priorities.filter(p => p.rank).length >= 5;
      case 4:
        return true; // Lifestyle intro step - always can proceed
      case 5:
        return discoveryData.lifestyleTags.length > 0;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
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

  const handleGoToStep1 = () => {
    setCurrentStep(1);
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
          <PriorityIntroStep
            onContinue={handleNextStep}
          />
        );
      case 3:
        return (
          <PrioritiesStep
            priorities={discoveryData.priorities}
            onUpdate={(priorities) => updateDiscoveryData({ priorities })}
          />
        );
      case 4:
        return (
          <LifestyleIntroStep
            onContinue={handleNextStep}
          />
        );
      case 5:
        return (
          <LifestyleStep
            lifestyleTags={discoveryData.lifestyleTags}
            onUpdate={(lifestyleTags) => updateDiscoveryData({ lifestyleTags })}
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
        return 'Priority Selection';
      case 4:
        return 'What Makes Home';
      case 5:
        return 'Lifestyle Selection';
      default:
        return 'Discovery';
    }
  };

  // For the first step, render without header wrapper
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-white">
        {renderCurrentStep()}
      </div>
    );
  }

  // For subsequent steps, render with header and navigation
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Progress and Navigation */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevStep}
              className="p-2"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoToStep1}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Start Over
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2"
          >
            <X size={20} />
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{getStepTitle()}</span>
            <span>Step {currentStep} of 5</span>
          </div>
          <Progress value={(currentStep / 5) * 100} className="h-2" />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-auto">
        {renderCurrentStep()}
      </div>

      {/* Continue Button for steps 2-5 */}
      <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200">
        <Button
          onClick={handleNextStep}
          disabled={!canProceedFromCurrentStep()}
          className="w-full py-3"
          size="lg"
        >
          {currentStep === 5 ? 'Find Home' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default SwipeableDiscoveryFlow;
