
import React from 'react';
import { EventTask } from '@/types/eventTasks';
import LeaseSigningModal from './modals/LeaseSigningModal';
import PaymentModal from './modals/PaymentModal';
import FileUploadModal from './modals/FileUploadModal';
import InspectionModal from './modals/InspectionModal';
import ConfirmationModal from './modals/ConfirmationModal';
import MessageModule from '../message/MessageModule';
import WorkOrderFlow from '../maintenance/WorkOrderFlow';

interface TaskModalManagerProps {
  task: EventTask;
  eventType: string;
  onClose: () => void;
  onComplete: () => void;
}

const TaskModalManager = ({ task, eventType, onClose, onComplete }: TaskModalManagerProps) => {
  // Determine which modal to show based on task name and event type
  const getModalForTask = () => {
    const taskName = task.title.toLowerCase();
    
    // Payment-related tasks
    if (taskName.includes('payment') || taskName.includes('pay') || taskName.includes('deposit')) {
      return (
        <PaymentModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
          amount={taskName.includes('deposit') ? 1550 : 1550}
          description={taskName.includes('deposit') ? 'Security Deposit' : 'Monthly Rent Payment'}
        />
      );
    }

    // Lease signing
    if (taskName.includes('sign lease')) {
      return (
        <LeaseSigningModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
        />
      );
    }

    // File uploads
    if (taskName.includes('upload') || taskName.includes('insurance') || taskName.includes('template')) {
      let acceptedTypes = '.pdf,.jpg,.png';
      if (taskName.includes('insurance')) acceptedTypes = '.pdf';
      if (taskName.includes('photo') || taskName.includes('completion')) acceptedTypes = '.jpg,.png';
      
      return (
        <FileUploadModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
          acceptedFileTypes={acceptedTypes}
        />
      );
    }

    // Inspections
    if (taskName.includes('inspection') || taskName.includes('perform inspection')) {
      return (
        <InspectionModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
          inspectionType={eventType === 'move-in' ? 'move-in' : eventType === 'move-out' ? 'move-out' : 'maintenance'}
        />
      );
    }

    // Work order specific tasks
    if (eventType === 'work-order') {
      if (taskName.includes('submit request')) {
        return (
          <WorkOrderFlow
            selectedScheduleType="Work Order"
            currentStep={1}
            onNextStep={() => {}}
            onPrevStep={() => {}}
            onClose={onClose}
            workOrder={null}
            onWorkOrderCompleted={() => onComplete()}
          />
        );
      }
    }

    // Message-related tasks
    if (taskName.includes('reply') || taskName.includes('message') || taskName.includes('reminder')) {
      return (
        <MessageModule
          onClose={onClose}
          initialSubject={`Re: ${task.title}`}
          recipientType="management"
          mode="reply"
          onMessageSent={() => onComplete()}
        />
      );
    }

    // Default confirmation modal for other tasks
    return (
      <ConfirmationModal
        onClose={onClose}
        onComplete={onComplete}
        taskTitle={task.title}
        description={`Complete "${task.title}"? This action will mark the task as finished.`}
        confirmText="Mark Complete"
      />
    );
  };

  return getModalForTask();
};

export default TaskModalManager;
