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
    if (taskName.includes('payment') || taskName.includes('pay') || taskName.includes('deposit') || 
        taskName.includes('pet fee') || taskName.includes('outstanding balance')) {
      return (
        <PaymentModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
          amount={taskName.includes('pet fee') ? 350 : taskName.includes('deposit') ? 1550 : 1550}
          description={
            taskName.includes('pet fee') ? 'Pet Registration Fee' :
            taskName.includes('deposit') ? 'Security Deposit' : 
            taskName.includes('outstanding') ? 'Outstanding Rent Payment' : 
            'Monthly Rent Payment'
          }
        />
      );
    }

    // Lease signing
    if (taskName.includes('sign lease') || taskName.includes('lease documents')) {
      return (
        <LeaseSigningModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
        />
      );
    }

    // File uploads - expanded for more event types
    if (taskName.includes('upload') || taskName.includes('insurance') || taskName.includes('template') ||
        taskName.includes('pet photos') || taskName.includes('vaccination records') ||
        taskName.includes('documents')) {
      let acceptedTypes = '.pdf,.jpg,.png';
      if (taskName.includes('insurance') || taskName.includes('vaccination')) acceptedTypes = '.pdf';
      if (taskName.includes('photo') || taskName.includes('completion') || taskName.includes('pet photos')) acceptedTypes = '.jpg,.png';
      
      return (
        <FileUploadModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
          acceptedFileTypes={acceptedTypes}
        />
      );
    }

    // Inspections - expanded for unit turns and annual inspections
    if (taskName.includes('inspection') || taskName.includes('perform inspection') ||
        taskName.includes('final inspection') || taskName.includes('walkthrough')) {
      return (
        <InspectionModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
          inspectionType={
            eventType === 'move-in' ? 'move-in' : 
            eventType === 'move-out' ? 'move-out' : 
            eventType === 'unit-turn' ? 'unit-turn' :
            eventType === 'inspection' ? 'inspection' :
            'maintenance'
          }
        />
      );
    }

    // Work order specific tasks
    if (eventType === 'work-order' || taskName.includes('complete work order') || 
        taskName.includes('grant access') || taskName.includes('update status')) {
      return (
        <ConfirmationModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
          description={
            taskName.includes('grant access') ? 
              'Confirm that you will provide access to the maintenance team at the scheduled time.' :
            taskName.includes('complete work order') ?
              'Mark this work order as completed. Ensure all work has been finished satisfactorily.' :
            taskName.includes('update status') ?
              'Update the work order status in the system.' :
              `Complete "${task.title}"? This action will mark the task as finished.`
          }
          confirmText={
            taskName.includes('grant access') ? 'Confirm Access' :
            taskName.includes('complete work order') ? 'Mark Complete' :
            taskName.includes('update status') ? 'Update Status' :
            'Mark Complete'
          }
        />
      );
    }

    // Pet registration tasks
    if (eventType === 'pet-registration') {
      if (taskName.includes('approve registration')) {
        return (
          <ConfirmationModal
            onClose={onClose}
            onComplete={onComplete}
            taskTitle={task.title}
            description="Review the pet registration documents and approve the registration."
            confirmText="Approve Registration"
          />
        );
      }
    }

    // Poll tasks
    if (eventType === 'poll') {
      if (taskName.includes('create poll')) {
        return (
          <ConfirmationModal
            onClose={onClose}
            onComplete={onComplete}
            taskTitle={task.title}
            description="Set up the community poll with voting options."
            confirmText="Create Poll"
          />
        );
      }
      if (taskName.includes('cast vote')) {
        return (
          <ConfirmationModal
            onClose={onClose}
            onComplete={onComplete}
            taskTitle={task.title}
            description="Submit your vote in the community poll."
            confirmText="Cast Vote"
          />
        );
      }
    }

    // Collections tasks
    if (eventType === 'collections') {
      if (taskName.includes('review outstanding balance')) {
        return (
          <ConfirmationModal
            onClose={onClose}
            onComplete={onComplete}
            taskTitle={task.title}
            description="Review your current account balance and outstanding charges."
            confirmText="Review Complete"
          />
        );
      }
      if (taskName.includes('confirm payment')) {
        return (
          <ConfirmationModal
            onClose={onClose}
            onComplete={onComplete}
            taskTitle={task.title}
            description="Verify that the payment has been received and processed."
            confirmText="Confirm Payment"
          />
        );
      }
    }

    // Community event tasks
    if (eventType === 'community-event') {
      if (taskName.includes('rsvp')) {
        return (
          <ConfirmationModal
            onClose={onClose}
            onComplete={onComplete}
            taskTitle={task.title}
            description="Confirm your attendance for this community event."
            confirmText="RSVP Yes"
          />
        );
      }
      if (taskName.includes('setup event') || taskName.includes('check-in')) {
        return (
          <ConfirmationModal
            onClose={onClose}
            onComplete={onComplete}
            taskTitle={task.title}
            description="Complete the event setup and preparation tasks."
            confirmText="Mark Complete"
          />
        );
      }
    }

    // Unit turn tasks
    if (eventType === 'unit-turn') {
      return (
        <ConfirmationModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
          description={
            taskName.includes('deep cleaning') ? 
              'Complete thorough cleaning of all areas in the unit.' :
            taskName.includes('paint') ?
              'Complete any necessary paint touch-ups and repairs.' :
            taskName.includes('final inspection') ?
              'Conduct final quality inspection before marking unit ready.' :
            taskName.includes('mark unit ready') ?
              'Update the unit status to available for new residents.' :
              `Complete "${task.title}"? This action will mark the task as finished.`
          }
          confirmText="Mark Complete"
        />
      );
    }

    // Lease violation tasks
    if (eventType === 'lease-violation') {
      if (taskName.includes('document violation')) {
        return (
          <ConfirmationModal
            onClose={onClose}
            onComplete={onComplete}
            taskTitle={task.title}
            description="Create and submit a formal violation report."
            confirmText="Submit Report"
          />
        );
      }
      if (taskName.includes('respond to notice')) {
        return (
          <MessageModule
            onClose={onClose}
            initialSubject="Re: Lease Violation Notice"
            recipientType="management"
            mode="reply"
            onMessageSent={() => onComplete()}
          />
        );
      }
    }

    // Resident complaint tasks
    if (eventType === 'resident-complaint') {
      if (taskName.includes('submit complaint')) {
        return (
          <MessageModule
            onClose={onClose}
            initialSubject="Resident Complaint"
            recipientType="management"
            mode="compose"
            onMessageSent={() => onComplete()}
          />
        );
      }
      if (taskName.includes('acknowledge') || taskName.includes('resolution')) {
        return (
          <ConfirmationModal
            onClose={onClose}
            onComplete={onComplete}
            taskTitle={task.title}
            description="Process the resident complaint and provide appropriate response."
            confirmText="Mark Complete"
          />
        );
      }
    }

    // Amenity reservation tasks
    if (eventType === 'amenity-reservation') {
      return (
        <ConfirmationModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
          description={
            taskName.includes('book amenity') ?
              'Reserve the amenity for your specified time slot.' :
            taskName.includes('confirm booking') ?
              'Verify amenity availability and confirm the reservation.' :
            taskName.includes('check-in') ?
              'Check in for your amenity reservation.' :
              `Complete "${task.title}"? This action will mark the task as finished.`
          }
          confirmText={
            taskName.includes('book') ? 'Book Amenity' :
            taskName.includes('confirm') ? 'Confirm Booking' :
            taskName.includes('check-in') ? 'Check In' :
            'Mark Complete'
          }
        />
      );
    }

    // Vendor visit tasks
    if (eventType === 'vendor-visit') {
      return (
        <ConfirmationModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
          description={
            taskName.includes('schedule vendor') ?
              'Coordinate vendor visit and access arrangements.' :
            taskName.includes('approve time') ?
              'Confirm your availability for the vendor visit.' :
            taskName.includes('coordinate access') ?
              'Ensure vendor has proper access to complete their work.' :
            taskName.includes('verify completion') ?
              'Confirm that vendor work has been completed satisfactorily.' :
              `Complete "${task.title}"? This action will mark the task as finished.`
          }
          confirmText="Mark Complete"
        />
      );
    }

    // Services tasks
    if (eventType === 'services') {
      if (taskName.includes('request service')) {
        return (
          <MessageModule
            onClose={onClose}
            initialSubject="Service Request"
            recipientType="management"
            mode="compose"
            onMessageSent={() => onComplete()}
          />
        );
      }
    }

    // Message-related tasks
    if (taskName.includes('reply') || taskName.includes('message') || taskName.includes('reminder') ||
        taskName.includes('read message') || taskName.includes('acknowledge')) {
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

    // Review tasks
    if (taskName.includes('review') && !taskName.includes('outstanding balance')) {
      return (
        <ConfirmationModal
          onClose={onClose}
          onComplete={onComplete}
          taskTitle={task.title}
          description={`Review and confirm: ${task.description || task.title}`}
          confirmText="Review Complete"
        />
      );
    }

    // Default confirmation modal for other tasks
    return (
      <ConfirmationModal
        onClose={onClose}
        onComplete={onComplete}
        taskTitle={task.title}
        description={task.description || `Complete "${task.title}"? This action will mark the task as finished.`}
        confirmText="Mark Complete"
      />
    );
  };

  return getModalForTask();
};

export default TaskModalManager;
