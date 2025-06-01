
import React from 'react';
import { Heart } from 'lucide-react';

interface LifestyleStepProps {
  lifestyleTags: string[];
  onUpdate: (lifestyleTags: string[]) => void;
}

const LifestyleStep = ({ lifestyleTags, onUpdate }: LifestyleStepProps) => {
  const lifestyleOptions = [
    { id: 'social', label: 'Social & Community-focused', icon: '👥' },
    { id: 'quiet', label: 'Quiet & Private', icon: '🤫' },
    { id: 'active', label: 'Active & Fitness-oriented', icon: '🏃‍♀️' },
    { id: 'workFromHome', label: 'Work from Home', icon: '💻' },
    { id: 'petLover', label: 'Pet Lover', icon: '🐕' },
    { id: 'nightlife', label: 'Nightlife & Entertainment', icon: '🌃' },
    { id: 'family', label: 'Family-oriented', icon: '👨‍👩‍👧‍👦' },
    { id: 'minimalist', label: 'Minimalist Living', icon: '✨' },
    { id: 'creative', label: 'Creative & Artistic', icon: '🎨' },
    { id: 'foodie', label: 'Foodie & Cooking', icon: '👨‍🍳' },
    { id: 'outdoor', label: 'Outdoor Enthusiast', icon: '🌲' },
    { id: 'tech', label: 'Tech & Innovation', icon: '📱' }
  ];

  const toggleLifestyleTag = (tagId: string) => {
    if (lifestyleTags.includes(tagId)) {
      onUpdate(lifestyleTags.filter(tag => tag !== tagId));
    } else {
      onUpdate([...lifestyleTags, tagId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Heart className="mx-auto text-red-500" size={32} />
        <h2 className="text-xl font-bold text-gray-900">
          What makes you feel at home?
        </h2>
        <p className="text-gray-600">
          Select the lifestyle tags that resonate with you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {lifestyleOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleLifestyleTag(option.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center gap-3 ${
              lifestyleTags.includes(option.id)
                ? 'border-red-500 bg-red-50 text-red-900'
                : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
            }`}
          >
            <span className="text-2xl">{option.icon}</span>
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          Selected: {lifestyleTags.length} lifestyle{lifestyleTags.length !== 1 ? 's' : ''}
        </p>
        {lifestyleTags.length > 0 && (
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            Swipe up to choose specific features
          </div>
        )}
      </div>
    </div>
  );
};

export default LifestyleStep;
