
import React from 'react';
import { Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  // Organize features into categories
  const categories = [
    {
      id: 'in-unit',
      title: 'In-Unit Experience',
      subtitle: 'Comfort, privacy, daily ease',
      features: [
        { id: 'naturalLight', label: 'Natural light & airflow' },
        { id: 'washerDryer', label: 'In-unit washer/dryer' },
        { id: 'modernAppliances', label: 'Modern finishes & appliances' },
        { id: 'quietness', label: 'Quiet & soundproofing' },
        { id: 'outdoorSpace', label: 'Private outdoor space (balcony/patio)' },
      ]
    },
    {
      id: 'building',
      title: 'Building Features',
      subtitle: 'Shared amenities that enhance daily life',
      features: [
        { id: 'gym', label: 'Gym or wellness space' },
        { id: 'packageRoom', label: 'Package lockers / mailroom' },
        { id: 'coWorking', label: 'Co-working or lounge areas' },
        { id: 'secureEntry', label: 'Secure entry (fob, doorman, cameras)' },
        { id: 'petFriendly', label: 'Pet-friendly (with dog run or wash)' },
      ]
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle & Community',
      subtitle: 'Emotional + social alignment',
      features: [
        { id: 'communityEvents', label: 'Active community events / social vibe' },
        { id: 'quietEnvironment', label: 'Clean, quiet, respectful environment' },
        { id: 'inclusive', label: 'LGBTQ+ & diversity-inclusive' },
        { id: 'familyFriendly', label: 'Family or roommate-friendly' },
        { id: 'responsiveStaff', label: 'On-site staff responsiveness & friendliness' },
      ]
    },
    {
      id: 'location',
      title: 'Location & Convenience',
      subtitle: 'Neighborhood value + daily needs',
      features: [
        { id: 'transitAccess', label: 'Proximity to transit' },
        { id: 'walkable', label: 'Walkable to groceries / coffee / dining' },
        { id: 'commute', label: 'Commute to work/school' },
        { id: 'safety', label: 'Safety of neighborhood' },
        { id: 'greenSpace', label: 'Nearby green space or dog park' },
      ]
    },
    {
      id: 'technology',
      title: 'Technology & Modern Living',
      subtitle: 'Connectivity + smart systems',
      features: [
        { id: 'highSpeedInternet', label: 'High-speed internet quality' },
        { id: 'smartHome', label: 'Smart home features (locks, thermostat)' },
        { id: 'residentApp', label: 'Resident app / digital access' },
        { id: 'cellSignal', label: 'Reliable cell signal' },
        { id: 'evParking', label: 'EV parking / tech-enabled services' },
      ]
    }
  ];

  // Map current features to new structure
  const mapFeaturesToCategories = () => {
    return categories.map(category => ({
      ...category,
      features: category.features.map(categoryFeature => {
        const existingFeature = features.find(f => f.id === categoryFeature.id);
        return existingFeature || { ...categoryFeature, selected: false };
      })
    }));
  };

  const categorizedFeatures = mapFeaturesToCategories();

  const handleFeatureUpdate = (updatedFeatures: Feature[]) => {
    onUpdate(updatedFeatures);
  };

  const handleSkip = () => {
    // Clear all selections and proceed
    const clearedFeatures = features.map(f => ({ ...f, selected: false, importance: undefined }));
    onUpdate(clearedFeatures);
  };

  return (
    <div 
      className="h-full flex flex-col bg-white"
      style={{ 
        touchAction: 'pan-y',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-4 pt-6 pb-4 bg-white">
        <div className="text-center space-y-2">
          <Home className="mx-auto text-green-600" size={28} />
          <h2 className="text-lg font-bold text-gray-900">
            Perfect the details
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            What are your top residential living priorities? Choose from each category or skip if you prefer.
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto px-4"
        style={{ 
          touchAction: 'pan-y',
          overscrollBehavior: 'contain'
        }}
      >
        <div className="space-y-6 pb-6">
          {categorizedFeatures.map((category) => (
            <div key={category.id} className="space-y-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900 text-base">
                  {category.title}
                </h3>
                <p className="text-xs text-gray-500 italic">
                  {category.subtitle}
                </p>
              </div>
              
              <div className="space-y-2">
                {category.features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      feature.selected 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        id={feature.id}
                        type="checkbox"
                        checked={feature.selected}
                        onChange={() => {
                          const updatedFeatures = features.map(f => 
                            f.id === feature.id 
                              ? { ...f, selected: !f.selected, importance: f.selected ? undefined : 3 }
                              : f
                          );
                          handleFeatureUpdate(updatedFeatures);
                        }}
                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        style={{ touchAction: 'manipulation' }}
                      />
                      <label
                        htmlFor={feature.id}
                        className={`text-sm cursor-pointer flex-1 ${
                          feature.selected ? 'text-green-900 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {feature.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 px-4 pb-6 pt-4 bg-white border-t border-gray-100">
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Selected: {selectedCount} feature{selectedCount !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1 text-sm py-3"
            >
              Skip for now
            </Button>
            {selectedCount > 0 && (
              <div className="flex-1">
                <div className="text-xs text-center text-green-600 bg-green-50 p-3 rounded-lg font-medium">
                  Swipe up for matches! 🎉
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsStep;
