
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface PriceAndTimeStepProps {
  priceRange: [number, number];
  moveInTimeframe: string;
  onUpdate: (updates: { priceRange?: [number, number]; moveInTimeframe?: string }) => void;
}

const PriceAndTimeStep = ({ priceRange, moveInTimeframe, onUpdate }: PriceAndTimeStepProps) => {
  const timeframeOptions = [
    { id: 'asap', label: 'ASAP (Within 2 weeks)' },
    { id: '1month', label: 'Within 1 month' },
    { id: '2months', label: 'Within 2 months' },
    { id: '3months', label: 'Within 3 months' },
    { id: 'flexible', label: 'Flexible timeline' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          This move will be a breeze.
        </h1>
        <p className="text-gray-600">
          Let's start with the basics to find your perfect match.
        </p>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          What's your budget range?
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={(value) => onUpdate({ priceRange: value as [number, number] })}
            max={6000}
            min={500}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$500</span>
            <span>$6,000+</span>
          </div>
        </div>
      </div>

      {/* Move-in Timeframe */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          When do you need to move in?
        </h3>
        <div className="space-y-2">
          {timeframeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onUpdate({ moveInTimeframe: option.id })}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                moveInTimeframe === option.id
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {moveInTimeframe && (
        <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          Swipe up to continue to location preferences
        </div>
      )}
    </div>
  );
};

export default PriceAndTimeStep;
