
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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Home className="mx-auto text-green-600" size={32} />
        <h2 className="text-xl font-bold text-gray-900">
          Perfect the details
        </h2>
        <p className="text-gray-600">
          What specific features do you want in your space?
        </p>
      </div>

      <FeatureSelector 
        features={features} 
        onFeaturesChange={onUpdate}
      />

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          Selected: {selectedCount} feature{selectedCount !== 1 ? 's' : ''}
        </p>
        {selectedCount > 0 && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg font-medium">
            Swipe up to see your personalized matches! 🎉
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionsStep;
