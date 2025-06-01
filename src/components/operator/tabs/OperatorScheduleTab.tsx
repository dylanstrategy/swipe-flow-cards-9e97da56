
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, Wrench } from 'lucide-react';

const OperatorScheduleTab = () => {
  const scheduledItems = [
    {
      id: 1,
      time: '09:00 AM',
      title: 'Property Inspection',
      description: 'Weekly property walk-through',
      type: 'inspection',
      building: 'Building A'
    },
    {
      id: 2,
      time: '10:30 AM',
      title: 'Move-In Inspection',
      description: 'Unit 204 - New resident inspection',
      type: 'move-in',
      building: 'Building A'
    },
    {
      id: 3,
      time: '02:00 PM',
      title: 'Maintenance Review',
      description: 'Weekly maintenance team meeting',
      type: 'meeting',
      building: 'Office'
    },
    {
      id: 4,
      time: '03:30 PM',
      title: 'Leasing Tour',
      description: 'Prospective tenant showing',
      type: 'tour',
      building: 'Building B'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inspection': return <Wrench size={16} className="text-blue-600" />;
      case 'move-in': return <Users size={16} className="text-green-600" />;
      case 'meeting': return <Calendar size={16} className="text-purple-600" />;
      case 'tour': return <Clock size={16} className="text-orange-600" />;
      default: return <Calendar size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Today's Schedule</h1>
        <p className="text-gray-600">March 24, 2025</p>
      </div>

      <div className="space-y-4">
        {scheduledItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <span className="text-sm text-gray-500">{item.time}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{item.description}</p>
                  <p className="text-xs text-gray-500">{item.building}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OperatorScheduleTab;
