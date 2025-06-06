import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ScheduleMenu from '../schedule/ScheduleMenu';
import WorkOrderFlow from '../schedule/WorkOrderFlow';
import DraggableSuggestionsSection from '../schedule/DraggableSuggestionsSection';
import DroppableCalendar from '../schedule/DroppableCalendar';
import MessageModule from '../message/MessageModule';
import ServiceModule from '../service/ServiceModule';
import UniversalEventDetailModal from '../events/UniversalEventDetailModal';
import RescheduleFlow from '../events/RescheduleFlow';
import { EnhancedEvent } from '@/types/events';
import { teamAvailabilityService } from '@/services/teamAvailabilityService';
import HourlyCalendarView from '../schedule/HourlyCalendarView';

const ScheduleTab = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [selectedScheduleType, setSelectedScheduleType] = useState<string>('');
  const [showMessageModule, setShowMessageModule] = useState(false);
  const [showServiceModule, setShowServiceModule] = useState(false);
  const [showUniversalEventDetail, setShowUniversalEventDetail] = useState(false);
  const [showRescheduleFlow, setShowRescheduleFlow] = useState(false);
  const [selectedUniversalEvent, setSelectedUniversalEvent] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<EnhancedEvent | null>(null);
  const [messageConfig, setMessageConfig] = useState({
    subject: '',
    recipientType: 'management' as 'management' | 'maintenance' | 'leasing',
    mode: 'compose' as 'compose' | 'reply'
  });

  // State for managing scheduled events including dropped suggestions
  const [scheduledEvents, setScheduledEvents] = useState([
    {
      id: 1,
      date: new Date(),
      time: '09:00',
      title: 'Work Order',
      description: 'Broken outlet - Unit 4B',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      category: 'Work Order',
      priority: 'high',
      unit: '4B',
      building: 'Building A',
      dueDate: addDays(new Date(), -1),
      isDroppedSuggestion: false,
      type: 'maintenance'
    },
    {
      id: 2,
      date: new Date(),
      time: '10:30',
      title: 'Message from Management',
      description: 'Please submit your lease renewal documents by Friday',
      category: 'Management',
      priority: 'medium',
      isDroppedSuggestion: false,
      type: 'message'
    },
    {
      id: 3,
      date: new Date(),
      time: '11:00',
      title: 'Lease Renewal',
      description: 'New rent: $1,550/month starting March 1st',
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400',
      category: 'Lease',
      priority: 'high',
      unit: '204',
      building: 'Building A',
      dueDate: addDays(new Date(), 2),
      isDroppedSuggestion: false,
      type: 'lease'
    },
    {
      id: 4,
      date: addDays(new Date(), 1),
      time: '14:00',
      title: 'Rooftop BBQ Social',
      description: 'Community event - RSVP required',
      category: 'Community Event',
      priority: 'low',
      isDroppedSuggestion: false,
      type: 'tour'
    },
    {
      id: 5,
      date: addDays(new Date(), 2),
      time: '09:00',
      title: 'HVAC Maintenance',
      description: 'Filter replacement scheduled',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      category: 'Work Order',
      priority: 'medium',
      unit: '204',
      building: 'Building A',
      isDroppedSuggestion: false,
      type: 'maintenance'
    }
  ]);

  // State to track which suggestions have been scheduled
  const [scheduledSuggestionIds, setScheduledSuggestionIds] = useState<number[]>([]);

  const convertTimeToMinutes = (timeString: string): number => {
    if (!timeString) return 0;
    
    if (timeString.includes('AM') || timeString.includes('PM')) {
      const [time, period] = timeString.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = (hours % 12) * 60 + minutes;
      if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) totalMinutes = minutes;
      return totalMinutes;
    }
    
    // Handle 24-hour format (HH:mm)
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTimeFromMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const isSameDateSafe = (date1: any, date2: Date): boolean => {
    try {
      const d1 = date1 instanceof Date ? date1 : new Date(date1);
      const d2 = date2 instanceof Date ? date2 : new Date(date2);
      return format(d1, 'yyyy-MM-dd') === format(d2, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Date comparison error:', error);
      return false;
    }
  };

  const findAvailableTimeSlot = (date: Date, duration: number = 60): string => {
    const eventsForDate = scheduledEvents
      .filter(event => isSameDateSafe(event.date, date))
      .map(event => ({
        start: convertTimeToMinutes(event.time),
        end: convertTimeToMinutes(event.time) + 60 // Assume 1 hour duration
      }))
      .sort((a, b) => a.start - b.start);

    let proposedStart = 540;
    
    for (const event of eventsForDate) {
      if (proposedStart + duration <= event.start) {
        break;
      }
      proposedStart = Math.max(proposedStart, event.end);
    }
    
    if (proposedStart + duration > 1080) {
      proposedStart = 1080 - duration;
    }
    
    return formatTimeFromMinutes(proposedStart);
  };

  const handleDropSuggestionInTimeline = (suggestion: any, targetTime?: string) => {
    let assignedTime: string;
    
    if (targetTime) {
      assignedTime = targetTime;
    } else {
      assignedTime = findAvailableTimeSlot(selectedDate);
    }

    const isDuplicate = scheduledEvents.some(event => 
      isSameDateSafe(event.date, selectedDate) && 
      event.time === assignedTime && 
      event.title === suggestion.title
    );

    if (isDuplicate) {
      toast({
        title: "Event Already Exists",
        description: `${suggestion.title} is already scheduled at ${assignedTime}`,
        variant: "destructive"
      });
      return;
    }

    const newEvent = {
      id: Date.now() + Math.random(), // More unique ID
      date: new Date(selectedDate), // Create new Date object to avoid circular references
      time: assignedTime,
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.type,
      priority: suggestion.priority,
      isDroppedSuggestion: true,
      type: suggestion.type.toLowerCase()
    };

    console.log('Adding new event:', newEvent);
    
    setScheduledEvents(prev => {
      const updated = [...prev, newEvent];
      console.log('Updated scheduled events:', updated);
      return updated;
    });
    
    setScheduledSuggestionIds(prev => [...prev, suggestion.id]);

    toast({
      title: "Event Scheduled!",
      description: `${suggestion.title} scheduled at ${assignedTime} on ${format(selectedDate, 'MMM d, yyyy')}`,
    });
  };

  const handleDropSuggestion = (suggestion: any, date: Date) => {
    const assignedTime = findAvailableTimeSlot(date);
    
    const isDuplicate = scheduledEvents.some(event => 
      isSameDateSafe(event.date, date) && 
      event.time === assignedTime && 
      event.title === suggestion.title
    );

    if (isDuplicate) {
      toast({
        title: "Event Already Exists",
        description: `${suggestion.title} is already scheduled at ${assignedTime}`,
        variant: "destructive"
      });
      return;
    }
    
    const newEvent = {
      id: Date.now() + Math.random(), // More unique ID
      date: new Date(date), // Create new Date object to avoid circular references
      time: assignedTime,
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.type,
      priority: suggestion.priority,
      isDroppedSuggestion: true,
      type: suggestion.type.toLowerCase()
    };

    console.log('Adding calendar drop event:', newEvent);

    setScheduledEvents(prev => {
      const updated = [...prev, newEvent];
      console.log('Updated scheduled events from calendar:', updated);
      return updated;
    });
    
    setScheduledSuggestionIds(prev => [...prev, suggestion.id]);

    toast({
      title: "Event Scheduled!",
      description: `${suggestion.title} scheduled for ${format(date, 'MMM d, yyyy')}`,
    });
  };

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  const handleQuickReply = (subject: string, recipientType: 'management' | 'maintenance' | 'leasing' = 'management') => {
    setMessageConfig({
      subject: `Re: ${subject}`,
      recipientType,
      mode: 'reply'
    });
    setShowMessageModule(true);
  };

  const handleEventClick = (event: any) => {
    setSelectedUniversalEvent(event);
    setShowUniversalEventDetail(true);
  };

  const handleEventHold = (event: any) => {
    const enhancedEvent: EnhancedEvent = {
      id: event.id,
      date: event.date,
      time: event.time,
      title: event.title,
      description: event.description,
      category: event.category,
      priority: event.priority,
      canReschedule: true,
      canCancel: true,
      estimatedDuration: 60,
      rescheduledCount: 0,
      assignedTeamMember: teamAvailabilityService.assignTeamMember({ category: event.category }),
      residentName: 'John Doe',
      phone: '(555) 123-4567',
      unit: event.unit,
      building: event.building
    };
    
    setSelectedEvent(enhancedEvent);
    setShowRescheduleFlow(true); // Go directly to reschedule flow
  };

  const handleRescheduleConfirm = () => {
    toast({
      title: "Event Rescheduled",
      description: `${selectedEvent?.title} has been rescheduled successfully.`,
    });
    setShowRescheduleFlow(false);
    setSelectedEvent(null);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCreatingOrder(false);
      setCurrentStep(1);
      setShowScheduleMenu(false);
      toast({
        title: "Work Order Submitted",
        description: "Your work order has been successfully submitted. You'll receive a confirmation email shortly.",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setIsCreatingOrder(false);
      setShowScheduleMenu(true);
    }
  };

  const startScheduling = (type: string) => {
    setSelectedScheduleType(type);
    if (type === 'Work Order') {
      setIsCreatingOrder(true);
      setShowScheduleMenu(false);
      setCurrentStep(1);
    } else if (type === 'Message') {
      setMessageConfig({
        subject: '',
        recipientType: 'management',
        mode: 'compose'
      });
      setShowMessageModule(true);
      setShowScheduleMenu(false);
    } else if (type === 'Service') {
      setShowServiceModule(true);
      setShowScheduleMenu(false);
    } else {
      toast({
        title: `${type} Selected`,
        description: `${type} flow coming soon!`,
      });
      setShowScheduleMenu(false);
    }
  };

  const handleCloseWorkOrder = () => {
    setIsCreatingOrder(false);
    setCurrentStep(1);
    setShowScheduleMenu(false);
  };

  const handleCloseMessage = () => {
    setShowMessageModule(false);
    setShowScheduleMenu(false);
  };

  const handleCloseService = () => {
    setShowServiceModule(false);
    setShowScheduleMenu(false);
  };

  const getEventsForDate = (date: Date) => {
    const eventsForDate = scheduledEvents.filter(event => isSameDateSafe(event.date, date))
      .sort((a, b) => {
        const timeA = convertTimeToMinutes(a.time);
        const timeB = convertTimeToMinutes(b.time);
        return timeA - timeB;
      });
    
    console.log(`Events for ${format(date, 'MMM d')}:`, eventsForDate);
    return eventsForDate;
  };

  const hasEventsOnDate = (date: Date) => {
    return scheduledEvents.some(event => isSameDateSafe(event.date, date));
  };

  if (showRescheduleFlow && selectedEvent) {
    return (
      <RescheduleFlow
        event={selectedEvent}
        onClose={() => {
          setShowRescheduleFlow(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleRescheduleConfirm}
        userRole="resident"
      />
    );
  }

  if (showUniversalEventDetail && selectedUniversalEvent) {
    return (
      <UniversalEventDetailModal
        event={selectedUniversalEvent}
        onClose={() => {
          setShowUniversalEventDetail(false);
          setSelectedUniversalEvent(null);
        }}
        userRole="resident"
      />
    );
  }

  if (showServiceModule) {
    return <ServiceModule onClose={handleCloseService} />;
  }

  if (showMessageModule) {
    return (
      <MessageModule
        onClose={handleCloseMessage}
        initialSubject={messageConfig.subject}
        recipientType={messageConfig.recipientType}
        mode={messageConfig.mode}
      />
    );
  }

  if (isCreatingOrder) {
    return (
      <WorkOrderFlow
        selectedScheduleType={selectedScheduleType}
        currentStep={currentStep}
        onNextStep={nextStep}
        onPrevStep={prevStep}
        onClose={handleCloseWorkOrder}
      />
    );
  }

  if (showScheduleMenu) {
    return (
      <ScheduleMenu
        onSelectType={startScheduling}
        onClose={() => setShowScheduleMenu(false)}
      />
    );
  }

  return (
    <div className="px-4 py-6 pb-24 relative bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-center sm:justify-start text-left font-normal shadow-sm w-12 sm:w-[240px]"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline sm:ml-2">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              classNames={{
                day_today: "bg-blue-600 text-white hover:bg-blue-700",
                day_selected: "bg-blue-600 text-white hover:bg-blue-700"
              }}
              modifiers={{
                hasEvents: (date) => hasEventsOnDate(date)
              }}
              modifiersClassNames={{
                hasEvents: "after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-orange-500 after:rounded-full after:shadow-sm relative"
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <button 
        onClick={() => setShowScheduleMenu(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all duration-200 hover:scale-110 z-50"
      >
        <Plus className="text-white" size={28} />
      </button>

      <div className="mb-6">
        <HourlyCalendarView
          selectedDate={selectedDate}
          events={getEventsForDate(selectedDate)}
          onDropSuggestion={handleDropSuggestionInTimeline}
          onEventClick={handleEventClick}
          onEventHold={handleEventHold}
        />
      </div>

      <DraggableSuggestionsSection 
        selectedDate={selectedDate}
        onSchedule={startScheduling}
        onAction={handleAction}
        scheduledSuggestionIds={scheduledSuggestionIds}
      />
    </div>
  );
};

export default ScheduleTab;
