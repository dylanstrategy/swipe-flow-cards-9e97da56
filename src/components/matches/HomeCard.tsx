
import React from 'react';
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
  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img
          src={home.image}
          alt={home.title}
          className="w-full h-40 sm:h-48 object-cover"
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

      {/* Content */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg truncate">{home.title}</h3>
            <div className="flex items-center text-gray-600 text-xs sm:text-sm">
              <MapPin size={12} className="mr-1 flex-shrink-0" />
              <span className="truncate">{home.address}</span>
            </div>
          </div>
          <div className="text-right ml-2 flex-shrink-0">
            <div className="font-semibold text-sm sm:text-base">{home.price}</div>
            <div className="text-xs text-gray-600">Move-In: {home.moveIn}</div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-3">
          <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Apartment Amenities</h4>
          <div className="flex flex-wrap gap-1">
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

        <div className="mb-3">
          <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Building Amenities</h4>
          <div className="flex flex-wrap gap-1">
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

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button className="flex-1 text-xs sm:text-sm" size="sm">
            Book a Tour
          </Button>
          <Button variant="outline" className="flex-1 text-xs sm:text-sm" size="sm">
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
