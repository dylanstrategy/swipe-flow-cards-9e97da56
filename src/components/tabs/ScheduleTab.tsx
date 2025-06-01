
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import ScheduleMenu from '../schedule/ScheduleMenu';
import WorkOrderFlow from '../schedule/WorkOrderFlow';
import SuggestionsSection from '../schedule/SuggestionsSection';
import ScheduledItemsTimeline from '../schedule/ScheduledItemsTimeline';

const ScheduleTab = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [selectedScheduleType, setSelectedScheduleType] = useState<string>('');

  console.log('ScheduleTab render - isCreatingOrder:', isCreatingOrder, 'showScheduleMenu:', showScheduleMenu);

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  const nextStep = () => {
    console.log('nextStep called - currentStep:', currentStep);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      console.log('Final submission - closing work order');
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
    console.log('prevStep called - currentStep:', currentStep);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      console.log('Going back to schedule menu');
      setIsCreatingOrder(false);
      setShowScheduleMenu(true);
    }
  };

  const startScheduling = (type: string) => {
    console.log('startScheduling called with type:', type);
    setSelectedScheduleType(type);
    if (type === 'Work Order') {
      console.log('Starting work order flow');
      setIsCreatingOrder(true);
      setShowScheduleMenu(false);
      setCurrentStep(1);
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
    console.log('handleCloseWorkOrder called');
    setIsCreatingOrder(false);
    setCurrentStep(1);
    setShowScheduleMenu(false);
  };

  console.log('About to render - isCreatingOrder:', isCreatingOrder);

  if (isCreatingOrder) {
    console.log('Rendering WorkOrderFlow');
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
    console.log('Rendering ScheduleMenu');
    return (
      <ScheduleMenu
        onSelectType={startScheduling}
        onClose={() => {
          console.log('Closing schedule menu');
          setShowScheduleMenu(false);
        }}
      />
    );
  }

  console.log('Rendering main schedule tab');
  return (
    <div className="px-4 py-6 pb-24 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
      </div>
      
      {/* Floating Plus Button */}
      <button 
        onClick={() => {
          console.log('Plus button clicked - opening schedule menu');
          setShowScheduleMenu(true);
        }}
        className="fixed bottom-24 right-6 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all duration-200 hover:scale-110 z-50"
      >
        <Plus className="text-white" size={28} />
      </button>
      
      {/* Calendar */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className={cn("p-3 pointer-events-auto")}
          classNames={{
            day_today: "bg-blue-600 text-white hover:bg-blue-700",
            day_selected: "bg-blue-600 text-white hover:bg-blue-700"
          }}
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
  );
};

export default ScheduleTab;
