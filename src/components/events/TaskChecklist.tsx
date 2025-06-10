
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, User, Lock, Undo2 } from 'lucide-react';
import { EventTask } from '@/types/eventTasks';
import type { TaskCompletionStamp } from '@/types/taskStamps';
import { Role } from '@/types/roles';
import { format } from 'date-fns';
import TaskModalManager from '../tasks/TaskModalManager';
import { isRoleAuthorizedToComplete, isTaskUnlocked } from '@/services/sharedEventService';

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
      case 'leasing':
        return 'bg-teal-100 text-teal-800';
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
      case 'leasing':
        return '📄';
      default:
        return '👤';
    }
  };

  const getTaskStatus = (task: EventTask): 'locked' | 'available' | 'in-progress' | 'complete' => {
    if (task.isComplete) return 'complete';
    if (task.status) return task.status;
    
    // Check dependencies using the shared service utility
    if (!isTaskUnlocked(task, tasks)) return 'locked';
    
    return 'available';
  };

  // Role enforcement with dependency checking
  const canUserInteractWithTask = (task: EventTask) => {
    return isRoleAuthorizedToComplete(currentUserRole, task.assignedRole) && 
           isTaskUnlocked(task, tasks) && 
           !readOnly;
  };

  const canUndoTask = (task: EventTask) => {
    if (!task.completedAt || !task.canUndo) return false;
    
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    // Find the stamp for this task
    const stamp = getTaskStamp(task.id);
    if (stamp && stamp.permanent) {
      return false; // Cannot undo permanent stamps
    }
    
    // Only allow undo if before 11:59 PM on same day and not permanent
    return now <= endOfDay && 
           task.completedAt && 
           task.completedAt.toDateString() === now.toDateString() &&
           !stamp?.permanent;
  };

  const getTaskStamp = (taskId: string) => {
    return completionStamps.find(stamp => stamp.taskId === taskId);
  };

  const handleTaskAction = (task: EventTask) => {
    // Check role permissions and dependencies
    if (!canUserInteractWithTask(task)) {
      console.log('User does not have permission to interact with this task or dependencies not met');
      return;
    }

    const taskStatus = getTaskStatus(task);
    
    if (taskStatus === 'available') {
      onTaskStart(task.id);
    } else if (taskStatus === 'in-progress') {
      // Open the appropriate modal for this task
      setActiveTaskModal(task);
    }
  };

  const handleModalComplete = () => {
    if (activeTaskModal) {
      onTaskComplete(activeTaskModal.id);
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

                      {taskStatus === 'locked' && task.dependsOnTaskId && (
                        <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Waiting for prerequisite task to complete
                        </p>
                      )}

                      {/* Role authorization message */}
                      {!isRoleAuthorizedToComplete(currentUserRole, task.assignedRole) && !readOnly && taskStatus !== 'complete' && taskStatus !== 'locked' && (
                        <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Only {task.assignedRole} can complete this task
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
                      {(taskStatus === 'available' || taskStatus === 'in-progress') && (
                        <Button
                          size="sm"
                          onClick={() => handleTaskAction(task)}
                          className={taskStatus === 'available' ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                        >
                          {taskStatus === 'available' ? (
                            <>
                              <Clock className="w-4 h-4 mr-2" />
                              Start Task
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete Task
                            </>
                          )}
                        </Button>
                      )}
                      
                      {taskStatus === 'complete' && canUndo && canInteract && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onTaskUndo(task.id)}
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

      {/* Task Modal */}
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
