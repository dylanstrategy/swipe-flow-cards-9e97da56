
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface PriorityIntroStepProps {
  onContinue: () => void;
}

const PriorityIntroStep = ({ onContinue }: PriorityIntroStepProps) => {
  return (
    <div className="h-full flex flex-col justify-center items-center px-6 bg-white">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Now prioritize what matters most
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Help us understand your top priorities so we can find the perfect match for your lifestyle.
          </p>
        </div>
        
        <div className="space-y-3 mb-8">
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            Select up to 5 priorities
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            Rank them in order of importance
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            Swipe up when ready to continue
          </div>
        </div>
        
        <Button 
          onClick={onContinue}
          className="w-full py-3"
          size="lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default PriorityIntroStep;
