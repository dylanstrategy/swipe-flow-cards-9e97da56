import React, { useState, useEffect } from 'react';
import MessageModule from '../message/MessageModule';
import ServiceModule from '../service/ServiceModule';
import WorkOrderFlow from '../schedule/WorkOrderFlow';
import WorkOrdersReview from './today/WorkOrdersReview';
import WorkOrderTimeline from '../maintenance/WorkOrderTimeline';
import UniversalEventDetailModal from '../events/UniversalEventDetailModal';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, isSameDay, differenceInDays, isPast, isToday } from 'date-fns';
import { useProfile } from '@/contexts/ProfileContext';
import ResidentTimeline from '../ResidentTimeline';
import TodayHeader from './today/TodayHeader';
import QuickActionsGrid from './today/QuickActionsGrid';
import TodayMiniCalendar from './today/TodayMiniCalendar';
import PointOfSale from '../PointOfSale';
import { useRealtimeOverdueDetection } from '@/hooks/useRealtimeOverdueDetection';
import { createTestEvents, getEventsForRole } from '@/data/testEvents';

const TodayTab = () => {
  const { toast } = useToast();
  const { profile, getPersonalizedContext } = useProfile();
  
  const [showTimeline, setShowTimeline] = useState(false);
  const [showMessageModule, setShowMessageModule] = useState(false);
  const [showServiceModule, setShowServiceModule] = useState(false);
  const [showWorkOrderFlow, setShowWorkOrderFlow] = useState(false);
  const [showWorkOrdersReview, setShowWorkOrdersReview] = useState(false);
  const [showWorkOrderTimeline, setShowWorkOrderTimeline] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showUniversalEventDetail, setShowUniversalEventDetail] = useState(false);
  const [selectedUniversalEvent, setSelectedUniversalEvent] = useState<any>(null);
  const [messageConfig, setMessageConfig] = useState({
    subject: '',
    recipientType: 'management' as 'management' | 'maintenance' | 'leasing',
    mode: 'compose' as 'compose' | 'reply'
  });
  const [selectedDate] = useState<Date>(new Date()); // Always today for this tab
  const [weather, setWeather] = useState({ temp: 72, condition: 'Sunny' });

  // Use profile pets instead of hardcoded ones
  const userPets = profile.pets;
  const hasPets = userPets.length > 0;

  // Simulate live weather updates
  useEffect(() => {
    const updateWeather = () => {
      const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Clear'];
      const temps = [68, 70, 72, 74, 76];
      setWeather({
        temp: temps[Math.floor(Math.random() * temps.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)]
      });
    };

    const interval = setInterval(updateWeather, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get shared events and filter by resident role
  const [calendarEvents, setCalendarEvents] = useState(() => {
    const allEvents = createTestEvents();
    return getEventsForRole(allEvents, 'resident');
  });

  // Remove pet events - use shared events only
  const allEvents = calendarEvents;

  // Add special event for rent due
  const rentDueEvent = {
    id: 'rent-999',
    date: new Date(),
    time: '14:00',
    title: 'Rent Payment Due',
    description: '$1,550 due in 3 days',
    category: 'Payment',
    priority: 'high' as const,
    dueDate: addDays(new Date(), 3),
    type: 'payment'
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

  const handleOfferClick = (offer: any) => {
    toast({
      title: "Offer Activated",
      description: `${offer.title} from ${offer.business}`,
    });
  };

  const handleWorkOrderClick = (workOrder: any) => {
    setSelectedWorkOrder(workOrder);
    setShowWorkOrderTimeline(true);
  };

  const handleEventClick = (event: any) => {
    setSelectedUniversalEvent(event);
    setShowUniversalEventDetail(true);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      setShowWorkOrderFlow(false);
      setCurrentStep(1);
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
      setShowWorkOrderFlow(false);
      setCurrentStep(1);
    }
  };

  const handleCloseWorkOrder = () => {
    setShowWorkOrderFlow(false);
    setCurrentStep(1);
  };

  const getEventsForDate = (date: Date) => {
    return allEvents.filter(event => isSameDay(event.date, date))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Use real-time overdue detection for events
  const { isEventOverdue } = useRealtimeOverdueDetection(allEvents);

  const getUrgencyClass = (event: any) => {
    const isOverdue = isEventOverdue(event);
    
    if (isOverdue) {
      return 'wiggle-urgent pulse-urgent';
    }
    
    if (!event.dueDate) return '';
    
    const daysUntilDue = differenceInDays(event.dueDate, new Date());
    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
    
    if (isDueSoon && event.priority === 'high') {
      return 'wiggle-urgent';
    }
    
    return '';
  };

  const getRentUrgencyClass = () => {
    const daysUntilRentDue = 3; // Rent due in 3 days
    if (daysUntilRentDue <= 3) {
      return 'wiggle-urgent';
    }
    return '';
  };

  const getSwipeActionsForEvent = (event: any) => {
    switch (event.category) {
      case 'Work Order':
        return {
          onSwipeRight: {
            label: "Reschedule",
            action: () => handleAction("Requested reschedule", event.title),
            color: "#F59E0B",
            icon: "📅"
          }
        };
      
      case 'Management':
        return {
          onSwipeRight: {
            label: "Archive",
            action: () => handleAction("Archived", event.title),
            color: "#6B7280",
            icon: "📦"
          },
          onSwipeLeft: {
            label: "Quick Reply",
            action: () => handleQuickReply(event.title, 'management'),
            color: "#3B82F6",
            icon: "💬"
          }
        };
      
      case 'Lease':
        return {
          onSwipeRight: {
            label: "Accept",
            action: () => handleAction("Accepted lease renewal", event.title),
            color: "#10B981",
            icon: "✅"
          }
        };
      
      case 'Point of Sale':
        return {
          onSwipeRight: {
            label: "Save to Wallet",
            action: () => handleAction("Saved to wallet", event.title),
            color: "#10B981",
            icon: "💾"
          }
        };
      
      case 'Community Event':
        return {
          onSwipeRight: {
            label: "Confirm Attendance",
            action: () => handleAction("Confirmed attendance", event.title),
            color: "#10B981",
            icon: "✅"
          }
        };

      case 'Payment':
        return {
          onSwipeRight: {
            label: "Pay Now",
            action: () => handleAction("Paid", event.title),
            color: "#10B981",
            icon: "💳"
          }
        };

      case 'Pet Service':
        return {
          onSwipeRight: {
            label: "Book Service",
            action: () => handleAction("Booked pet service", event.title),
            color: "#10B981",
            icon: "🐾"
          }
        };
      
      default:
        return {
          onSwipeRight: {
            label: "View",
            action: () => handleAction("Viewed", event.title),
            color: "#3B82F6",
            icon: "👁️"
          }
        };
    }
  };

  const handleDropSuggestion = (suggestion: any, date: Date) => {
    // For TodayTab, we can show a toast or handle the drop
    toast({
      title: "Suggestion Scheduled!",
      description: `${suggestion.title} scheduled for ${format(date, 'MMM d, yyyy')}`,
    });
  };

  const handleDateSelect = (date: Date) => {
    // For TodayTab, we could navigate to schedule tab or show events for that date
    toast({
      title: "Date Selected",
      description: `Viewing events for ${format(date, 'MMM d, yyyy')}`,
    });
  };

  // NEW: Handle event rescheduling
  const handleEventReschedule = (event: any, newTime: string) => {
    console.log('Handling event reschedule in TodayTab:', event, 'to', newTime);
    
    // Update the event time in both calendar events and pet events
    setCalendarEvents(prevEvents => 
      prevEvents.map(e => 
        e.id === event.id ? { ...e, time: newTime } : e
      )
    );
    
    setPetEvents(prevEvents => 
      prevEvents.map(e => 
        e.id === event.id ? { ...e, time: newTime } : e
      )
    );

    toast({
      title: "Event Rescheduled",
      description: `${event.title} moved to ${formatTime(newTime)}`,
    });
  };

  const renderPersonalizedOffers = () => {
    if (profile.pets.length > 0) {
      return (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            🐾 Special Offers for {profile.pets.map(pet => pet.name).join(' & ')}
          </h2>
          <PointOfSale 
            context="pet-service" 
            onOfferClick={handleOfferClick}
            petName={profile.pets[0].name}
          />
        </div>
      );
    }

    if (profile.selectedLifestyleTags.length > 0) {
      const primaryTag = profile.selectedLifestyleTags[0];
      return (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            {primaryTag.emoji} {primaryTag.label} Offers
          </h2>
          <PointOfSale 
            context={getPersonalizedContext() as 'pet-service' | 'message' | 'event' | 'work-order' | 'appointment' | 'service' | 'document' | 'moving-service' | 'home-setup'} 
            onOfferClick={handleOfferClick}
          />
        </div>
      );
    }

    return null;
  };

  const handleEventUpdate = (updatedEvent: any) => {
    // Update the event in the calendar events state
    setCalendarEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
    ));
    
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
        userRole="resident"
        onEventUpdate={handleEventUpdate}
      />
    );
  }

  if (showWorkOrderTimeline && selectedWorkOrder) {
    return (
      <WorkOrderTimeline
        workOrder={selectedWorkOrder}
        onClose={() => {
          setShowWorkOrderTimeline(false);
          setSelectedWorkOrder(null);
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
              description: "Your work order has been successfully submitted. You'll receive a confirmation email shortly.",
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

  if (showWorkOrdersReview) {
    return (
      <WorkOrdersReview
        onCreateWorkOrder={() => {
          setShowWorkOrdersReview(false);
          setShowWorkOrderFlow(true);
        }}
        onClose={() => setShowWorkOrdersReview(false)}
        onWorkOrderClick={handleWorkOrderClick}
      />
    );
  }

  if (showServiceModule) {
    return <ServiceModule onClose={() => setShowServiceModule(false)} />;
  }

  if (showMessageModule) {
    return (
      <MessageModule
        onClose={() => setShowMessageModule(false)}
        initialSubject={messageConfig.subject}
        recipientType={messageConfig.recipientType}
        mode={messageConfig.mode}
      />
    );
  }

  if (showTimeline) {
    return <ResidentTimeline onClose={() => setShowTimeline(false)} />;
  }

  // Only show today's events
  const todayEvents = getEventsForDate(new Date());

  return (
    <div className="px-4 py-6 pb-24">
      <TodayHeader 
        selectedDate={selectedDate}
        weather={weather}
        onTimelineClick={() => setShowTimeline(true)}
      />

      <QuickActionsGrid 
        onAction={handleAction}
        onServiceClick={() => setShowServiceModule(true)}
        onMaintenanceClick={() => setShowWorkOrdersReview(true)}
        getRentUrgencyClass={() => {
          const daysUntilRentDue = 3; // Rent due in 3 days
          if (daysUntilRentDue <= 3) {
            return 'wiggle-urgent';
          }
          return '';
        }}
      />

      {/* Personalized offers based on lifestyle tags */}
      {renderPersonalizedOffers()}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Events</h2>
        
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

export default TodayTab;
