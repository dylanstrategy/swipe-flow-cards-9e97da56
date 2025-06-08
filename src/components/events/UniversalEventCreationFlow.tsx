
import React, { useState } from 'react';
import SwipeableScreen from '@/components/schedule/SwipeableScreen';
import SwipeUpPrompt from '@/components/ui/swipe-up-prompt';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { EventType } from '@/types/eventTasks';
import { useUniversalEvent } from '@/hooks/useUniversalEvent';
import UniversalEventTaskList from './UniversalEventTaskList';

interface UniversalEventCreationFlowProps {
  eventType: EventType;
  onClose: () => void;
  onEventCreated: (event: any) => void;
  initialData?: {
    title?: string;
    description?: string;
    date?: Date;
    time?: string;
    metadata?: Record<string, any>;
  };
}

const UniversalEventCreationFlow = ({
  eventType,
  onClose,
  onEventCreated,
  initialData
}: UniversalEventCreationFlowProps) => {
  const { createEvent, isLoading } = useUniversalEvent();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSwipePrompt, setShowSwipePrompt] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    title: initialData?.title || eventType.name,
    description: initialData?.description || '',
    date: initialData?.date || new Date(),
    time: initialData?.time || '09:00',
    priority: 'medium' as const,
    metadata: initialData?.metadata || {}
  });

  const totalSteps = 3;

  const handleSwipeUp = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setShowSwipePrompt(true);
    } else {
      handleCreateEvent();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowSwipePrompt(true);
    } else {
      onClose();
    }
  };

  const handleCreateEvent = async () => {
    const event = await createEvent(eventType.id, {
      ...formData,
      assignedUsers: eventType.defaultTasks.map(task => ({
        role: task.assignedRole,
        userId: undefined,
        name: `Current ${task.assignedRole}`,
        email: `${task.assignedRole}@example.com`
      }))
    });

    if (event) {
      onEventCreated(event);
      onClose();
    }
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {eventType.icon} {eventType.name}
              </h2>
              <p className="text-gray-600">{eventType.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Schedule Event</h2>
              <p className="text-gray-600">When should this event take place?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => updateFormData({ date: date || new Date() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateFormData({ time: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Estimated Duration</Label>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  Approximately {eventType.estimatedDuration} minutes
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Review Tasks</h2>
              <p className="text-gray-600">Tasks that will be assigned for this event</p>
            </div>

            <UniversalEventTaskList
              tasks={eventType.defaultTasks.map((task, index) => ({
                id: `preview-${index}`,
                ...task,
                isComplete: false
              }))}
              currentUserRole="operator"
              onTaskComplete={() => {}}
              onTaskClick={() => {}}
              readOnly={true}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Event Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Title:</strong> {formData.title}</p>
                <p><strong>Date:</strong> {format(formData.date, "PPP")} at {formData.time}</p>
                <p><strong>Tasks:</strong> {eventType.defaultTasks.length} tasks assigned</p>
                <p><strong>Roles:</strong> {Array.from(new Set(eventType.defaultTasks.map(t => t.assignedRole))).join(', ')}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SwipeableScreen
        title={`Create ${eventType.name}`}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onClose={onClose}
        onSwipeUp={handleSwipeUp}
        onSwipeLeft={handlePrevStep}
        canSwipeUp={true}
      >
        {renderStepContent()}
      </SwipeableScreen>

      {showSwipePrompt && (
        <SwipeUpPrompt
          onContinue={handleSwipeUp}
          onBack={currentStep > 1 ? handlePrevStep : undefined}
          onClear={() => setShowSwipePrompt(false)}
          message={
            currentStep < totalSteps 
              ? "Ready to continue!" 
              : "Ready to create event!"
          }
          buttonText={
            currentStep < totalSteps 
              ? "Continue" 
              : isLoading ? "Creating..." : "Create Event"
          }
          backButtonText="Back"
          showBack={currentStep > 1}
        />
      )}
    </>
  );
};

export default UniversalEventCreationFlow;
