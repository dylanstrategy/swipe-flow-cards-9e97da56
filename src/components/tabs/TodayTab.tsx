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

  // Enhanced calendar events with realistic examples and times - now as state
  const [calendarEvents, setCalendarEvents] = useState([
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
      type: 'lease'
    },
    {
      id: 4,
      date: new Date(),
      time: '14:00',
      title: 'Local Business Offer',
      description: '20% OFF at Joe\'s Burger Joint - Show this message',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      category: 'Point of Sale',
      priority: 'low',
      type: 'message'
    },
    {
      id: 5,
      date: addDays(new Date(), 1),
      time: '14:00',
      title: 'Rooftop BBQ Social',
      description: 'Community event - RSVP required',
      category: 'Community Event',
      priority: 'low',
      type: 'tour'
    },
    {
      id: 6,
      date: addDays(new Date(), 2),
      time: '09:00',
      title: 'HVAC Maintenance',
      description: 'Filter replacement scheduled',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      category: 'Work Order',
      priority: 'medium',
      unit: '204',
      building: 'Building A',
      type: 'maintenance'
    }
  ]);

  // Add pet-specific events if user has pets - also as state
  const [petEvents, setPetEvents] = useState(() => 
    profile.pets.length > 0 ? [
      {
        id: 101,
        date: new Date(),
        time: '16:00',
        title: `${profile.pets[0].name}'s Special Offer`,
        description: `Exclusive pet grooming discount for ${profile.pets[0].name}!`,
        category: 'Pet Service',
        priority: 'low',
        type: 'message'
      },
      {
        id: 102,
        date: addDays(new Date(), 1),
        time: '18:00',
        title: 'Pet-Friendly Community Event',
        description: `Bring ${profile.pets.map(pet => pet.name).join(' and ')} to the pet meetup!`,
        category: 'Community Event',
        priority: 'low',
        type: 'tour'
      }
    ] : []
  );

  const allEvents = [...calendarEvents, ...petEvents];

  // Add special event for rent due
  const rentDueEvent = {
    id: 999,
    date: new Date(),
    time: '14:00',
    title: 'Rent Payment Due',
    description: '$1,550 due in 3 days',
    category: 'Payment',
    priority: 'high',
    dueDate: addDays(new Date(), 3), // Due in 3 days
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
            context={getPersonalizedContext()} 
            onOfferClick={handleOfferClick}
          />
        </div>
      );
    }

    return null;
  };

  const handleEventUpdate = (updatedEvent: any) => {
    // For TodayTab, we would typically refresh the events from the source
    // Since we're using static data, we'll just show a success message
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today</h2>
        
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
