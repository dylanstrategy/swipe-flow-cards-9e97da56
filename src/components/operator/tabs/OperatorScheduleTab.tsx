
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ScheduleMenu from '../../schedule/ScheduleMenu';
import WorkOrderFlow from '../../schedule/WorkOrderFlow';
import DraggableSuggestionsSection from '../../schedule/DraggableSuggestionsSection';
import SwipeableEventCards from '../../schedule/SwipeableEventCards';
import SwipeableSuggestionCards from '../../schedule/SwipeableSuggestionCards';
import MultidimensionalEventCards from '../../schedule/MultidimensionalEventCards';
import MultidimensionalSuggestionCards from '../../schedule/MultidimensionalSuggestionCards';
import EventMenuCards from '../../schedule/EventMenuCards';
import MessageModule from '../../message/MessageModule';
import ServiceModule from '../../service/ServiceModule';
import UniversalEventDetailModal from '../../events/UniversalEventDetailModal';
import RescheduleFlow from '../../events/RescheduleFlow';
import { EnhancedEvent } from '@/types/events';
import { teamAvailabilityService } from '@/services/teamAvailabilityService';
import HourlyCalendarView from '../../schedule/HourlyCalendarView';
import { sharedEventService } from '@/services/sharedEventService';
import { UniversalEvent } from '@/types/eventTasks';
import { sharedSchedulingService } from '@/services/sharedSchedulingService';

const OperatorScheduleTab = () => {
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

  // State for managing scheduled events using shared service
  const [scheduledEvents, setScheduledEvents] = useState<UniversalEvent[]>([]);

  // Subscribe to shared event service - Operators see ALL events
  useEffect(() => {
    const updateEvents = () => {
      // Operators can see all events since they coordinate everything
      const allEvents = sharedEventService.getAllEvents();
      setScheduledEvents(allEvents);
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
  
  // State for tracking current card indices - moved here to avoid hooks rule violation
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

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

  const handleDropSuggestionInTimeline = (suggestion: any, targetTime?: string) => {
    console.log('OperatorScheduleTab: handleDropSuggestionInTimeline called with:', suggestion, targetTime);
    
    // Check if this is a work order suggestion
    if (suggestion.type === 'work-order' || suggestion.category === 'Maintenance') {
      // Use shared scheduling service for work orders
      const workOrderData = {
        workOrderId: `suggestion-${suggestion.id}`,
        title: suggestion.title,
        description: suggestion.description || 'Maintenance work order',
        category: 'Maintenance',
        priority: suggestion.priority || 'medium',
        assignedResidentId: sharedSchedulingService.getSharedTestResidentId(),
        assignedMaintenanceUserId: sharedSchedulingService.getSharedTestMaintenanceId(),
        estimatedDuration: 120
      };

      const result = sharedSchedulingService.scheduleWorkOrder(
        workOrderData,
        selectedDate,
        targetTime
      );

      if (result.success) {
        // Mark suggestion as scheduled
        setScheduledSuggestionIds(prev => {
          const updated = [...prev, suggestion.id];
          console.log('OperatorScheduleTab: Updated scheduled suggestion IDs:', updated);
          return updated;
        });

        toast({
          title: "Work Order Scheduled!",
          description: `${suggestion.title} scheduled at ${result.scheduledTime} with mutual availability confirmed`,
        });
      } else {
        toast({
          title: "Scheduling Failed",
          description: `Could not find mutual availability for ${suggestion.title}. Please try a different time.`,
          variant: "destructive"
        });
      }
      return;
    }

    // Handle non-work-order suggestions with original logic
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
      console.log('OperatorScheduleTab: Updated scheduled suggestion IDs:', updated);
      return updated;
    });

    toast({
      title: "Task Scheduled!",
      description: `${suggestion.title} scheduled at ${assignedTime} on ${format(selectedDate, 'MMM d, yyyy')}`,
    });
  };

  const handleDropSuggestion = (suggestion: any, date: Date) => {
    console.log('OperatorScheduleTab: handleDropSuggestion called with:', suggestion, date);
    
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
      console.log('OperatorScheduleTab: Updated scheduled suggestion IDs from calendar:', updated);
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
    console.log('Event clicked in OperatorScheduleTab:', event);
    setSelectedUniversalEvent(event);
    setShowUniversalEventDetail(true);
  };

  const handleEventHold = (event: any) => {
    console.log('Event held for options:', event);
    // Could show context menu or options
  };

  const handleEventReschedule = (event: any, newTime: string) => {
    console.log('Handling event reschedule in OperatorScheduleTab:', event, 'to', newTime);
    
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

  // Mock suggestions data - operators see more comprehensive suggestions
  const getSuggestions = () => {
    const baseSuggestions = [
      { id: 1, title: "Schedule maintenance check", description: "Yearly HVAC inspection", priority: 'medium' as const, category: 'Maintenance', type: 'work-order' },
      { id: 2, title: "Process lease renewal", description: "Review and process renewal", priority: 'high' as const, category: 'Leasing' },
      { id: 3, title: "Unit inspection needed", description: "Unit 204 quarterly check", priority: 'medium' as const, category: 'Maintenance', type: 'work-order' },
      { id: 4, title: "Follow up with vendor", description: "Check completion status", priority: 'high' as const, category: 'Vendor Management' },
      { id: 5, title: "Schedule move-in prep", description: "Unit 315 cleaning and setup", priority: 'urgent' as const, category: 'Operations' },
      { id: 6, title: "Review maintenance requests", description: "Weekly team meeting", priority: 'medium' as const, category: 'Management' },
    ];

    return baseSuggestions.filter(s => 
      !scheduledSuggestionIds.includes(s.id) && 
      !completedSuggestionIds.includes(s.id) &&
      !scheduledForLaterIds.includes(s.id)
    );
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

  const handleCardSwipeUp = (cardType: string) => {
    // Auto-schedule the event type for the next available time slot
    const assignedTime = findAvailableTimeSlot(selectedDate);
    
    toast({
      title: "Event Auto-Scheduled!",
      description: `${cardType} scheduled at ${assignedTime} on ${format(selectedDate, 'MMM d, yyyy')}`,
    });
  };

  const handleSuggestionTap = (suggestion: any) => {
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

  const handleEventMenuTap = (menuItem: any) => {
    setSelectedScheduleType(menuItem.title);
    
    if (menuItem.id === 'work-order') {
      setIsCreatingOrder(true);
      setCurrentStep(1);
    } else if (menuItem.id === 'message') {
      setShowMessageModule(true);
    } else if (menuItem.id === 'service') {
      setShowServiceModule(true);
    } else {
      setShowScheduleMenu(true);
    }
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

  if (showRescheduleFlow && selectedEvent) {
    return (
      <RescheduleFlow
        event={selectedEvent}
        onClose={() => {
          setShowRescheduleFlow(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleRescheduleConfirm}
        userRole="operator"
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
    return sharedEventService.getEventsForDate(date)
      .sort((a, b) => a.time.localeCompare(b.time));
  };


  // Create background gradient based on suggestions
  const createMatchingGradient = () => {
    // REAL suggestion colors (matching MultidimensionalSuggestionCards.tsx)
    const getSuggestionColor = (priority: string) => {
      switch (priority) {
        case 'urgent': return '#EF4444';  // Red (from-red-500 to-red-600)
        case 'high': return '#F97316';    // Orange (from-orange-500 to-orange-600)
        case 'medium': return '#EAB308';  // Yellow (from-yellow-500 to-yellow-600)
        case 'low': return '#22C55E';     // Green (from-green-500 to-green-600)
        default: return '#6B7280';        // Gray
      }
    };

    const suggestions = getSuggestions();
    const currentSuggestionColor = getSuggestionColor(suggestions[currentSuggestionIndex]?.priority || 'low');
    
    // Create a subtle gradient based on current suggestion priority
    return `
      radial-gradient(circle at 30% 20%, ${currentSuggestionColor}40, transparent 70%),
      radial-gradient(circle at 70% 80%, ${currentSuggestionColor}30, transparent 70%),
      linear-gradient(135deg, ${currentSuggestionColor}20, ${currentSuggestionColor}10, #f8fafc)
    `;
  };

  return (
    <div 
      className="flex flex-col h-full transition-all duration-700 ease-in-out overflow-hidden"
      style={{ background: createMatchingGradient() }}
    >
      {/* Main content - Card-focused layout */}
      <div className="relative flex-1 overflow-hidden">
        {suggestionsExpanded ? (
          /* Expanded suggestions view - covers whole page */
          <div className="fixed inset-0 bg-white z-40 pt-20">
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Operator Suggestions</h2>
                <button
                  onClick={() => setSuggestionsExpanded(false)}
                  className="text-gray-600 hover:text-gray-900 text-xl p-2"
                >
                  ✕
                </button>
              </div>
              <MultidimensionalSuggestionCards
                suggestions={getSuggestions()}
                onCardTap={handleSuggestionTap}
                onCardSwipeUp={handleSuggestionSwipeUp}
                onCardSwipeDown={handleSuggestionSwipeDown}
                className="flex-1"
              />
            </div>
          </div>
        ) : (
          /* Split screen layout */
          <div className="h-screen flex flex-col">
            {/* Suggestion Queue - Top half (non-complete events) */}
            <div className="flex-1">
              <MultidimensionalSuggestionCards
                suggestions={getSuggestions()}
                onCardTap={handleSuggestionTap}
                onCardSwipeUp={handleSuggestionSwipeUp}
                onCardSwipeDown={handleSuggestionSwipeDown}
                onCurrentIndexChange={setCurrentSuggestionIndex}
                className="h-full"
              />
            </div>
            
            {/* Event Menu - Bottom half (full menu as cards) */}
            <div className="flex-1 bg-white/10 backdrop-blur-sm">
              <EventMenuCards
                onMenuItemTap={handleEventMenuTap}
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorScheduleTab;
