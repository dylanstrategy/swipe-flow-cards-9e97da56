
import React from 'react';
import { Heart, Users, Volume, Dumbbell, Laptop, Dog, Music, Baby, Sparkles, ChefHat, TreePine, Smartphone } from 'lucide-react';

interface LifestyleStepProps {
  lifestyleTags: string[];
  onUpdate: (lifestyleTags: string[]) => void;
}

const LifestyleStep = ({ lifestyleTags, onUpdate }: LifestyleStepProps) => {
  const lifestyleOptions = [
    {
      id: 'social',
      label: 'Social & Community-focused',
      icon: Users,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'quiet',
      label: 'Quiet & Private',
      icon: Volume,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'active',
      label: 'Active & Fitness-oriented',
      icon: Dumbbell,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      id: 'workFromHome',
      label: 'Work from Home',
      icon: Laptop,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 'petLover',
      label: 'Pet Lover',
      icon: Dog,
      color: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-600'
    },
    {
      id: 'nightlife',
      label: 'Nightlife & Entertainment',
      icon: Music,
      color: 'bg-pink-50 border-pink-200',
      iconColor: 'text-pink-600'
    },
    {
      id: 'family',
      label: 'Family-oriented',
      icon: Baby,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600'
    },
    {
      id: 'minimalist',
      label: 'Minimalist Living',
      icon: Sparkles,
      color: 'bg-slate-50 border-slate-200',
      iconColor: 'text-slate-600'
    },
    {
      id: 'creative',
      label: 'Creative & Artistic',
      icon: Heart,
      color: 'bg-rose-50 border-rose-200',
      iconColor: 'text-rose-600'
    },
    {
      id: 'foodie',
      label: 'Foodie & Cooking',
      icon: ChefHat,
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'outdoor',
      label: 'Outdoor Enthusiast',
      icon: TreePine,
      color: 'bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'tech',
      label: 'Tech & Innovation',
      icon: Smartphone,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600'
    }
  ];

  const selectedCount = lifestyleTags.length;

  const handleLifestyleToggle = (lifestyleId: string) => {
    if (lifestyleTags.includes(lifestyleId)) {
      // Remove from selection
      onUpdate(lifestyleTags.filter(tag => tag !== lifestyleId));
    } else {
      // Add to selection if under 3
      if (selectedCount < 3) {
        onUpdate([...lifestyleTags, lifestyleId]);
      }
    }
  };

  return (
    <div className="p-6 pb-24">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Select Your Top 3 Lifestyle Preferences
        </h1>
        <p className="text-gray-600 text-sm mb-4">
          Choose what makes you feel most at home
        </p>
        
        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((num) => (
              <div 
                key={num}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  num <= selectedCount 
                    ? 'bg-red-500 text-white' 
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
        {lifestyleOptions.map((option) => {
          const isSelected = lifestyleTags.includes(option.id);
          const IconComponent = option.icon;
          
          return (
            <div
              key={option.id}
              className={`relative rounded-lg border-2 p-3 cursor-pointer transition-all duration-200 select-none ${
                isSelected 
                  ? 'border-red-500 bg-red-50' 
                  : `${option.color} hover:shadow-sm`
              }`}
              onClick={() => handleLifestyleToggle(option.id)}
            >
              <div className="flex items-center space-x-3">
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-red-100' : 'bg-white'
                }`}>
                  <IconComponent 
                    size={16} 
                    className={isSelected ? 'text-red-600' : option.iconColor} 
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm ${
                    isSelected ? 'text-red-900' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </h3>
                </div>
                
                {/* Selection indicator */}
                <div className="flex-shrink-0">
                  {isSelected ? (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
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

      {selectedCount > 0 && (
        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200 mt-6">
          <p className="text-red-700 font-medium text-sm">
            {selectedCount === 3 ? "Perfect! 🏠" : `${selectedCount}/3 lifestyle preferences selected`}
          </p>
        </div>
      )}
    </div>
  );
};

export default LifestyleStep;
