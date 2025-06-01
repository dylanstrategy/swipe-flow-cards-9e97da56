
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import HomeCard from '@/components/matches/HomeCard';
import SearchFilters from '@/components/matches/SearchFilters';

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

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/discovery')}
            className="p-2"
          >
            <ChevronLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">Find your next home like you'd book your next trip</h1>
            <p className="text-sm text-gray-600 hidden sm:block">Search by date, budget, availability. Book a tour, apply online, and move with ease.</p>
          </div>
        </div>
      </div>

      {/* Fixed Search Filters */}
      <SearchFilters />

      {/* Scrollable Home Listings */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {homes.map((home) => (
              <HomeCard key={home.id} home={home} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;
