
import React, { useState, useEffect, useRef } from 'react';
import { Home, Lightbulb, Wifi, House, Car, Shield, Star, Bell, Users, CircleCheck, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (!scrollArea) return;

      const currentScrollY = scrollArea.scrollTop;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        // Scrolling up or near top
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const scrollArea = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollArea.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

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
    <div className="h-full flex flex-col bg-white">
      {/* Collapsible Header */}
      <div className={`flex-shrink-0 px-6 transition-all duration-300 ease-in-out ${
        isHeaderVisible ? 'pt-6 pb-3' : 'pt-2 pb-1'
      }`}>
        <div className={`text-center transition-opacity duration-300 ${
          isHeaderVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            What matters most to you?
          </h1>
          <p className="text-gray-600 text-sm mb-3">
            Select up to 5 priorities in order of importance
          </p>
        </div>
        
        {/* Progress indicator - always visible but smaller when collapsed */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div 
                key={num}
                className={`rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  isHeaderVisible ? 'w-6 h-6' : 'w-4 h-4'
                } ${
                  num <= selectedCount 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isHeaderVisible && num}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Priority Cards */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
        <div className="space-y-2 pb-4">
          {priorityOptions.map((option) => {
            const rank = getPriorityRank(option.id);
            const isSelected = rank !== undefined;
            const IconComponent = option.icon;
            
            return (
              <div
                key={option.id}
                className={`relative rounded-lg border-2 p-2.5 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : `${option.color} hover:shadow-md`
                }`}
                onClick={() => handlePriorityToggle(option.id)}
              >
                <div className="flex items-center space-x-3">
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-blue-100' : 'bg-white'
                  }`}>
                    <IconComponent 
                      size={16} 
                      className={isSelected ? 'text-blue-600' : option.iconColor} 
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`font-medium text-sm ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </h3>
                  </div>
                  
                  {/* Selection indicator */}
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{rank}</span>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Fixed Bottom section */}
      <div className="flex-shrink-0 px-6 py-4">
        {selectedCount > 0 && (
          <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200 mb-3">
            <p className="text-blue-700 font-medium text-sm">
              Great! You've selected {selectedCount} priorit{selectedCount === 1 ? 'y' : 'ies'}.
            </p>
            {selectedCount === 5 && (
              <p className="text-xs text-blue-600 mt-1">
                Swipe up when ready to continue! 🎉
              </p>
            )}
          </div>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => onUpdate(priorities.map(p => ({ ...p, rank: undefined })))}
          className="w-full py-2"
          size="lg"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default PrioritiesStep;
