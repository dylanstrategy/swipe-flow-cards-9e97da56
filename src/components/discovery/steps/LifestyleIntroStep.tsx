
import React from 'react';
import { Heart } from 'lucide-react';

interface LifestyleIntroStepProps {
  onContinue: () => void;
}

const LifestyleIntroStep = ({ onContinue }: LifestyleIntroStepProps) => {
  return (
    <div className="h-full flex flex-col justify-center items-center px-6 bg-white">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            What's going to make this feel like home?
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Tell us about your lifestyle so we can find a place that truly fits who you are.
          </p>
        </div>
        
        <div className="space-y-3 mb-8">
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
            Choose up to 3 lifestyle preferences
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
            Select what resonates most with you
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleIntroStep;
