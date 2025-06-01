
import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const selectedCount = features.filter(f => f.selected).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleFeatureToggle = (featureId: string) => {
    const updatedFeatures = features.map(f => 
      f.id === featureId 
        ? { ...f, selected: !f.selected, importance: f.selected ? undefined : 3 }
        : f
    );
    onUpdate(updatedFeatures);
  };

  const handleSkip = () => {
    const clearedFeatures = features.map(f => ({ ...f, selected: false, importance: undefined }));
    onUpdate(clearedFeatures);
  };

  return (
    <div className="h-full bg-white">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 pt-6 pb-4">
        <div className="text-center space-y-2">
          <Home className="mx-auto text-green-600" size={28} />
          <h2 className="text-xl font-bold text-gray-900">
            Perfect the details
          </h2>
          <div className={`transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <p className="text-sm text-gray-600 leading-relaxed">
              What are your top 5 residential living priorities? You can either rank your top 5 overall, or choose one from each category below.
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 pb-32">
        <div className="space-y-8 py-6">
          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500 italic">
                  {category.subtitle}
                </p>
              </div>
              
              <div className="space-y-3">
                {category.features.map((categoryFeature) => {
                  const feature = features.find(f => f.id === categoryFeature.id) || 
                    { ...categoryFeature, selected: false };
                  
                  return (
                    <button
                      key={feature.id}
                      onClick={() => handleFeatureToggle(feature.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        feature.selected 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          feature.selected 
                            ? 'border-green-500 bg-green-500' 
                            : 'border-gray-300'
                        }`}>
                          {feature.selected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-base ${
                          feature.selected ? 'text-green-900 font-medium' : 'text-gray-700'
                        }`}>
                          {feature.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Selected: {selectedCount} feature{selectedCount !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1 py-3"
            >
              Skip for now
            </Button>
            {selectedCount > 0 && (
              <div className="flex-1">
                <div className="text-sm text-center text-green-600 bg-green-50 p-3 rounded-lg font-medium">
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
