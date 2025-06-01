
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

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCreatingOrder(false);
      setCurrentStep(1);
      setShowScheduleMenu(false);
      handleAction("Submitted", selectedScheduleType);
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
    setIsCreatingOrder(true);
    setShowScheduleMenu(false);
    setCurrentStep(1);
  };

  if (isCreatingOrder) {
    return (
      <WorkOrderFlow
        selectedScheduleType={selectedScheduleType}
        currentStep={currentStep}
        onNextStep={nextStep}
        onPrevStep={prevStep}
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
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
        <button 
          onClick={() => setShowScheduleMenu(true)}
          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Plus className="text-white" size={24} />
        </button>
      </div>
      
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
