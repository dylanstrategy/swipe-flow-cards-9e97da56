
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, DollarSign, Calendar } from 'lucide-react';

interface PriceAndTimeStepProps {
  priceRange: [number, number];
  moveInTimeframe: string;
  location: string;
  proximityRadius: number;
  onUpdate: (updates: any) => void;
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
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Let's Find Your Perfect Home
        </h1>
        <p className="text-gray-600 text-lg">
          Tell us about your budget, timing, and location preferences
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8 space-y-8">
        {/* Price Range */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <Label className="text-lg font-semibold text-gray-900">Monthly Budget</Label>
              <p className="text-sm text-gray-600">What's your comfortable rent range?</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(priceRange[0])}
              </span>
              <span className="text-sm text-gray-500">to</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(priceRange[1])}
              </span>
            </div>
            
            <Slider
              value={priceRange}
              onValueChange={(value) => onUpdate({ priceRange: value as [number, number] })}
              min={800}
              max={6000}
              step={50}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>$800</span>
              <span>$6,000+</span>
            </div>
          </div>
        </div>

        {/* Move-in Timeline */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <Label className="text-lg font-semibold text-gray-900">When do you want to move?</Label>
              <p className="text-sm text-gray-600">This helps us show available units</p>
            </div>
          </div>
          
          <Select value={moveInTimeframe} onValueChange={(value) => onUpdate({ moveInTimeframe: value })}>
            <SelectTrigger className="h-14 text-base bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select your timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asap">ASAP (Within 2 weeks)</SelectItem>
              <SelectItem value="1month">Within 1 month</SelectItem>
              <SelectItem value="2months">Within 2 months</SelectItem>
              <SelectItem value="3months">Within 3 months</SelectItem>
              <SelectItem value="flexible">I'm flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <Label className="text-lg font-semibold text-gray-900">Preferred Location</Label>
              <p className="text-sm text-gray-600">City, neighborhood, or address</p>
            </div>
          </div>
          
          <Input
            value={location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="e.g., Austin, TX or Downtown Seattle"
            className="h-14 text-base bg-gray-50 border-gray-200"
          />
        </div>

        {/* Proximity Radius */}
        <div className="space-y-4">
          <div>
            <Label className="text-lg font-semibold text-gray-900">Search Radius</Label>
            <p className="text-sm text-gray-600">How far are you willing to be from your preferred location?</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="text-center mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {proximityRadius} miles
              </span>
            </div>
            
            <Slider
              value={[proximityRadius]}
              onValueChange={(value) => onUpdate({ proximityRadius: value[0] })}
              min={1}
              max={25}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1 mile</span>
              <span>25+ miles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAndTimeStep;
