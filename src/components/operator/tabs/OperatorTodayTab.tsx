
import React, { useState } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import TodayMiniCalendar from '@/components/tabs/today/TodayMiniCalendar';
import UniversalEventDetailModal from '@/components/events/UniversalEventDetailModal';

const OperatorTodayTab = () => {
  const { toast } = useToast();
  const [selectedDate] = useState<Date>(new Date()); // Always today for this tab
  const [showUniversalEventDetail, setShowUniversalEventDetail] = useState(false);
  const [selectedUniversalEvent, setSelectedUniversalEvent] = useState<any>(null);

  // Enhanced calendar events with realistic examples and times - as state
  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: 1,
      date: new Date(),
      time: '09:00',
      title: 'Move-In Inspection',
      description: 'Unit 4B - Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      category: 'Move-In',
      priority: 'high',
      unit: '4B',
      building: 'Building A',
      type: 'move-in',
      status: 'scheduled',
      residentName: 'Sarah Johnson',
      phone: '(555) 123-4567'
    },
    {
      id: 2,
      date: new Date(),
      time: '10:30',
      title: 'Lease Signing',
      description: 'Unit 2C - Mike Chen renewal',
      category: 'Lease',
      priority: 'medium',
      unit: '2C',
      building: 'Building A',
      type: 'lease',
      status: 'confirmed',
      residentName: 'Mike Chen',
      phone: '(555) 234-5678'
    },
    {
      id: 3,
      date: new Date(),
      time: '11:15',
      title: 'Resident Message',
      description: 'Unit 5A - HVAC repair follow-up',
      category: 'Message',
      priority: 'normal',
      unit: '5A',
      building: 'Building A',
      type: 'message',
      status: 'pending',
      residentName: 'Jennifer Davis',
      phone: '(555) 345-6789'
    },
    {
      id: 4,
      date: new Date(),
      time: '14:00',
      title: 'Tour Scheduled',
      description: 'Studio unit - Alex Rodriguez',
      category: 'Tour',
      priority: 'normal',
      type: 'tour',
      status: 'confirmed',
      residentName: 'Alex Rodriguez',
      phone: '(555) 456-7890'
    },
    {
      id: 5,
      date: new Date(),
      time: '15:30',
      title: 'Move-Out Notice',
      description: 'Unit 1A - Notice processing',
      category: 'Move-Out',
      priority: 'medium',
      unit: '1A',
      building: 'Building A',
      type: 'move-out',
      status: 'processing',
      residentName: 'Robert Wilson',
      phone: '(555) 567-8901'
    },
    {
      id: 6,
      date: new Date(),
      time: '16:15',
      title: 'Payment Follow-up',
      description: 'Unit 3D - Late rent discussion',
      category: 'Payment',
      priority: 'urgent',
      unit: '3D',
      building: 'Building A',
      type: 'payment',
      status: 'urgent',
      residentName: 'Lisa Anderson',
      phone: '(555) 678-9012'
    }
  ]);

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => isSameDay(event.date, date))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleDropSuggestion = (suggestion: any, date: Date) => {
    toast({
      title: "Suggestion Scheduled!",
      description: `${suggestion.title} scheduled for ${format(date, 'MMM d, yyyy')}`,
    });
  };

  const handleDateSelect = (date: Date) => {
    toast({
      title: "Date Selected",
      description: `Viewing events for ${format(date, 'MMM d, yyyy')}`,
    });
  };

  const handleEventReschedule = (event: any, newTime: string) => {
    console.log('Handling event reschedule in OperatorTodayTab:', event, 'to', newTime);
    
    setCalendarEvents(prevEvents => 
      prevEvents.map(e => 
        e.id === event.id ? { ...e, time: newTime } : e
      )
    );

    toast({
      title: "Event Rescheduled",
      description: `${event.title} moved to ${formatTime(newTime)}`,
    });
  };

  const handleEventUpdate = (updatedEvent: any) => {
    setCalendarEvents(prevEvents => 
      prevEvents.map(e => 
        e.id === updatedEvent.id ? updatedEvent : e
      )
    );
    
    toast({
      title: "Event Updated",
      description: `${updatedEvent.title} has been updated successfully.`,
    });
  };

  if (showUniversalEventDetail && selectedUniversalEvent) {
    return (
      <UniversalEventDetailModal
        event={selectedUniversalEvent}
        onClose={() => {
          setShowUniversalEventDetail(false);
          setSelectedUniversalEvent(null);
        }}
        userRole="operator"
        onEventUpdate={handleEventUpdate}
      />
    );
  }

  const todayEvents = getEventsForDate(new Date());

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Today's Schedule</h1>
        <p className="text-lg text-gray-600">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </p>
        <p className="text-blue-600 text-sm font-medium">
          {todayEvents.length} events scheduled
        </p>
      </div>

      {/* Today's Calendar */}
      <div className="mb-6">
        <TodayMiniCalendar 
          selectedDate={selectedDate}
          getEventsForDate={getEventsForDate}
          onDropSuggestion={handleDropSuggestion}
          onDateSelect={handleDateSelect}
          onEventReschedule={handleEventReschedule}
        />
      </div>
    </div>
  );
};

export default OperatorTodayTab;
