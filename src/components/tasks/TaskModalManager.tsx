
import React, { useState } from 'react';
import { EventTask } from '@/types/eventTasks';
import FinalInspectionModal from './modals/FinalInspectionModal';
import GiftPackageModal from './modals/GiftPackageModal';
import AccessSetupModal from './modals/AccessSetupModal';
import KeyIssuanceModal from './modals/KeyIssuanceModal';
import GenericTaskModal from './modals/GenericTaskModal';

interface TaskModalManagerProps {
  task: EventTask;
  eventType: string;
  onClose: () => void;
  onComplete: () => void;
}

const TaskModalManager = ({ task, eventType, onClose, onComplete }: TaskModalManagerProps) => {
  const getModalForTask = () => {
    const taskTitle = task.title.toLowerCase();
    
    if (taskTitle.includes('final inspection')) {
      return (
        <FinalInspectionModal
          task={task}
          onClose={onClose}
          onComplete={onComplete}
        />
      );
    }
    
    if (taskTitle.includes('gift package') || taskTitle.includes('prepare gift')) {
      return (
        <GiftPackageModal
          task={task}
          onClose={onClose}
          onComplete={onComplete}
        />
      );
    }
    
    if (taskTitle.includes('access setup') || taskTitle.includes('setup access')) {
      return (
        <AccessSetupModal
          task={task}
          onClose={onClose}
          onComplete={onComplete}
        />
      );
    }
    
    if (taskTitle.includes('key') && (taskTitle.includes('issue') || taskTitle.includes('confirm'))) {
      return (
        <KeyIssuanceModal
          task={task}
          onClose={onClose}
          onComplete={onComplete}
        />
      );
    }
    
    // Default generic modal for other tasks
    return (
      <GenericTaskModal
        task={task}
        eventType={eventType}
        onClose={onClose}
        onComplete={onComplete}
      />
    );
  };

  return getModalForTask();
};

export default TaskModalManager;
