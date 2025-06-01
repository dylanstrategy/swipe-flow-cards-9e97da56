
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface PriceAndTimeStepProps {
  priceRange: [number, number];
  moveInTimeframe: string;
  location: string;
  proximityRadius: number;
  onUpdate: (updates: { 
    priceRange?: [number, number]; 
    moveInTimeframe?: string;
    location?: string;
    proximityRadius?: number;
  }) => void;
  onContinue: () => void;
  canContinue: boolean;
}

const PriceAndTimeStep = ({ 
  priceRange, 
  moveInTimeframe, 
  location,
  onUpdate, 
  onContinue,
  canContinue
}: PriceAndTimeStepProps) => {
  const timeframeOptions = [
    { id: 'asap', label: 'ASAP (Within 2 weeks)' },
    { id: '1month', label: 'Within 1 month' },
    { id: '2months', label: 'Within 2 months' },
    { id: '3months', label: 'Within 3 months' },
    { id: 'flexible', label: 'Flexible timeline' }
  ];

  const commonLocations = [
    'Financial District, NYC',
    'Midtown Manhattan, NYC',
    'Brooklyn Heights, NYC',
    'Long Island City, NYC',
    'Jersey City, NJ',
    'Hoboken, NJ',
    'Upper East Side, NYC',
    'Upper West Side, NYC'
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 pt-8 pb-32 space-y-8">
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

        {/* Location Input */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Where do you want to live?
          </h3>
          <input
            type="text"
            value={location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="Enter neighborhood, city, or address..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Quick Location Options */}
          <div className="grid grid-cols-1 gap-2">
            {commonLocations.map((loc) => (
              <button
                key={loc}
                onClick={() => onUpdate({ location: loc })}
                className="p-2 text-sm border border-gray-200 rounded-lg hover:border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Continue Button */}
          <Button 
            onClick={onContinue}
            disabled={!canContinue}
            className="w-full"
            size="lg"
          >
            {canContinue ? 'Continue to Priorities' : 'Complete all fields to continue'}
          </Button>

          {canContinue && (
            <p className="text-sm text-gray-500 text-center">
              Swipe up to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceAndTimeStep;
