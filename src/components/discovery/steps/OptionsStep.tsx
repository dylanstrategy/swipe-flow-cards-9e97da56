
import React from 'react';
import { Home } from 'lucide-react';
import FeatureSelector from '../FeatureSelector';

interface Feature {
  id: string;
  label: string;
  selected: boolean;
  importance?: number;
}

interface OptionsStepProps {
  features: Feature[];
  onUpdate: (features: Feature[]) => void;
}

const OptionsStep = ({ features, onUpdate }: OptionsStepProps) => {
  const selectedCount = features.filter(f => f.selected).length;

  return (
    <div className="h-full overflow-hidden flex flex-col touch-pan-y" style={{ touchAction: 'pan-y' }}>
      <div className="flex-shrink-0 text-center space-y-2 mb-6">
        <Home className="mx-auto text-green-600" size={32} />
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Perfect the details
        </h2>
        <p className="text-sm sm:text-base text-gray-600 px-4">
          What specific features do you want in your space?
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        <FeatureSelector 
          features={features} 
          onFeaturesChange={onUpdate}
        />
      </div>

      <div className="flex-shrink-0 text-center space-y-2 mt-6 px-4 pb-4">
        <p className="text-xs sm:text-sm text-gray-500">
          Selected: {selectedCount} feature{selectedCount !== 1 ? 's' : ''}
        </p>
        {selectedCount > 0 && (
          <div className="text-xs sm:text-sm text-green-600 bg-green-50 p-3 rounded-lg font-medium">
            Swipe up to see your personalized matches! 🎉
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionsStep;
