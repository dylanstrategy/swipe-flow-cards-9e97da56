
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface SwipeableScreenHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
  rightButton?: ReactNode;
}

const SwipeableScreenHeader = ({ 
  title, 
  currentStep, 
  totalSteps, 
  onClose, 
  rightButton 
}: SwipeableScreenHeaderProps) => {
  return (
    <>
      {/* Header with X button and optional right button */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 relative z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <span className="text-xs text-gray-500">Step {currentStep} of {totalSteps}</span>
        </div>
        <div className="flex items-center gap-2">
          {rightButton}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="text-gray-600" size={20} />
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="flex-shrink-0 px-4 py-2 relative z-10">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default SwipeableScreenHeader;
