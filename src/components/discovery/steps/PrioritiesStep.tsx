
import React from 'react';
import { Home, Lightbulb, Wifi, House, Car, Shield, Star, Bell, Users, CircleCheck, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Priority {
  id: string;
  label: string;
  rank?: number;
}

interface PrioritiesStepProps {
  priorities: Priority[];
  onUpdate: (priorities: Priority[]) => void;
}

const PrioritiesStep = ({ priorities, onUpdate }: PrioritiesStepProps) => {
  const priorityOptions = [
    {
      id: 'price',
      label: 'Affordable rent within budget',
      icon: DollarSign,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 'location',
      label: 'Safe neighborhood',
      icon: Shield,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600'
    },
    {
      id: 'layout',
      label: 'Spacious layout and storage',
      icon: House,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'moveInDate',
      label: 'Available move-in date',
      icon: Bell,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      id: 'amenities',
      label: 'Modern amenities (gym, laundry, etc.)',
      icon: Star,
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'transit',
      label: 'Close to public transportation',
      icon: Car,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'quietness',
      label: 'Quiet environment',
      icon: Lightbulb,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'petPolicy',
      label: 'Pet-friendly policy',
      icon: Home,
      color: 'bg-pink-50 border-pink-200',
      iconColor: 'text-pink-600'
    },
    {
      id: 'parking',
      label: 'Parking availability',
      icon: Car,
      color: 'bg-teal-50 border-teal-200',
      iconColor: 'text-teal-600'
    },
    {
      id: 'naturalLight',
      label: 'Natural light and views',
      icon: Lightbulb,
      color: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-600'
    },
    {
      id: 'maintenance',
      label: 'Responsive maintenance',
      icon: CircleCheck,
      color: 'bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'leaseTerms',
      label: 'Flexible lease terms',
      icon: Users,
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          What matters most to you?
        </h1>
        <p className="text-gray-600 mb-6">
          Select up to 5 priorities in order of importance
        </p>
        
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div 
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
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

      {/* Priority Cards */}
      <div className="px-6 space-y-3">
        {priorityOptions.map((option) => {
          const rank = getPriorityRank(option.id);
          const isSelected = rank !== undefined;
          const IconComponent = option.icon;
          
          return (
            <div
              key={option.id}
              className={`relative rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : `${option.color} hover:shadow-md`
              }`}
              onClick={() => handlePriorityToggle(option.id)}
            >
              <div className="flex items-center space-x-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-blue-100' : 'bg-white'
                }`}>
                  <IconComponent 
                    size={24} 
                    className={isSelected ? 'text-blue-600' : option.iconColor} 
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${
                    isSelected ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </h3>
                </div>
                
                {/* Selection indicator */}
                <div className="flex-shrink-0">
                  {isSelected ? (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
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
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
            <p className="text-blue-700 font-medium">
              Great! You've selected {selectedCount} priorit{selectedCount === 1 ? 'y' : 'ies'}.
            </p>
            {selectedCount === 5 && (
              <p className="text-sm text-blue-600 mt-1">
                Swipe up when ready to continue! 🎉
              </p>
            )}
          </div>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => onUpdate(priorities.map(p => ({ ...p, rank: undefined })))}
          className="w-full py-3"
          size="lg"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default PrioritiesStep;
