
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

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
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);

  const timeframeOptions = [
    { id: 'asap', label: 'ASAP (Within 2 weeks)' },
    { id: '1month', label: 'Within 1 month' },
    { id: '2months', label: 'Within 2 months' },
    { id: '3months', label: 'Within 3 months' },
    { id: 'flexible', label: 'Flexible timeline' }
  ];

  const mockAddresses = [
    '123 Wall Street, Financial District, NYC',
    '456 Broadway, SoHo, NYC', 
    '789 Fifth Avenue, Midtown, NYC',
    '321 Park Avenue, Upper East Side, NYC',
    '654 Madison Avenue, Upper East Side, NYC',
    '987 Atlantic Avenue, Brooklyn Heights, NYC',
    '159 Court Street, Downtown Brooklyn, NYC',
    '753 Metropolitan Avenue, Williamsburg, NYC'
  ];

  const handleLocationChange = (value: string) => {
    onUpdate({ location: value });
    
    if (value.length > 2) {
      const filtered = mockAddresses.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setAddressSuggestions(filtered.slice(0, 5));
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleClearData = () => {
    onUpdate({ 
      priceRange: [500, 3000], 
      moveInTimeframe: '', 
      location: '', 
      proximityRadius: 5 
    });
  };

  return (
    <div className="min-h-screen bg-white touch-pan-y">
      <div className="px-4 sm:px-6 py-6 space-y-6 max-w-2xl mx-auto pb-32">
        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            This move will be a breeze.
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Let's start with the basics to find your perfect match.
          </p>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            What's your budget range?
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
            <div className="px-2">
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
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            When do you need to move in?
          </h3>
          <div className="space-y-3">
            {timeframeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onUpdate({ moveInTimeframe: option.id })}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 text-sm sm:text-base ${
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
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Where do you want to live?
          </h3>
          <div className="relative">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                placeholder="Enter neighborhood or address..."
                className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            {/* Address Suggestions */}
            {addressSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                {addressSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onUpdate({ location: suggestion });
                      setAddressSuggestions([]);
                    }}
                    className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3 text-sm sm:text-base"
                  >
                    <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Proximity Radius */}
        {location && (
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              How far is too far?
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {proximityRadius} {proximityRadius === 1 ? 'mile' : 'miles'}
                </span>
                <p className="text-sm text-gray-600 mt-1">from your chosen area</p>
              </div>
              <div className="px-2">
                <Slider
                  value={[proximityRadius]}
                  onValueChange={(value) => onUpdate({ proximityRadius: value[0] })}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 mile</span>
                <span>20+ miles</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceAndTimeStep;
