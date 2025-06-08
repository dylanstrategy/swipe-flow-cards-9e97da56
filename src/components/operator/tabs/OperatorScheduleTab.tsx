import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { getEventTypes, getEventType } from '@/services/eventTypeService';
import { EventType } from '@/types/eventTasks';
import UniversalEventCreationFlow from '@/components/events/UniversalEventCreationFlow';
import UniversalEventDetailModal from '@/components/events/UniversalEventDetailModal';
import { Role } from '@/types/roles';

interface ScheduledEvent {
  id: string | number;
  date: Date;
  time: string;
  title: string;
  description: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: string;
  category: string;
  building?: string;
  unit?: string;
}

const OperatorScheduleTab = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [events, setEvents] = useState<ScheduledEvent[]>([]);

  const eventTypes = getEventTypes();

  useEffect(() => {
    document.title = 'Operator Schedule | CRM';
  }, []);

  useEffect(() => {
    // Sample events for demonstration
    const sampleEvents: ScheduledEvent[] = [
      {
        id: 1,
        date: new Date(),
        time: "09:00",
        title: "Move-In Process",
        description: "Unit 1A - Sarah Johnson",
        type: "move-in",
        priority: "high",
        status: "confirmed",
        category: "Resident Services",
        building: "Building A",
        unit: "1A"
      },
      {
        id: 2,
        date: new Date(),
        time: "10:30",
        title: "Lease Signing",
        description: "Unit 2C - Mike Chen renewal",
        type: "lease-signing",
        priority: "medium",
        status: "confirmed",
        category: "Leasing",
        building: "Building B",
        unit: "2C"
      },
      {
        id: 3,
        date: addDays(new Date(), 1),
        time: "14:00",
        title: "Property Tour",
        description: "Prospect: Emily Davis",
        type: "tour",
        priority: "medium",
        status: "confirmed",
        category: "Leasing",
        building: "Building A",
        unit: "3B"
      },
      {
        id: 4,
        date: addDays(new Date(), 2),
        time: "11:00",
        title: "Work Order",
        description: "Kitchen faucet repair - Unit 4D",
        type: "work-order",
        priority: "urgent",
        status: "confirmed",
        category: "Maintenance",
        building: "Building C",
        unit: "4D"
      }
    ];
    setEvents(sampleEvents);
  }, []);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.date, date) &&
      (filterType === 'all' || event.category.toLowerCase() === filterType) &&
      (searchTerm === '' || 
       event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       event.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    const eventType = getEventType(type);
    return eventType?.icon || '📅';
  };

  const handleCreateEvent = () => {
    setShowCreateFlow(true);
  };

  const handleEventTypeSelect = (eventTypeId: string) => {
    const eventType = getEventType(eventTypeId);
    setSelectedEventType(eventType || null);
  };

  const handleEventCreated = (newEvent: any) => {
    console.log('New event created:', newEvent);
    // Add the new event to the events list
    const scheduledEvent: ScheduledEvent = {
      id: newEvent.id,
      date: newEvent.date,
      time: newEvent.time,
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.type,
      priority: newEvent.priority,
      status: newEvent.status,
      category: newEvent.category,
      building: newEvent.metadata?.building,
      unit: newEvent.metadata?.unit
    };
    setEvents(prev => [...prev, scheduledEvent]);
    setShowCreateFlow(false);
    setSelectedEventType(null);
  };

  const handleEventClick = (event: ScheduledEvent) => {
    setSelectedEvent(event);
  };

  const handleEventUpdate = (updatedEvent: any) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
    ));
  };

  if (showCreateFlow) {
    return (
      <UniversalEventCreationFlow
        onClose={() => {
          setShowCreateFlow(false);
          setSelectedEventType(null);
        }}
        onEventCreated={handleEventCreated}
        preselectedEventType={selectedEventType}
        userRole="operator"
      />
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Schedule Management</h2>
          <p className="text-gray-600">Manage events, appointments, and tasks</p>
        </div>
        <Button onClick={handleCreateEvent} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="leasing">Leasing</option>
          <option value="resident services">Resident Services</option>
          <option value="maintenance">Maintenance</option>
          <option value="community">Community</option>
          <option value="finance">Finance</option>
        </select>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(addDays(currentDate, -7))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(addDays(currentDate, 7))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="p-4 text-center font-medium text-gray-600 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {weekDays.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                  {isToday && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                      Today
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                      className="p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: getPriorityColor(event.priority).split(' ')[0] }}
                    >
                      <div className="flex items-center gap-1">
                        <span>{getEventTypeIcon(event.type)}</span>
                        <span className="font-medium truncate">{event.time}</span>
                      </div>
                      <div className="truncate">{event.title}</div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <UniversalEventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          userRole="operator"
          onEventUpdate={handleEventUpdate}
        />
      )}
    </div>
  );
};

export default OperatorScheduleTab;
