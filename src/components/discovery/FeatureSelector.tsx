
import React from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

interface Feature {
  id: string;
  label: string;
  selected: boolean;
  importance?: number;
}

interface FeatureSelectorProps {
  features: Feature[];
  onFeaturesChange: (features: Feature[]) => void;
}

const FeatureSelector = ({ features, onFeaturesChange }: FeatureSelectorProps) => {
  const handleFeatureToggle = (featureId: string) => {
    const updatedFeatures = features.map(f => 
      f.id === featureId 
        ? { ...f, selected: !f.selected, importance: f.selected ? undefined : 3 }
        : f
    );
    onFeaturesChange(updatedFeatures);
  };

  const handleImportanceChange = (featureId: string, importance: number[]) => {
    const updatedFeatures = features.map(f => 
      f.id === featureId 
        ? { ...f, importance: importance[0] }
        : f
    );
    onFeaturesChange(updatedFeatures);
  };

  const getImportanceLabel = (importance?: number) => {
    if (!importance) return '';
    const labels = ['Low', 'Medium-Low', 'Medium', 'Medium-High', 'High'];
    return labels[importance - 1] || 'Medium';
  };

  return (
    <div className="space-y-3 touch-pan-y" style={{ touchAction: 'pan-y' }}>
      {features.map((feature) => (
        <div
          key={feature.id}
          className={cn(
            "p-3 sm:p-4 rounded-lg border-2 transition-all duration-200",
            feature.selected 
              ? "border-green-500 bg-green-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          )}
          style={{ touchAction: 'manipulation' }}
        >
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor={feature.id}
              className={cn(
                "font-medium cursor-pointer text-sm sm:text-base flex-1 pr-3",
                feature.selected ? "text-green-900" : "text-gray-700"
              )}
            >
              {feature.label}
            </label>
            <input
              id={feature.id}
              type="checkbox"
              checked={feature.selected}
              onChange={() => handleFeatureToggle(feature.id)}
              className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 flex-shrink-0"
              style={{ touchAction: 'manipulation' }}
            />
          </div>
          
          {feature.selected && (
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Importance:</span>
                <span className="font-medium text-green-700">
                  {getImportanceLabel(feature.importance)}
                </span>
              </div>
              <div style={{ touchAction: 'pan-x' }}>
                <Slider
                  value={[feature.importance || 3]}
                  onValueChange={(value) => handleImportanceChange(feature.id, value)}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeatureSelector;
