
import React, { useState, useEffect } from 'react';
import { Home, Lightbulb, Wifi, House, Car, Shield, Star, Bell, Users, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Feature {
  id: string;
  label: string;
  selected: boolean;
  importance?: number;
}

interface OptionsStepProps {
  features: Feature[];
  onUpdate: (features: Feature[]) => void;
}

const OptionsStep = ({ features, onUpdate }: OptionsStepProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const priorities = [
    {
      id: 'naturalLightQuiet',
      label: 'Natural Light & Quiet',
      description: 'A calm, well-lit space that feels good to be in.',
      icon: Lightbulb
    },
    {
      id: 'modernFunctional',
      label: 'Modern & Functional Unit',
      description: 'Updated appliances, layout, and in-unit washer/dryer.',
      icon: House
    },
    {
      id: 'reliableWifiTech',
      label: 'Reliable Wi-Fi & Tech',
      description: 'Strong internet, smart home features, or digital access.',
      icon: Wifi
    },
    {
      id: 'walkabilityTransit',
      label: 'Walkability & Transit Access',
      description: 'Easy access to groceries, cafes, public transit.',
      icon: Car
    },
    {
      id: 'amenitiesLife',
      label: 'Amenities that Fit My Life',
      description: 'Gym, coworking, lounge, rooftop, pet areas, etc.',
      icon: Star
    },
    {
      id: 'safetySecurity',
      label: 'Safety & Security',
      description: 'Secure entry, neighborhood safety, peace of mind.',
      icon: Shield
    },
    {
      id: 'cleanlinessMainten',
      label: 'Cleanliness & Maintenance',
      description: 'Well-kept common areas and fast issue resolution.',
      icon: CircleCheck
    },
    {
      id: 'petFriendlyLiving',
      label: 'Pet-Friendly Living',
      description: 'Comfort and support for living with pets.',
      icon: Home
    },
    {
      id: 'communityVibe',
      label: 'Community Vibe',
      description: 'Friendly, respectful neighbors or active social environment.',
      icon: Users
    },
    {
      id: 'affordabilityValue',
      label: 'Affordability & Value',
      description: 'Worth the cost, transparent fees, and financial peace.',
      icon: Bell
    }
  ];

  const selectedPriorities = features.filter(f => f.selected && f.importance).sort((a, b) => (a.importance || 0) - (b.importance || 0));
  const selectedCount = selectedPriorities.length;

  const handlePriorityToggle = (priorityId: string) => {
    const currentFeature = features.find(f => f.id === priorityId);
    
    if (currentFeature?.selected) {
      // Remove from selection
      const updatedFeatures = features.map(f => 
        f.id === priorityId 
          ? { ...f, selected: false, importance: undefined }
          : f
      );
      
      // Reorder remaining priorities
      const remainingSelected = updatedFeatures.filter(f => f.selected && f.importance);
      remainingSelected.sort((a, b) => (a.importance || 0) - (b.importance || 0));
      remainingSelected.forEach((feature, index) => {
        feature.importance = index + 1;
      });
      
      onUpdate(updatedFeatures);
    } else {
      // Add to selection if under 5
      if (selectedCount < 5) {
        const updatedFeatures = features.map(f => 
          f.id === priorityId 
            ? { ...f, selected: true, importance: selectedCount + 1 }
            : f
        );
        onUpdate(updatedFeatures);
      }
    }
  };

  const handleSkip = () => {
    const clearedFeatures = features.map(f => ({ ...f, selected: false, importance: undefined }));
    onUpdate(clearedFeatures);
  };

  const getPriorityRank = (priorityId: string) => {
    const feature = features.find(f => f.id === priorityId);
    return feature?.importance;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm px-6 py-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="text-green-600" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            What are your Top 5?
          </h1>
          <div className={`transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <p className="text-gray-600">
              Select up to 5 priorities that matter most to you
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {priorities.map((priority) => {
            const rank = getPriorityRank(priority.id);
            const isSelected = rank !== undefined;
            const IconComponent = priority.icon;
            
            return (
              <Card
                key={priority.id}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'ring-2 ring-green-500 bg-green-50 border-green-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePriorityToggle(priority.id)}
              >
                {/* Rank Badge */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10">
                    {rank}
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg flex-shrink-0 ${
                      isSelected ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent 
                        size={24} 
                        className={isSelected ? 'text-green-600' : 'text-gray-600'} 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-lg mb-1 ${
                        isSelected ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {priority.label}
                      </h3>
                      <p className={`text-sm ${
                        isSelected ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {priority.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Selected Priorities
            </span>
            <span className="text-sm text-gray-500">
              {selectedCount}/5
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(selectedCount / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          {selectedCount > 0 && (
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 font-medium">
                Great! You've selected {selectedCount} priorit{selectedCount === 1 ? 'y' : 'ies'}.
              </p>
              <p className="text-sm text-green-600 mt-1">
                Swipe up when ready to find your matches! 🎉
              </p>
            </div>
          )}
          
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1 py-3"
              size="lg"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsStep;
