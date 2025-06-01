
import React from 'react';
import { Home, Lightbulb, Wifi, House, Car, Shield, Star, Bell, Users, CircleCheck, DollarSign, MapPin } from 'lucide-react';

interface Priority {
  id: string;
  label: string;
  description: string;
  rank?: number;
}

interface PrioritiesStepProps {
  priorities: Priority[];
  onUpdate: (priorities: Priority[]) => void;
}

const PrioritiesStep = ({ priorities, onUpdate }: PrioritiesStepProps) => {
  const priorityOptions = [
    {
      id: 'naturalLightQuiet',
      label: 'Natural Light & Quiet',
      description: 'A calm, well-lit space that\'s peaceful and relaxing.',
      icon: Lightbulb,
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'modernFunctional',
      label: 'Modern & Functional Unit',
      description: 'Updated appliances, smart layout, and in-unit washer/dryer.',
      icon: House,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'reliableWifiTech',
      label: 'Reliable Wi-Fi & Tech',
      description: 'Fast internet, smart features, and digital access built in.',
      icon: Wifi,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'walkabilityTransit',
      label: 'Walkability & Transit Access',
      description: 'Steps from groceries, restaurants, and public transit.',
      icon: MapPin,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 'amenitiesLife',
      label: 'Amenities That Fit My Life',
      description: 'Gym, rooftop, coworking, pet perks — the extras that matter.',
      icon: Star,
      color: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-600'
    },
    {
      id: 'securityServices',
      label: 'Security & Services',
      description: 'Controlled entry, concierge, package room, well-lit access.',
      icon: Shield,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600'
    },
    {
      id: 'cleanMaintained',
      label: 'Clean & Well-Maintained',
      description: 'Fast response to issues and clean common spaces.',
      icon: CircleCheck,
      color: 'bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'petFriendly',
      label: 'Pet-Friendly Living',
      description: 'A place where pets feel just as welcome as people.',
      icon: Home,
      color: 'bg-pink-50 border-pink-200',
      iconColor: 'text-pink-600'
    },
    {
      id: 'communityVibe',
      label: 'Community Vibe',
      description: 'Friendly neighbors, shared spaces, or resident events.',
      icon: Users,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'parkingConvenience',
      label: 'Parking & Convenience',
      description: 'Easy access to on-site or nearby parking (including EV options).',
      icon: Car,
      color: 'bg-teal-50 border-teal-200',
      iconColor: 'text-teal-600'
    },
    {
      id: 'affordabilityValue',
      label: 'Affordability & Value',
      description: 'Feels worth it — transparent pricing and quality for the cost.',
      icon: DollarSign,
      color: 'bg-slate-50 border-slate-200',
      iconColor: 'text-slate-600'
    }
  ];

  const selectedPriorities = priorities.filter(p => p.rank).sort((a, b) => (a.rank || 0) - (b.rank || 0));
  const selectedCount = selectedPriorities.length;

  const handlePriorityToggle = (priorityId: string) => {
    const currentPriority = priorities.find(p => p.id === priorityId);
    
    if (currentPriority?.rank) {
      // Remove from selection
      const updatedPriorities = priorities.map(p => 
        p.id === priorityId 
          ? { ...p, rank: undefined }
          : p
      );
      
      // Reorder remaining priorities
      const remainingSelected = updatedPriorities.filter(p => p.rank);
      remainingSelected.sort((a, b) => (a.rank || 0) - (b.rank || 0));
      remainingSelected.forEach((priority, index) => {
        priority.rank = index + 1;
      });
      
      onUpdate(updatedPriorities);
    } else {
      // Add to selection if under 5
      if (selectedCount < 5) {
        const updatedPriorities = priorities.map(p => 
          p.id === priorityId 
            ? { ...p, rank: selectedCount + 1 }
            : p
        );
        onUpdate(updatedPriorities);
      }
    }
  };

  const getPriorityRank = (priorityId: string) => {
    const priority = priorities.find(p => p.id === priorityId);
    return priority?.rank;
  };

  return (
    <div className="p-6 pb-24" style={{ touchAction: 'manipulation' }}>
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Select Your Top 5 Priorities
        </h1>
        <p className="text-gray-600 text-sm mb-4">
          Tap to rank in order of importance
        </p>
        
        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div 
                key={num}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  num <= selectedCount 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="space-y-3">
        {priorityOptions.map((option) => {
          const rank = getPriorityRank(option.id);
          const isSelected = rank !== undefined;
          const IconComponent = option.icon;
          
          return (
            <div
              key={option.id}
              className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 select-none ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : `${option.color} hover:shadow-sm`
              }`}
              onClick={() => handlePriorityToggle(option.id)}
              style={{ touchAction: 'manipulation' }}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                  isSelected ? 'bg-blue-100' : 'bg-white'
                }`}>
                  <IconComponent 
                    size={20} 
                    className={isSelected ? 'text-blue-600' : option.iconColor} 
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-base mb-1 ${
                    isSelected ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    isSelected ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    {option.description}
                  </p>
                </div>
                
                {/* Selection indicator */}
                <div className="flex-shrink-0 mt-1">
                  {isSelected ? (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{rank}</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200 mt-6">
          <p className="text-blue-700 font-medium text-sm">
            {selectedCount === 5 ? "Perfect! 🎉" : `${selectedCount}/5 priorities selected`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PrioritiesStep;
