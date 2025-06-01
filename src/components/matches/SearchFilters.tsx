
import React from 'react';
import { Button } from '@/components/ui/button';

const SearchFilters = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm overflow-x-auto">
        <div className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
          <span className="text-gray-600">Budget:</span>
          <span className="font-medium">$1,600 – $2,400</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
          <span className="text-gray-600">Move-in:</span>
          <span className="font-medium">May 2024</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
          <span className="text-gray-600">Room:</span>
          <span className="font-medium">Any</span>
        </div>
        <Button size="sm" className="ml-auto flex-shrink-0 text-xs">
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
