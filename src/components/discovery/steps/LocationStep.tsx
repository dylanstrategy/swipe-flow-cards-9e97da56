
import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface LocationStepProps {
  location: string;
  proximityRadius: number;
  onUpdate: (updates: { location?: string; proximityRadius?: number }) => void;
}

const LocationStep = ({ location, proximityRadius, onUpdate }: LocationStepProps) => {
  const commonLocations = [
    'Financial District',
    'Midtown Manhattan',
    'Brooklyn Heights',
    'Long Island City',
    'Jersey City',
    'Hoboken',
    'Upper East Side',
    'Upper West Side'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <MapPin className="mx-auto text-blue-600" size={32} />
        <h2 className="text-xl font-bold text-gray-900">
          Where do you want to live?
        </h2>
        <p className="text-gray-600">
          Choose your preferred area and how far you're willing to be from it.
        </p>
      </div>

      {/* Location Input */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Primary location or landmark
        </h3>
        <input
          type="text"
          value={location}
          onChange={(e) => onUpdate({ location: e.target.value })}
          placeholder="e.g., Financial District, My Office, etc."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ 
            fontSize: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            touchAction: 'manipulation',
            WebkitUserSelect: 'text',
            WebkitTouchCallout: 'none',
            WebkitTapHighlightColor: 'transparent',
            WebkitAppearance: 'none',
            borderRadius: '8px',
            transform: 'translateZ(0)'
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          inputMode="text"
        />
        
        {/* Quick Location Options */}
        <div className="grid grid-cols-2 gap-2">
          {commonLocations.map((loc) => (
            <button
              key={loc}
              onClick={() => onUpdate({ location: loc })}
              className="p-2 text-sm border border-gray-200 rounded-lg hover:border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
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

      {location && (
        <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          Swipe up to set your priorities
        </div>
      )}
    </div>
  );
};

export default LocationStep;
