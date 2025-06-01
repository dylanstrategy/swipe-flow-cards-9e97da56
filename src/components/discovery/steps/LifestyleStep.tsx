
import React from 'react';

interface LifestyleStepProps {
  lifestyleTags: string[];
  onUpdate: (lifestyleTags: string[]) => void;
}

const LifestyleStep = ({ lifestyleTags, onUpdate }: LifestyleStepProps) => {
  const lifestyleOptions = [
    {
      id: 'pets',
      label: 'Has space for pets',
      emoji: '🐾'
    },
    {
      id: 'foodAndDrinks',
      label: 'Walkable to great food & drinks',
      emoji: '🍽️'
    },
    {
      id: 'nature',
      label: 'Close to nature or green space',
      emoji: '🌿'
    },
    {
      id: 'calm',
      label: 'Feels calm and quiet',
      emoji: '🛋️'
    },
    {
      id: 'wifi',
      label: 'Fast Wi-Fi for work or play',
      emoji: '📶'
    },
    {
      id: 'hosting',
      label: 'Easy to host friends',
      emoji: '🎉'
    },
    {
      id: 'creativity',
      label: 'Inspires creativity',
      emoji: '🎨'
    },
    {
      id: 'wellness',
      label: 'Has wellness or fitness options',
      emoji: '🧘'
    },
    {
      id: 'maintenance',
      label: 'Worry-free maintenance',
      emoji: '🛠️'
    },
    {
      id: 'central',
      label: 'In the middle of it all',
      emoji: '🏙️'
    },
    {
      id: 'private',
      label: 'Cozy and private',
      emoji: '🛏️'
    },
    {
      id: 'community',
      label: 'Has a sense of community',
      emoji: '🧑‍🤝‍🧑'
    },
    {
      id: 'soundproofing',
      label: 'Good soundproofing for music or calls',
      emoji: '🎧'
    },
    {
      id: 'budget',
      label: 'Fits my budget comfortably',
      emoji: '💸'
    },
    {
      id: 'design',
      label: 'Beautifully designed spaces',
      emoji: '✨'
    },
    {
      id: 'accessible',
      label: 'Easy to get around / accessible',
      emoji: '♿'
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
          What Makes It Feel Like Home?
        </h1>
        <p className="text-gray-600 text-sm mb-4">
          Choose up to 3 things that matter most to you
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
          
          return (
            <div
              key={option.id}
              className={`relative rounded-lg border-2 p-3 cursor-pointer transition-all duration-200 select-none ${
                isSelected 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 bg-white hover:shadow-sm hover:border-gray-300'
              }`}
              onClick={() => handleLifestyleToggle(option.id)}
            >
              <div className="flex items-center space-x-3">
                {/* Emoji */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-red-100' : 'bg-gray-50'
                }`}>
                  <span className="text-lg">{option.emoji}</span>
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
            {selectedCount === 3 ? "Perfect! 🏠" : `${selectedCount}/3 selected`}
          </p>
        </div>
      )}
    </div>
  );
};

export default LifestyleStep;
