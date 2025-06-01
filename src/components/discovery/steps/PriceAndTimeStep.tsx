
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

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
  proximityRadius,
  onUpdate, 
  onContinue,
  canContinue
}: PriceAndTimeStepProps) => {
  const [isSliding, setIsSliding] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);

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

  const mockAddresses = [
    '123 Wall Street, New York, NY',
    '456 Broadway, New York, NY',
    '789 Fifth Avenue, New York, NY',
    '321 Park Avenue, New York, NY',
    '654 Madison Avenue, New York, NY'
  ];

  const handleLocationChange = (value: string) => {
    onUpdate({ location: value });
    
    // Mock address suggestions
    if (value.length > 2) {
      const filtered = mockAddresses.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setAddressSuggestions(filtered.slice(0, 3));
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleSlideStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canContinue) return;
    setIsSliding(true);
    setSlidePosition(0);
  };

  const handleSlideMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isSliding || !canContinue) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = Math.max(0, Math.min(clientX - rect.left, rect.width - 60));
    setSlidePosition(position);

    // Trigger continue when slid far enough
    if (position > rect.width * 0.8) {
      setIsSliding(false);
      setSlidePosition(0);
      onContinue();
    }
  };

  const handleSlideEnd = () => {
    setIsSliding(false);
    setSlidePosition(0);
  };

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
            <div className="relative">
              <Slider
                value={priceRange}
                onValueChange={(value) => onUpdate({ priceRange: value as [number, number] })}
                max={6000}
                min={500}
                step={50}
                className="w-full"
              />
            </div>
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
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder="Enter neighborhood, city, or address..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Address Suggestions */}
            {addressSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {addressSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onUpdate({ location: suggestion });
                      setAddressSuggestions([]);
                    }}
                    className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
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

        {/* Proximity Radius */}
        {location && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              How far is too far?
            </h3>
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600">
                  {proximityRadius} {proximityRadius === 1 ? 'mile' : 'miles'}
                </span>
                <p className="text-sm text-gray-600">from {location}</p>
              </div>
              <Slider
                value={[proximityRadius]}
                onValueChange={(value) => onUpdate({ proximityRadius: value[0] })}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 mile</span>
                <span>20+ miles</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Section with Slide to Unlock */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Slide to Unlock Button */}
          <div className="w-full max-w-sm">
            <div 
              className={`relative h-14 rounded-full border-2 transition-all duration-200 ${
                canContinue 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 bg-gray-100'
              }`}
              onMouseMove={handleSlideMove}
              onMouseUp={handleSlideEnd}
              onMouseLeave={handleSlideEnd}
              onTouchMove={handleSlideMove}
              onTouchEnd={handleSlideEnd}
            >
              {/* Background Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-medium ${
                  canContinue ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {canContinue ? 'Slide to continue' : 'Complete all fields'}
                </span>
              </div>
              
              {/* Sliding Button */}
              {canContinue && (
                <div
                  className={`absolute top-1 left-1 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    isSliding ? 'shadow-lg' : 'shadow-md'
                  }`}
                  style={{ transform: `translateX(${slidePosition}px)` }}
                  onMouseDown={handleSlideStart}
                  onTouchStart={handleSlideStart}
                >
                  <ChevronRight className="text-white" size={20} />
                </div>
              )}
            </div>
          </div>

          {/* Fallback Button */}
          <Button 
            onClick={onContinue}
            disabled={!canContinue}
            variant="outline"
            className="w-full max-w-sm"
            size="sm"
          >
            Or tap here to continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PriceAndTimeStep;
