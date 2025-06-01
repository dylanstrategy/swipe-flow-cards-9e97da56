
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Heart, MapPin } from 'lucide-react';

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

const Matches = () => {
  const navigate = useNavigate();

  // Mock data - in a real app, this would be fetched based on user preferences
  const homes: Home[] = [
    {
      id: '1',
      image: '/placeholder.svg',
      title: 'Private Room',
      address: '1234 Elm St, Cityplace, ST',
      price: '$2,100 – 32,300/mo',
      moveIn: 'May 2024',
      matchScore: 95,
      amenities: ['Washer/Dryer', 'Air Conditioning', 'High Ceilings'],
      buildingAmenities: ['Fitness Center', 'Rooftop Terrace', 'Co-Working Space']
    },
    {
      id: '2',
      image: '/placeholder.svg',
      title: 'Modern Studio',
      address: '5678 Maple Ave, Townburg, ST',
      price: '$1,950 – 22,100/mo',
      moveIn: 'June 2024',
      matchScore: 88,
      amenities: ['In-Unit Laundry', 'Smart Home Features', 'Natural Light'],
      buildingAmenities: ['Gym', 'Pet Area', 'Package Room']
    },
    {
      id: '3',
      image: '/placeholder.svg',
      title: 'One Bedroom',
      address: '4321 Oak St, Villageland, ST',
      price: '$1,850 – 22,000/mo',
      moveIn: 'July 2024',
      matchScore: 82,
      amenities: ['Balcony', 'Updated Kitchen', 'Walk-in Closet'],
      buildingAmenities: ['Pool', 'Concierge', 'Parking Garage']
    },
    {
      id: '4',
      image: '/placeholder.svg',
      title: 'Luxury Unit',
      address: '8755 Pine Rd, Suburbville, ST',
      price: '$2,200 – 24,400/mo',
      moveIn: 'August 2024',
      matchScore: 78,
      amenities: ['Floor-to-Ceiling Windows', 'Premium Appliances', 'Hardwood Floors'],
      buildingAmenities: ['Spa', 'Business Center', 'Valet Parking']
    }
  ];

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/discovery')}
              className="p-2"
            >
              <ChevronLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Find your next home like you'd book your next trip</h1>
              <p className="text-sm text-gray-600">Search by date, budget, availability. Book a tour, apply online, and move with ease.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Budget:</span>
            <span className="font-medium">$1,600 – $2,400</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Move-in Date:</span>
            <span className="font-medium">May 2024</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Room Type:</span>
            <span className="font-medium">Any</span>
          </div>
          <Button size="sm" className="ml-auto">
            Search
          </Button>
        </div>
      </div>

      {/* Home Listings */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {homes.map((home) => (
            <div key={home.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Image */}
              <div className="relative">
                <img
                  src={home.image}
                  alt={home.title}
                  className="w-full h-48 object-cover"
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
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{home.title}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin size={14} className="mr-1" />
                      {home.address}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">{home.price}</div>
                    <div className="text-sm text-gray-600">Move-In: {home.moveIn}</div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Apartment Amenities</h4>
                  <div className="flex flex-wrap gap-1">
                    {home.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Building Amenities</h4>
                  <div className="flex flex-wrap gap-1">
                    {home.buildingAmenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    Book a Tour
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;
