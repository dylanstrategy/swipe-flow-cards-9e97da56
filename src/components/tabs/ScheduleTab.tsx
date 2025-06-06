
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
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="px-4 py-6 pb-24 relative">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
        </div>
        
        {/* Floating Plus Button */}
        <button 
          onClick={() => setShowScheduleMenu(true)}
          className="fixed bottom-24 right-6 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all duration-200 hover:scale-110 z-50"
        >
          <Plus className="text-white" size={28} />
        </button>
        
        {/* Calendar using the same component as Today tab */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar</h2>
          <MiniCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            getEventsForDate={getEventsForDate}
          />
        </div>

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
  );
};

export default ScheduleTab;
