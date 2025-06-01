
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, Users, Wrench, MessageSquare, Home, FileText, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const OperatorScheduleTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const scheduledItems = [
    {
      id: 1,
      date: new Date(),
      time: '09:00 AM',
      title: 'Unit 204 - HVAC Repair',
      description: 'Scheduled maintenance for reported AC issue',
      type: 'maintenance',
      category: 'Property Services',
      priority: 'urgent',
      building: 'Building A',
      unit: '204'
    },
    {
      id: 2,
      date: new Date(),
      time: '10:30 AM',
      title: 'Move-In Inspection',
      description: 'Unit 156 - New resident move-in inspection',
      type: 'inspection',
      category: 'Community Management',
      priority: 'normal',
      building: 'Building A',
      unit: '156'
    },
    {
      id: 3,
      date: new Date(),
      time: '02:00 PM',
      title: 'Lease Signing',
      description: 'Unit 302 - Lease renewal signing appointment',
      type: 'leasing',
      category: 'Leasing',
      priority: 'normal',
      building: 'Building B',
      unit: '302'
    },
    {
      id: 4,
      date: new Date(),
      time: '03:30 PM',
      title: 'Delinquency Follow-up',
      description: 'Unit 108 - Payment plan discussion',
      type: 'collections',
      category: 'Delinquency',
      priority: 'high',
      building: 'Building A',
      unit: '108'
    },
    {
      id: 5,
      date: new Date(),
      time: '04:00 PM',
      title: 'Renewal Notice',
      description: 'Unit 225 - Lease renewal discussion',
      type: 'renewal',
      category: 'Renewals',
      priority: 'normal',
      building: 'Building C',
      unit: '225'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inspection', label: 'Inspections' },
    { value: 'leasing', label: 'Leasing' },
    { value: 'collections', label: 'Collections' },
    { value: 'renewal', label: 'Renewals' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench size={16} className="text-orange-600" />;
      case 'inspection': return <Home size={16} className="text-blue-600" />;
      case 'leasing': return <FileText size={16} className="text-green-600" />;
      case 'collections': return <DollarSign size={16} className="text-red-600" />;
      case 'renewal': return <Users size={16} className="text-purple-600" />;
      default: return <CalendarIcon size={16} className="text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = scheduledItems.filter(item => {
    const isSameDate = item.date.toDateString() === selectedDate.toDateString();
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    return isSameDate && matchesCategory;
  });

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule</h1>
        <p className="text-gray-600">Manage daily operations and appointments</p>
      </div>

      {/* Calendar */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className={cn("p-3 pointer-events-auto")}
          classNames={{
            day_today: "bg-blue-600 text-white hover:bg-blue-700",
            day_selected: "bg-blue-600 text-white hover:bg-blue-700"
          }}
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Date Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {formatSelectedDate(selectedDate)}
        </h2>
        <p className="text-sm text-gray-600">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} scheduled
        </p>
      </div>

      {/* Scheduled Items */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items scheduled</h3>
              <p className="text-gray-600">
                {selectedCategory === 'all' 
                  ? 'No items are scheduled for this date.' 
                  : `No ${selectedCategory} items are scheduled for this date.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <span className="text-sm text-gray-500">{item.time}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{item.building}</span>
                        {item.unit && (
                          <>
                            <span>•</span>
                            <span>Unit {item.unit}</span>
                          </>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OperatorScheduleTab;
