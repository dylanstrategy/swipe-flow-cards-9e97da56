import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import PullToRefresh from '../PullToRefresh';
import { useCalendarEvents } from '@/hooks/useSupabaseData';
import ScheduleMenu from '../schedule/ScheduleMenu';
import WorkOrderFlow from '../schedule/WorkOrderFlow';
import SuggestionsSection from '../schedule/SuggestionsSection';
import ScheduledItemsTimeline from '../schedule/ScheduledItemsTimeline';
import MessageModule from '../message/MessageModule';
import ServiceModule from '../service/ServiceModule';
import MiniCalendar from './today/MiniCalendar';
import SwipeCard from '../SwipeCard';
import { format, isSameDay } from 'date-fns';

const ScheduleTab = () => {
  const { toast } = useToast();
  const { events, refetch: refetchEvents } = useCalendarEvents();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [selectedScheduleType, setSelectedScheduleType] = useState<string>('');
  const [showMessageModule, setShowMessageModule] = useState(false);
  const [showServiceModule, setShowServiceModule] = useState(false);
  const [messageConfig, setMessageConfig] = useState({
    subject: '',
    recipientType: 'management' as 'management' | 'maintenance' | 'leasing',
    mode: 'compose' as 'compose' | 'reply'
  });

  const handleRefresh = async () => {
    await refetchEvents();
  };

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
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
      // For other types, you can implement different flows
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

  // Convert live calendar events to the format expected by the UI
  const processedEvents = events.map(event => ({
    id: event.id,
    date: new Date(event.event_date),
    time: event.event_time || '09:00',
    title: event.title,
    description: event.description || '',
    category: event.event_type,
    priority: event.event_type === 'maintenance' ? 'high' : 'medium'
  }));

  const getEventsForDate = (date: Date) => {
    return processedEvents.filter(event => isSameDay(event.date, date))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getSwipeActionsForEvent = (event: any) => {
    // Load user's swipe preferences from localStorage
    const swipePreferences = JSON.parse(localStorage.getItem('swipeGesturePreferences') || '{}');
    
    const defaultActions = {
      maintenance: {
        left: { label: "Reschedule", action: () => handleAction("Reschedule", event.title), color: "#F59E0B", icon: "📅" },
        right: { label: "Complete", action: () => handleAction("Complete", event.title), color: "#10B981", icon: "✅" }
      },
      community: {
        left: { label: "Not Interested", action: () => handleAction("Not Interested", event.title), color: "#EF4444", icon: "❌" },
        right: { label: "RSVP", action: () => handleAction("RSVP", event.title), color: "#10B981", icon: "✅" }
      },
      personal: {
        left: { label: "Archive", action: () => handleAction("Archive", event.title), color: "#6B7280", icon: "📦" },
        right: { label: "Reminder", action: () => handleAction("Reminder", event.title), color: "#3B82F6", icon: "🔔" }
      }
    };

    const eventType = event.category === 'maintenance' ? 'workorder' : 
                     event.category === 'community' ? 'event' : 'message';
    
    const userPreference = swipePreferences[eventType];
    const defaultAction = defaultActions[event.category as keyof typeof defaultActions] || defaultActions.personal;
    
    return {
      onSwipeLeft: userPreference?.left || defaultAction?.left || { label: "Archive", action: () => handleAction("Archive", event.title), color: "#6B7280", icon: "📦" },
      onSwipeRight: userPreference?.right || defaultAction?.right || { label: "Complete", action: () => handleAction("Complete", event.title), color: "#10B981", icon: "✅" }
    };
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

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

  if (isCreatingOrder) {
    return (
      <WorkOrderFlow
        selectedScheduleType={selectedScheduleType}
        currentStep={currentStep}
        onNextStep={() => {}}
        onPrevStep={() => {}}
        onClose={() => setIsCreatingOrder(false)}
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
    <div className="relative min-h-screen">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="px-4 py-6 pb-32 overflow-y-auto max-h-screen">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          </div>
          
          {/* Calendar */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar</h2>
            <MiniCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              getEventsForDate={getEventsForDate}
            />
          </div>

          {/* Selected Date Events with Swipe Actions */}
          {selectedDateEvents.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {isSameDay(selectedDate, new Date()) ? "Today's Events" : `Events for ${format(selectedDate, 'MMM d')}`}
              </h2>
              <div className="space-y-3">
                {selectedDateEvents.map((event) => {
                  const swipeActions = getSwipeActionsForEvent(event);
                  
                  return (
                    <SwipeCard
                      key={event.id}
                      onSwipeRight={swipeActions.onSwipeRight}
                      onSwipeLeft={swipeActions.onSwipeLeft}
                      onTap={() => handleAction("Viewed", event.title)}
                      onHold={() => {
                        // Create context menu for desktop
                        const contextMenu = document.createElement('div');
                        contextMenu.className = 'fixed bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50';
                        contextMenu.style.left = '50%';
                        contextMenu.style.top = '50%';
                        contextMenu.style.transform = 'translate(-50%, -50%)';
                        
                        const leftOption = document.createElement('button');
                        leftOption.className = 'block w-full text-left px-3 py-2 hover:bg-gray-100 rounded';
                        leftOption.textContent = `${swipeActions.onSwipeLeft.icon} ${swipeActions.onSwipeLeft.label}`;
                        leftOption.onclick = () => {
                          swipeActions.onSwipeLeft.action();
                          document.body.removeChild(contextMenu);
                        };
                        
                        const rightOption = document.createElement('button');
                        rightOption.className = 'block w-full text-left px-3 py-2 hover:bg-gray-100 rounded';
                        rightOption.textContent = `${swipeActions.onSwipeRight.icon} ${swipeActions.onSwipeRight.label}`;
                        rightOption.onclick = () => {
                          swipeActions.onSwipeRight.action();
                          document.body.removeChild(contextMenu);
                        };
                        
                        contextMenu.appendChild(leftOption);
                        contextMenu.appendChild(rightOption);
                        document.body.appendChild(contextMenu);
                        
                        setTimeout(() => {
                          const handleClickOutside = () => {
                            if (document.body.contains(contextMenu)) {
                              document.body.removeChild(contextMenu);
                            }
                            document.removeEventListener('click', handleClickOutside);
                          };
                          document.addEventListener('click', handleClickOutside);
                        }, 100);
                      }}
                    >
                      <div className="flex items-center p-4 bg-white rounded-lg border-l-4 border-blue-500">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                            <span className="text-sm text-gray-500">{formatTime(event.time)}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{event.description}</p>
                          <div className="mt-2">
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              event.priority === 'high' ? "bg-red-100 text-red-800" :
                              event.priority === 'medium' ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            )}>
                              {event.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </SwipeCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* Daily Suggestions */}
          <SuggestionsSection 
            onSchedule={startScheduling}
            onAction={handleAction}
          />

          {/* Scheduled Items */}
          <ScheduledItemsTimeline
            selectedDate={selectedDate}
            onAction={handleAction}
          />
        </div>
      </PullToRefresh>

      {/* Floating Plus Button */}
      <button 
        onClick={() => setShowScheduleMenu(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all duration-200 hover:scale-110 z-40"
      >
        <Plus className="text-white" size={28} />
      </button>
    </div>
  );
};

export default ScheduleTab;
