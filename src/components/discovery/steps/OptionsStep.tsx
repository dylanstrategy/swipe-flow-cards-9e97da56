
import React, { useState, useEffect } from 'react';
import { Home, Lightbulb, Wifi, House, Car, Shield, Star, Bell, Users, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="h-full bg-white overflow-hidden" style={{ touchAction: 'pan-y' }}>
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 pt-6 pb-4">
        <div className="text-center space-y-2">
          <Home className="mx-auto text-green-600" size={28} />
          <h2 className="text-xl font-bold text-gray-900">
            What are your Top 5?
          </h2>
          <div className={`transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <p className="text-xs text-gray-600">
              Select up to 5 priorities
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 pb-32 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)', touchAction: 'pan-y' }}>
        <div className="grid gap-3 py-4">
          {priorities.map((priority) => {
            const rank = getPriorityRank(priority.id);
            const isSelected = rank !== undefined;
            const IconComponent = priority.icon;
            
            return (
              <div
                key={priority.id}
                onClick={() => handlePriorityToggle(priority.id)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'border-green-500 bg-green-50 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                {/* Rank Badge */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    #{rank}
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isSelected ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <IconComponent 
                      size={24} 
                      className={isSelected ? 'text-green-600' : 'text-gray-600'} 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-base ${
                      isSelected ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {priority.label}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      isSelected ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {priority.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Selected: {selectedCount}/5 priorities
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1 py-3"
            >
              Skip for now
            </Button>
            {selectedCount > 0 && (
              <div className="flex-1">
                <div className="text-sm text-center text-green-600 bg-green-50 p-3 rounded-lg font-medium">
                  Swipe up for matches! 🎉
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsStep;
