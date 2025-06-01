
import React, { useState } from 'react';
import { Home, Lightbulb, Wifi, House, Car, Shield, Star, Bell, Users, CircleCheck, Check } from 'lucide-react';
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
  const priorities = [
    {
      id: 'naturalLightQuiet',
      label: 'Natural Light & Quiet',
      description: 'A calm, well-lit space that feels good to be in.',
      icon: Lightbulb,
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'modernFunctional',
      label: 'Modern & Functional Unit',
      description: 'Updated appliances, layout, and in-unit washer/dryer.',
      icon: House,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'reliableWifiTech',
      label: 'Reliable Wi-Fi & Tech',
      description: 'Strong internet, smart home features, or digital access.',
      icon: Wifi,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 'walkabilityTransit',
      label: 'Walkability & Transit Access',
      description: 'Easy access to groceries, cafes, public transit.',
      icon: Car,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'amenitiesLife',
      label: 'Amenities that Fit My Life',
      description: 'Gym, coworking, lounge, rooftop, pet areas, etc.',
      icon: Star,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      id: 'safetySecurity',
      label: 'Safety & Security',
      description: 'Secure entry, neighborhood safety, peace of mind.',
      icon: Shield,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600'
    },
    {
      id: 'cleanlinessMainten',
      label: 'Cleanliness & Maintenance',
      description: 'Well-kept common areas and fast issue resolution.',
      icon: CircleCheck,
      color: 'bg-teal-50 border-teal-200',
      iconColor: 'text-teal-600'
    },
    {
      id: 'petFriendlyLiving',
      label: 'Pet-Friendly Living',
      description: 'Comfort and support for living with pets.',
      icon: Home,
      color: 'bg-pink-50 border-pink-200',
      iconColor: 'text-pink-600'
    },
    {
      id: 'communityVibe',
      label: 'Community Vibe',
      description: 'Friendly, respectful neighbors or active social environment.',
      icon: Users,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'affordabilityValue',
      label: 'Affordability & Value',
      description: 'Worth the cost, transparent fees, and financial peace.',
      icon: Bell,
      color: 'bg-gray-50 border-gray-200',
      iconColor: 'text-gray-600'
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

  const getPriorityRank = (priorityId: string) => {
    const feature = features.find(f => f.id === priorityId);
    return feature?.importance;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          What are your Top 5?
        </h1>
        <p className="text-gray-600 mb-6">
          Select up to 5 priorities that matter most to you
        </p>
        
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div 
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  num <= selectedCount 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Cards */}
      <div className="px-6 space-y-3">
        {priorities.map((priority) => {
          const rank = getPriorityRank(priority.id);
          const isSelected = rank !== undefined;
          const IconComponent = priority.icon;
          
          return (
            <div
              key={priority.id}
              className={`relative rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-green-500 bg-green-50' 
                  : `${priority.color} hover:shadow-md`
              }`}
              onClick={() => handlePriorityToggle(priority.id)}
            >
              <div className="flex items-center space-x-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-green-100' : 'bg-white'
                }`}>
                  <IconComponent 
                    size={24} 
                    className={isSelected ? 'text-green-600' : priority.iconColor} 
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${
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
                
                {/* Selection indicator */}
                <div className="flex-shrink-0">
                  {isSelected ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{rank}</span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="px-6 py-8">
        {selectedCount > 0 && (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
            <p className="text-green-700 font-medium">
              Great! You've selected {selectedCount} priorit{selectedCount === 1 ? 'y' : 'ies'}.
            </p>
            {selectedCount === 5 && (
              <p className="text-sm text-green-600 mt-1">
                Swipe up when ready to continue! 🎉
              </p>
            )}
          </div>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => onUpdate(features.map(f => ({ ...f, selected: false, importance: undefined })))}
          className="w-full py-3"
          size="lg"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default OptionsStep;
