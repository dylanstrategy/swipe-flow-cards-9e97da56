
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, User, Lock, Undo2 } from 'lucide-react';
import { EventTask } from '@/types/eventTasks';
import type { TaskCompletionStamp } from '@/types/taskStamps';
import { Role, userHasAccessToTask } from '@/types/roles';
import { format } from 'date-fns';
import TaskModalManager from '../tasks/TaskModalManager';

interface TaskChecklistProps {
  tasks: EventTask[];
  currentUserRole: Role;
  onTaskComplete: (taskId: string) => void;
  onTaskUndo: (taskId: string) => void;
  onTaskStart: (taskId: string) => void;
  readOnly?: boolean;
  completionStamps: TaskCompletionStamp[];
  eventType: string;
}

const TaskChecklist = ({
  tasks,
  currentUserRole,
  onTaskComplete,
  onTaskUndo,
  onTaskStart,
  readOnly = false,
  completionStamps,
  eventType
}: TaskChecklistProps) => {
  const [activeTaskModal, setActiveTaskModal] = useState<EventTask | null>(null);

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'resident':
        return 'bg-blue-100 text-blue-800';
      case 'operator':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'prospect':
        return 'bg-purple-100 text-purple-800';
      case 'vendor':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'resident':
        return '🏠';
      case 'operator':
        return '👨‍💼';
      case 'maintenance':
        return '🔧';
      case 'prospect':
        return '👤';
      case 'vendor':
        return '🏢';
      default:
        return '👤';
    }
  };

  const getTaskStatus = (task: EventTask): 'locked' | 'available' | 'in-progress' | 'complete' => {
    if (task.isComplete) return 'complete';
    if (task.status) return task.status;
    
    // Check dependencies
    if (task.dependencies && task.dependencies.length > 0) {
      const dependenciesMet = task.dependencies.every(depTitle => 
        tasks.find(t => t.title === depTitle)?.isComplete
      );
      if (!dependenciesMet) return 'locked';
    }
    
    return 'available';
  };

  const canUserInteractWithTask = (task: EventTask) => {
    return userHasAccessToTask(currentUserRole, task.assignedRole) && !readOnly;
  };

  const canUndoTask = (task: EventTask) => {
    if (!task.completedAt || !task.canUndo) return false;
    
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const stamp = getTaskStamp(task.id);
    if (stamp && stamp.permanent) {
      return false;
    }
    
    return now <= endOfDay && 
           task.completedAt && 
           task.completedAt.toDateString() === now.toDateString() &&
           !stamp?.permanent;
  };

  const getTaskStamp = (taskId: string) => {
    return completionStamps.find(stamp => stamp.taskId === taskId);
  };

  const handleTaskAction = (task: EventTask) => {
    if (!canUserInteractWithTask(task)) {
      console.log('User does not have permission to interact with this task - Role mismatch');
      return;
    }

    const taskStatus = getTaskStatus(task);
    
    if (taskStatus === 'available') {
      console.log('Starting task:', task.id);
      onTaskStart(task.id);
    } else if (taskStatus === 'in-progress') {
      console.log('Opening modal for task:', task.id);
      setActiveTaskModal(task);
    }
  };

  const handleCompleteTask = (task: EventTask) => {
    if (!canUserInteractWithTask(task)) {
      console.log('User cannot complete task - insufficient permissions');
      return;
    }

    console.log('Completing task:', task.id, 'for role:', currentUserRole);
    onTaskComplete(task.id);
  };

  const handleUndoTask = (task: EventTask) => {
    if (!canUserInteractWithTask(task) || !canUndoTask(task)) {
      console.log('User cannot undo task');
      return;
    }

    console.log('Undoing task:', task.id);
    onTaskUndo(task.id);
  };

  const handleModalComplete = () => {
    if (activeTaskModal) {
      handleCompleteTask(activeTaskModal);
      setActiveTaskModal(null);
    }
  };

  const sortedTasks = tasks.sort((a, b) => {
    const statusOrder = { complete: 4, 'in-progress': 3, available: 2, locked: 1 };
    const aStatus = getTaskStatus(a);
    const bStatus = getTaskStatus(b);
    
    if (statusOrder[aStatus] !== statusOrder[bStatus]) {
      return statusOrder[bStatus] - statusOrder[aStatus];
    }
    
    if (a.isRequired !== b.isRequired) {
      return a.isRequired ? -1 : 1;
    }
    
    return 0;
  });

  console.log('TaskChecklist rendered with tasks:', tasks);
  console.log('Current user role:', currentUserRole);

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Task Checklist</h3>
          <div className="text-sm text-gray-600">
            {tasks.filter(t => t.isComplete).length} of {tasks.length} completed
          </div>
        </div>

        {sortedTasks.map((task) => {
          const taskStatus = getTaskStatus(task);
          const canInteract = canUserInteractWithTask(task);
          const canUndo = canUndoTask(task);
          const stamp = getTaskStamp(task.id);
          
          console.log(`Task ${task.title}: status=${taskStatus}, canInteract=${canInteract}, role=${task.assignedRole}, currentRole=${currentUserRole}`);
          
          return (
            <div
              key={task.id}
              className={`p-4 border rounded-lg transition-all ${
                taskStatus === 'complete'
                  ? 'bg-green-50 border-green-200'
                  : taskStatus === 'locked'
                  ? 'bg-gray-50 border-gray-200 opacity-60'
                  : taskStatus === 'in-progress'
                  ? 'bg-blue-50 border-blue-200'
                  : canInteract
                  ? 'bg-white border-blue-200 hover:border-blue-300'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {taskStatus === 'complete' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : taskStatus === 'locked' ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : taskStatus === 'in-progress' ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Circle className={`w-5 h-5 ${canInteract ? 'text-blue-600' : 'text-gray-400'}`} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        taskStatus === 'complete' ? 'text-green-800' : 
                        taskStatus === 'locked' ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                        {task.isRequired && taskStatus !== 'complete' && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        taskStatus === 'complete' ? 'text-green-700' : 
                        taskStatus === 'locked' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                      
                      {task.instructions && taskStatus !== 'complete' && taskStatus !== 'locked' && (
                        <p className="text-xs text-blue-600 mt-2 italic">
                          {task.instructions}
                        </p>
                      )}

                      {task.unlockCondition && taskStatus === 'locked' && (
                        <p className="text-xs text-gray-500 mt-2">
                          Unlocks after: {task.unlockCondition}
                        </p>
                      )}

                      {!canInteract && !readOnly && taskStatus !== 'complete' && taskStatus !== 'locked' && (
                        <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Task assigned to {task.assignedRole} - your role ({currentUserRole}) cannot complete this task
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getRoleColor(task.assignedRole)}>
                        {getRoleIcon(task.assignedRole)} {task.assignedRole}
                      </Badge>
                      
                      {task.estimatedDuration && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {task.estimatedDuration}m
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {stamp && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-green-600 bg-green-100 p-2 rounded">
                      <User className="w-3 h-3" />
                      Completed by {stamp.completedByName} at {format(stamp.actualCompletionTime, 'h:mm a')}
                      {stamp.permanent && (
                        <span className="text-xs text-gray-500 ml-2">(Locked)</span>
                      )}
                    </div>
                  )}
                  
                  {canInteract && (
                    <div className="mt-3 flex gap-2">
                      {taskStatus === 'available' && (
                        <Button
                          size="sm"
                          onClick={() => handleTaskAction(task)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Start Task
                        </Button>
                      )}
                      
                      {taskStatus === 'in-progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteTask(task)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete Task
                        </Button>
                      )}
                      
                      {taskStatus === 'complete' && canUndo && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUndoTask(task)}
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                          <Undo2 className="w-4 h-4 mr-2" />
                          Undo
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tasks assigned for this event.
          </div>
        )}
      </div>

      {activeTaskModal && (
        <TaskModalManager
          task={activeTaskModal}
          eventType={eventType}
          onClose={() => setActiveTaskModal(null)}
          onComplete={handleModalComplete}
        />
      )}
    </>
  );
};

export default TaskChecklist;
