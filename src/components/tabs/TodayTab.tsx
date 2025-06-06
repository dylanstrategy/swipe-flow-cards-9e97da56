import React, { useState, useEffect } from 'react';
import MessageModule from '../message/MessageModule';
import ServiceModule from '../service/ServiceModule';
import WorkOrderFlow from '../schedule/WorkOrderFlow';
import WorkOrdersReview from './today/WorkOrdersReview';
import MoveCalendarEvents from '../calendar/MoveCalendarEvents';
import PullToRefresh from '../PullToRefresh';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, isSameDay, differenceInDays, isPast, isToday } from 'date-fns';
import { useProfile } from '@/contexts/ProfileContext';
import { useResident } from '@/contexts/ResidentContext';
import { useLiveCalendarEvents } from '@/hooks/useLiveCalendarEvents';
import { useLiveResident } from '@/contexts/LiveResidentContext';
import ResidentTimeline from '../ResidentTimeline';
import TodayHeader from './today/TodayHeader';
import QuickActionsGrid from './today/QuickActionsGrid';
import MiniCalendar from './today/MiniCalendar';
import EventsList from './today/EventsList';
import PointOfSale from '../PointOfSale';

const TodayTab = () => {
  const { toast } = useToast();
  const { profile, getPersonalizedContext } = useProfile();
  const { canMoveIn, canMoveOut, profile: residentProfile } = useResident();
  const { events: liveEvents, refetch: refetchEvents } = useLiveCalendarEvents();
  const { resident: liveResident } = useLiveResident();
  
  const [showTimeline, setShowTimeline] = useState(false);
  const [showMessageModule, setShowMessageModule] = useState(false);
  const [showServiceModule, setShowServiceModule] = useState(false);
  const [showWorkOrderFlow, setShowWorkOrderFlow] = useState(false);
  const [showWorkOrdersReview, setShowWorkOrdersReview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [messageConfig, setMessageConfig] = useState({
    subject: '',
    recipientType: 'management' as 'management' | 'maintenance' | 'leasing',
    mode: 'compose' as 'compose' | 'reply'
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

  // Convert live calendar events to the format expected by the UI
  const processedEvents = liveEvents.map(event => ({
    id: event.id,
    date: new Date(event.start_time),
    time: format(new Date(event.start_time), 'HH:mm'),
    title: event.title,
    description: event.description || '',
    category: event.event_type,
    priority: event.event_type === 'maintenance' ? 'high' : 'medium',
    dueDate: event.end_time ? new Date(event.end_time) : undefined
  }));

  // Add pet-specific events if user has pets
  const petEvents = hasPets ? [
    {
      id: 101,
      date: new Date(),
      time: '16:00',
      title: `${userPets[0].name}'s Special Offer`,
      description: `Exclusive pet grooming discount for ${userPets[0].name}!`,
      category: 'Pet Service',
      priority: 'low'
    },
    {
      id: 102,
      date: addDays(new Date(), 1),
      time: '18:00',
      title: 'Pet-Friendly Community Event',
      description: `Bring ${userPets.map(pet => pet.name).join(' and ')} to the pet meetup!`,
      category: 'Community Event',
      priority: 'low'
    }
  ] : [];

  const allEvents = [...processedEvents, ...petEvents];

  // Add move-in/move-out blockers as urgent events based on live resident data
  if (liveResident) {
    const moveInCheck = canMoveIn(liveResident.id);
    const moveOutCheck = canMoveOut(liveResident.id);

    if (!moveInCheck.canMove && liveResident.status === 'active') {
      allEvents.push({
        id: 998,
        date: new Date(),
        time: '09:00',
        title: 'Move-In Blocked',
        description: moveInCheck.blockers.join(', '),
        category: 'Alert',
        priority: 'high'
      });
    }

    if (!moveOutCheck.canMove && liveResident.status === 'notice') {
      allEvents.push({
        id: 997,
        date: new Date(),
        time: '09:00',
        title: 'Move-Out Blocked',
        description: moveOutCheck.blockers.join(', '),
        category: 'Alert',
        priority: 'high'
      });
    }
  }

  // Add rent due event based on live resident data
  if (liveResident?.monthly_rent && liveResident?.payment_status !== 'current') {
    const rentDueEvent = {
      id: 999,
      date: new Date(),
      time: '14:00',
      title: 'Rent Payment Due',
      description: `$${liveResident.monthly_rent} due soon`,
      category: 'Payment',
      priority: 'high',
      dueDate: addDays(new Date(), 3)
    };
    allEvents.push(rentDueEvent);
  }

  // Pull to refresh handler
  const handleRefresh = async () => {
    await Promise.all([
      refetchEvents(),
      // Add other data refresh calls here as needed
    ]);
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

  const nextStep = () => {
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

  const getUrgencyClass = (event: any) => {
    if (!event.dueDate) return '';
    
    const daysUntilDue = differenceInDays(event.dueDate, new Date());
    const isOverdue = isPast(event.dueDate) && !isToday(event.dueDate);
    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
    
    if (isOverdue) {
      return 'wiggle-urgent pulse-urgent';
    } else if (isDueSoon && event.priority === 'high') {
      return 'wiggle-urgent';
    }
    
    return '';
  };

  const getRentUrgencyClass = () => {
    if (liveResident?.payment_status === 'late' || liveResident?.payment_status === 'delinquent') {
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

  const renderPersonalizedOffers = () => {
    if (hasPets) {
      return (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            🐾 Special Offers for {userPets.map(pet => pet.name).join(' & ')}
          </h2>
          <PointOfSale 
            context="pet-service" 
            onOfferClick={handleOfferClick}
            petName={userPets[0].name}
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

  if (showWorkOrderFlow) {
    return (
      <WorkOrderFlow
        selectedScheduleType="Work Order"
        currentStep={currentStep}
        onNextStep={() => {}}
        onPrevStep={() => {}}
        onClose={() => setShowWorkOrderFlow(false)}
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

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="px-4 py-6 pb-40">
        <TodayHeader 
          selectedDate={selectedDate}
          weather={weather}
          onTimelineClick={() => setShowTimeline(true)}
        />

        <QuickActionsGrid 
          onAction={() => {}}
          onServiceClick={() => setShowServiceModule(true)}
          onMaintenanceClick={() => setShowWorkOrdersReview(true)}
          getRentUrgencyClass={getRentUrgencyClass}
        />

        {renderPersonalizedOffers()}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isSameDay(selectedDate, new Date()) ? 'Resident Calendar' : 'Calendar'}
          </h2>
          
          <MiniCalendar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            getEventsForDate={getEventsForDate}
          />

          <EventsList 
            events={selectedDateEvents}
            onAction={() => {}}
            onQuickReply={() => {}}
            getSwipeActionsForEvent={() => ({})}
          />

          <MoveCalendarEvents 
            selectedDate={selectedDate}
            onEventClick={(event) => {
              toast({
                title: "Move Task",
                description: `${event.title} - ${event.description}`,
              });
            }}
          />
        </div>
      </div>
    </PullToRefresh>
  );
};

export default TodayTab;
