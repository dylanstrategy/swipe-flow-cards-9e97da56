
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, User, Lock } from 'lucide-react';
import { EventTask } from '@/types/eventTasks';
import { isRoleAuthorizedToComplete, isTaskUnlocked } from '@/services/sharedEventService';

interface UniversalEventTaskListProps {
  tasks: EventTask[];
  currentUserRole: string;
  onTaskComplete: (taskId: string) => void;
  onTaskClick: (task: EventTask) => void;
  readOnly?: boolean;
}

const UniversalEventTaskList = ({
  tasks,
  currentUserRole,
  onTaskComplete,
  onTaskClick,
  readOnly = false
}: UniversalEventTaskListProps) => {
  const [, forceRender] = useState(0);

  const getRoleColor = (role: string) => {
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

  const getRoleIcon = (role: string) => {
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

  const canCompleteTask = (task: EventTask) => {
    return isRoleAuthorizedToComplete(currentUserRole as any, task.assignedRole as any) && 
           isTaskUnlocked(task, tasks) && 
           !task.isComplete && 
           !readOnly;
  };

  const isTaskRelevantToUser = (task: EventTask) => {
    return isRoleAuthorizedToComplete(currentUserRole as any, task.assignedRole as any) || currentUserRole === 'operator';
  };

  const getTaskStatus = (task: EventTask) => {
    if (task.isComplete) return 'complete';
    if (!isTaskUnlocked(task, tasks)) return 'locked';
    return 'available';
  };

  const handleCompleteTask = async (taskId: string) => {
    await onTaskComplete(taskId);
    forceRender(x => x + 1); // trigger UI update
  };

  const sortedTasks = tasks.sort((a, b) => {
    // Sort by completion status, then by role relevance, then by required status
    if (a.isComplete !== b.isComplete) {
      return a.isComplete ? 1 : -1;
    }
    
    const aRelevant = isTaskRelevantToUser(a);
    const bRelevant = isTaskRelevantToUser(b);
    if (aRelevant !== bRelevant) {
      return aRelevant ? -1 : 1;
    }
    
    if (a.isRequired !== b.isRequired) {
      return a.isRequired ? -1 : 1;
    }
    
    return 0;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
        <div className="text-sm text-gray-600">
          {tasks.filter(t => t.isComplete).length} of {tasks.length} completed
        </div>
      </div>

      {sortedTasks.map((task) => {
        const isRelevant = isTaskRelevantToUser(task);
        const canComplete = canCompleteTask(task);
        const taskStatus = getTaskStatus(task);
        
        return (
          <div
            key={task.id}
            className={`p-4 border rounded-lg transition-all cursor-pointer hover:shadow-sm ${
              task.isComplete
                ? 'bg-gray-50 border-gray-200'
                : taskStatus === 'locked'
                ? 'bg-gray-50 border-gray-200 opacity-60'
                : isRelevant
                ? 'bg-white border-blue-200 hover:border-blue-300'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
            onClick={() => onTaskClick(task)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {task.isComplete ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : taskStatus === 'locked' ? (
                  <Lock className="w-5 h-5 text-gray-400" />
                ) : (
                  <button
                    className={`focus:outline-none ${canComplete ? 'text-blue-600' : 'text-gray-400 cursor-not-allowed'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canComplete) handleCompleteTask(task.id);
                    }}
                    disabled={!canComplete}
                  >
                    <Circle className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      task.isComplete ? 'text-gray-600 line-through' : 
                      taskStatus === 'locked' ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                      {task.title}
                      {task.isRequired && !task.isComplete && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      task.isComplete ? 'text-gray-500' : 
                      taskStatus === 'locked' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {task.description}
                    </p>
                    
                    {task.instructions && !task.isComplete && taskStatus !== 'locked' && (
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
                
                {task.isComplete && task.completedAt && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    Completed by {task.completedBy} on {task.completedAt.toLocaleDateString()}
                  </div>
                )}
                
                {canComplete && taskStatus === 'available' && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteTask(task.id);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Task
                    </Button>
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
  );
};

export default UniversalEventTaskList;
