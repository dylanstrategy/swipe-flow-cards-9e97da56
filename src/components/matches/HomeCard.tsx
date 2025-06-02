
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin } from 'lucide-react';

interface Home {
  id: string;
  image: string;
  title: string;
  address: string;
  price: string;
  moveIn: string;
  matchScore: number;
  amenities: string[];
  buildingAmenities: string[];
}

interface HomeCardProps {
  home: Home;
}

const HomeCard = ({ home }: HomeCardProps) => {
  const navigate = useNavigate();
  
  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const handleApplyNow = () => {
    console.log('Apply Now clicked for home:', home);
    console.log('Navigating to:', `/movein/${home.id}`);
    // Navigate to move-in process with home details
    navigate(`/movein/${home.id}`, { state: { home } });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-fit">
      {/* Fixed Height Image */}
      <div className="relative h-48">
        <img
          src={home.image}
          alt={home.title}
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white"
        >
          <Heart size={16} />
        </Button>
        <Badge
          className={`absolute top-2 left-2 text-white ${getMatchColor(home.matchScore)}`}
        >
          {home.matchScore}% Match
        </Badge>
      </div>

      {/* Fixed Content Area */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{home.title}</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin size={12} className="mr-1 flex-shrink-0" />
              <span className="truncate">{home.address}</span>
            </div>
          </div>
          <div className="text-right ml-2 flex-shrink-0">
            <div className="font-semibold">{home.price}</div>
            <div className="text-xs text-gray-600">Move-In: {home.moveIn}</div>
          </div>
        </div>

        {/* Amenities - Fixed Height */}
        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Apartment Amenities</h4>
            <div className="flex flex-wrap gap-1 min-h-[24px]">
              {home.amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {home.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{home.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Building Amenities</h4>
            <div className="flex flex-wrap gap-1 min-h-[24px]">
              {home.buildingAmenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {home.buildingAmenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{home.buildingAmenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button className="flex-1 text-sm" size="sm">
            Book a Tour
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 text-sm" 
            size="sm"
            onClick={handleApplyNow}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
