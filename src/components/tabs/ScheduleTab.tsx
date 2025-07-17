import React, { useState, useEffect } from 'react';
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
import SwipeableEventCards from '../schedule/SwipeableEventCards';
import SwipeableSuggestionCards from '../schedule/SwipeableSuggestionCards';
import MultidimensionalEventCards from '../schedule/MultidimensionalEventCards';
import MultidimensionalSuggestionCards from '../schedule/MultidimensionalSuggestionCards';
import EventMenuCards from '../schedule/EventMenuCards';
import MessageModule from '../message/MessageModule';
import ServiceModule from '../service/ServiceModule';
import UniversalEventDetailModal from '../events/UniversalEventDetailModal';
import RescheduleFlow from '../events/RescheduleFlow';
import { EnhancedEvent } from '@/types/events';
import { teamAvailabilityService } from '@/services/teamAvailabilityService';
import HourlyCalendarView from '../schedule/HourlyCalendarView';
import { sharedEventService } from '@/services/sharedEventService';
import { UniversalEvent } from '@/types/eventTasks';

const ScheduleTab = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // State for tracking current card indices - moved here to avoid hooks rule violation
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [selectedScheduleType, setSelectedScheduleType] = useState<string>('');
  const [showMessageModule, setShowMessageModule] = useState(false);
  const [showServiceModule, setShowServiceModule] = useState(false);
  const [showWorkOrderFlow, setShowWorkOrderFlow] = useState(false);
  const [showUniversalEventDetail, setShowUniversalEventDetail] = useState(false);
  const [showRescheduleFlow, setShowRescheduleFlow] = useState(false);
  const [selectedUniversalEvent, setSelectedUniversalEvent] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<EnhancedEvent | null>(null);
  const [messageConfig, setMessageConfig] = useState({
    subject: '',
    recipientType: 'management' as 'management' | 'maintenance' | 'leasing',
    mode: 'compose' as 'compose' | 'reply'
  });

  // State for managing scheduled events using shared service
  const [scheduledEvents, setScheduledEvents] = useState<UniversalEvent[]>([]);

  // Subscribe to shared event service
  useEffect(() => {
    const updateEvents = () => {
      const residentEvents = sharedEventService.getEventsForRole('resident');
      setScheduledEvents(residentEvents);
    };

    // Initial load
    updateEvents();

    // Subscribe to changes
    const unsubscribe = sharedEventService.subscribe(updateEvents);
    return unsubscribe;
  }, []);

  // State to track which suggestions have been scheduled and completed
  const [scheduledSuggestionIds, setScheduledSuggestionIds] = useState<number[]>([]);
  const [completedSuggestionIds, setCompletedSuggestionIds] = useState<number[]>([]);
  const [scheduledForLaterIds, setScheduledForLaterIds] = useState<number[]>([]);
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(false);

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

    let proposedStart = 0; // Start from midnight (00:00)
    
    for (const event of eventsForDate) {
      if (proposedStart + duration <= event.start) {
        break;
      }
      proposedStart = Math.max(proposedStart, event.end);
    }
    
    // If we go past 11:30 PM (1410 minutes), wrap around or place at end
    if (proposedStart + duration > 1410) {
      proposedStart = 1410 - duration;
    }
    
    return formatTimeFromMinutes(proposedStart);
  };

  // Helper function to ensure priority is valid
  const normalizePriority = (priority: any): 'high' | 'medium' | 'low' | 'urgent' => {
    if (['high', 'medium', 'low', 'urgent'].includes(priority)) {
      return priority as 'high' | 'medium' | 'low' | 'urgent';
    }
    return 'medium'; // Default fallback
  };

  const handleDropSuggestionInTimeline = (suggestion: any, targetTime?: string) => {
    console.log('ScheduleTab: handleDropSuggestionInTimeline called with:', suggestion, targetTime);
    
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

    // Mark suggestion as scheduled
    setScheduledSuggestionIds(prev => {
      const updated = [...prev, suggestion.id];
      console.log('ScheduleTab: Updated scheduled suggestion IDs:', updated);
      return updated;
    });

    toast({
      title: "Task Scheduled!",
      description: `${suggestion.title} scheduled at ${assignedTime} on ${format(selectedDate, 'MMM d, yyyy')}`,
    });
  };

  const handleDropSuggestion = (suggestion: any, date: Date) => {
    console.log('ScheduleTab: handleDropSuggestion called with:', suggestion, date);
    
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
    
    // Mark suggestion as scheduled
    setScheduledSuggestionIds(prev => {
      const updated = [...prev, suggestion.id];
      console.log('ScheduleTab: Updated scheduled suggestion IDs from calendar:', updated);
      return updated;
    });

    toast({
      title: "Task Scheduled!",
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
      mode: 'compose'
    });
    setShowMessageModule(true);
  };

  const handleEventClick = (event: any) => {
    console.log('Event clicked in ScheduleTab:', event);
    setSelectedUniversalEvent(event);
    setShowUniversalEventDetail(true);
  };

  const handleEventHold = (event: any) => {
    console.log('Event held for options:', event);
    // Could show context menu or options
  };

  const handleEventReschedule = (event: any, newTime: string) => {
    console.log('Handling event reschedule in ScheduleTab:', event, 'to', newTime);
    
    // Use shared service to reschedule
    const success = sharedEventService.rescheduleEvent(event.id, event.date, newTime);
    
    if (success) {
      toast({
        title: "Event Rescheduled",
        description: `${event.title} moved to ${newTime}`,
      });
    }
  };

  const handleReschedule = () => {
    if (!selectedUniversalEvent) return;
    
    const enhancedEvent: EnhancedEvent = {
      id: selectedUniversalEvent.id,
      date: selectedUniversalEvent.date,
      time: selectedUniversalEvent.time,
      title: selectedUniversalEvent.title,
      description: selectedUniversalEvent.description,
      category: selectedUniversalEvent.category,
      priority: selectedUniversalEvent.priority,
      canReschedule: true,
      canCancel: true,
      estimatedDuration: 60,
      rescheduledCount: selectedUniversalEvent.rescheduledCount,
      assignedTeamMember: teamAvailabilityService.assignTeamMember({ category: selectedUniversalEvent.category }),
      residentName: 'Resident',
      phone: '(555) 123-4567',
      unit: selectedUniversalEvent.metadata?.unit,
      building: selectedUniversalEvent.metadata?.building,
      status: selectedUniversalEvent.status
    };
    
    setSelectedEvent(enhancedEvent);
    setShowRescheduleFlow(true);
  };

  const handleRescheduleConfirm = async (rescheduleData: any) => {
    if (!selectedEvent) return;
    
    const success = sharedEventService.rescheduleEvent(
      selectedEvent.id.toString(),
      rescheduleData.newDate,
      rescheduleData.newTime
    );
    
    if (success) {
      setShowRescheduleFlow(false);
      setSelectedEvent(null);
      toast({
        title: "Event Rescheduled",
        description: `${selectedEvent.title} has been rescheduled successfully.`,
      });
    }
  };

  const handleEventUpdate = (updatedEvent: any) => {
    // Update through shared service
    sharedEventService.updateEvent(updatedEvent.id, updatedEvent);
    
    toast({
      title: "Event Updated",
      description: `${updatedEvent.title} has been updated successfully.`,
    });
  };

  // Get real incomplete events as suggestions
  const getSuggestions = () => {
    // Get events from yesterday that have incomplete tasks
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const allEvents = sharedEventService.getEventsForRole('resident');
    const incompleteEvents = allEvents.filter(event => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      const isFromYesterday = eventDate.toDateString() === yesterday.toDateString();
      const hasIncompleteTasks = event.tasks.some(task => !task.isComplete);
      return isFromYesterday && hasIncompleteTasks;
    });

    // Convert real events to suggestion format
    return incompleteEvents.map((event, index) => ({
      id: index + 1, // Use numeric ID for compatibility
      title: event.title,
      description: event.description,
      priority: event.priority,
      category: event.category,
      type: event.type,
      originalEvent: event // Store reference to original event
    }));
  };

  const handleCardTap = (cardType: string) => {
    setSelectedScheduleType(cardType);
    if (cardType === 'Work Order') {
      setIsCreatingOrder(true);
      setCurrentStep(1);
    } else if (cardType === 'Message') {
      setShowMessageModule(true);
    } else if (cardType === 'Service Request') {
      setShowServiceModule(true);
    } else {
      setShowScheduleMenu(true);
    }
  };

  const handleMenuItemTap = (item: any) => {
    console.log('Menu item tapped:', item);
    
    // Route to specific modules/flows based on item type
    switch (item.id) {
      case 'maintenance':
      case 'work-order':
        setShowWorkOrderFlow(true);
        break;
      case 'message':
        setShowMessageModule(true);
        break;
      case 'service':
        setShowServiceModule(true);
        break;
      case 'payment':
      case 'renewal':
      case 'amenity':
      case 'package':
      case 'guest':
      case 'community':
      case 'appointment':
      case 'document':
      case 'inspection':
      case 'meeting':
      case 'follow-up':
      case 'emergency':
        // Create and show universal event for these types
        const newEvent = {
          id: `new-${Date.now()}`,
          type: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          priority: item.id === 'emergency' ? 'urgent' : 'medium',
          date: selectedDate,
          time: '12:00',
          status: 'scheduled',
          tasks: []
        };
        setSelectedUniversalEvent(newEvent);
        setShowUniversalEventDetail(true);
        break;
      default:
        // Fallback to old behavior
        const cardType = item.title;
        handleCardTap(cardType);
    }
  };

  const handleCardSwipeUp = (cardType: string) => {
    // Auto-schedule the event type for the next available time slot
    const assignedTime = findAvailableTimeSlot(selectedDate);
    
    toast({
      title: "Event Auto-Scheduled!",
      description: `${cardType} scheduled at ${assignedTime} on ${format(selectedDate, 'MMM d, yyyy')}`,
    });
  };

  const handleSuggestionTap = (suggestion: any) => {
    console.log('Suggestion tapped in ScheduleTab:', suggestion);
    
    // If suggestion has originalEvent, use that
    if (suggestion.originalEvent) {
      setSelectedUniversalEvent(suggestion.originalEvent);
      setShowUniversalEventDetail(true);
      return;
    }
    
    // Fallback to mock event for demo
    setSelectedUniversalEvent({
      id: suggestion.id.toString(),
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      priority: suggestion.priority,
      date: selectedDate,
      time: '12:00 PM',
      status: 'scheduled'
    });
    setShowUniversalEventDetail(true);
  };

  const handleSuggestionSwipeUp = (suggestion: any) => {
    handleDropSuggestionInTimeline(suggestion);
  };

  const handleSuggestionSwipeDown = (suggestion: any) => {
    setScheduledForLaterIds(prev => [...prev, suggestion.id]);
    toast({
      title: "Scheduled for Later",
      description: `${suggestion.title} saved for later scheduling`,
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
        userRole="resident"
        onEventUpdate={handleEventUpdate}
      />
    );
  }

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

  if (showScheduleMenu) {
    return (
      <ScheduleMenu
        onClose={() => setShowScheduleMenu(false)}
        onScheduleTypeSelect={(type) => {
          setSelectedScheduleType(type);
          setShowScheduleMenu(false);
          if (type === 'Work Order') {
            setIsCreatingOrder(true);
            setCurrentStep(1);
          } else if (type === 'Message') {
            setShowMessageModule(true);
          } else if (type === 'Service Request') {
            setShowServiceModule(true);
          }
        }}
      />
    );
  }

  if (showWorkOrderFlow) {
    return (
      <WorkOrderFlow
        selectedScheduleType="Work Order"
        currentStep={currentStep}
        onNextStep={() => {
          if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
          } else {
            setShowWorkOrderFlow(false);
            setCurrentStep(1);
            toast({
              title: "Work Order Submitted",
              description: "Your work order has been successfully submitted.",
            });
          }
        }}
        onPrevStep={() => {
          if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
          } else {
            setShowWorkOrderFlow(false);
            setCurrentStep(1);
          }
        }}
        onClose={() => {
          setShowWorkOrderFlow(false);
          setCurrentStep(1);
        }}
      />
    );
  }

  if (isCreatingOrder && selectedScheduleType === 'Work Order') {
    return (
      <WorkOrderFlow
        selectedScheduleType={selectedScheduleType}
        currentStep={currentStep}
        onNextStep={() => {
          if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
          } else {
            setIsCreatingOrder(false);
            setCurrentStep(1);
            setSelectedScheduleType('');
            toast({
              title: "Work Order Submitted",
              description: "Your work order has been successfully submitted.",
            });
          }
        }}
        onPrevStep={() => {
          if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
          } else {
            setIsCreatingOrder(false);
            setCurrentStep(1);
            setSelectedScheduleType('');
          }
        }}
        onClose={() => {
          setIsCreatingOrder(false);
          setCurrentStep(1);
          setSelectedScheduleType('');
        }}
      />
    );
  }

  if (showMessageModule) {
    return (
      <MessageModule
        onClose={() => {
          setShowMessageModule(false);
          setSelectedScheduleType('');
        }}
        initialSubject={messageConfig.subject}
        recipientType={messageConfig.recipientType}
        mode={messageConfig.mode}
      />
    );
  }

  if (showServiceModule) {
    return (
      <ServiceModule
        onClose={() => {
          setShowServiceModule(false);
          setSelectedScheduleType('');
        }}
      />
    );
  }

  const getEventsForDate = (date: Date) => {
    return sharedEventService.getEventsForRoleAndDate('resident', date)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // Create background gradient based on suggestions
  const createMatchingGradient = () => {
    const suggestions = getSuggestions();
    const currentSuggestion = suggestions[currentSuggestionIndex];
    
    if (!currentSuggestion) {
      return '#f8fafc'; // Light gray-white background
    }
    
    // Get gradient color based on current suggestion priority - same as operator
    const getSuggestionColor = (priority: string) => {
      switch (priority) {
        case 'urgent': return '#EF4444';  // Red
        case 'high': return '#F97316';    // Orange
        case 'medium': return '#EAB308';  // Yellow
        case 'low': return '#22C55E';     // Green
        default: return '#6B7280';        // Gray
      }
    };
    
    const currentSuggestionColor = getSuggestionColor(currentSuggestion.priority);
    
    // Create a subtle gradient based on current suggestion priority - same as operator
    return `
      radial-gradient(circle at 30% 20%, ${currentSuggestionColor}40, transparent 70%),
      radial-gradient(circle at 70% 80%, ${currentSuggestionColor}30, transparent 70%),
      linear-gradient(135deg, ${currentSuggestionColor}20, ${currentSuggestionColor}10, #f8fafc)
    `;
  };


  return (
    <div 
      className="min-h-screen transition-all duration-700 ease-in-out pb-20 overflow-x-hidden"
      style={{ background: createMatchingGradient() }}
    >
      {/* Main content - Full page scroll layout */}
      <div className="flex flex-col overflow-x-hidden">
        {/* Suggestions Section */}
        <div className="flex-shrink-0">
          <MultidimensionalSuggestionCards
            suggestions={[]} // Not used anymore - cards generated internally
            onCardTap={handleSuggestionTap}
            onCardSwipeUp={handleSuggestionSwipeUp}
            onCardSwipeDown={handleSuggestionSwipeDown}
          />
        </div>
        
        {/* Swipe Hint - Aligned to Event Menu */}
        <div className="text-center px-4 pb-4">
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            <span className="block sm:inline">Swipe left or right to explore</span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline">Tap to view</span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline">Swipe up to schedule</span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline">Swipe down for later</span>
          </p>
        </div>

        {/* Event Menu Section */}
        <div className="flex-shrink-0">
          <EventMenuCards
            onMenuItemTap={handleMenuItemTap}
            userRole="resident"
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab;
