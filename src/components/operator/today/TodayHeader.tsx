
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

const TodayHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Today's Overview</h1>
          <p className="text-gray-600">Property performance at a glance</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <TrendingUp className="w-4 h-4 mr-2" />
          Show Graphs
        </Button>
      </div>
    </div>
  );
};

export default TodayHeader;
