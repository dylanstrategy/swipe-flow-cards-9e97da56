import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, Calendar, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isPast, isToday } from 'date-fns';
import { useUniversalEvent } from '@/hooks/useUniversalEvent';
import { useTaskCompletionStamps } from '@/hooks/useTaskCompletionStamps';
import { getEventType } from '@/services/eventTypeService';
import { getTasksForEventType } from '@/services/eventTaskTemplatesService';
import { UniversalEvent, EventTask } from '@/types/eventTasks';
import { Role } from '@/types/roles';
import TaskChecklist from './TaskChecklist';
import EventMessaging from './EventMessaging';
import EventTimeline from './EventTimeline';
import RescheduleFlow from './RescheduleFlow';
import { EnhancedEvent } from '@/types/events';
import { teamAvailabilityService } from '@/services/teamAvailabilityService';

interface UniversalEventDetailModalProps {
  event: any;
  onClose: () => void;
  userRole?: Role;
  onEventUpdate?: (updatedEvent: any) => void;
}

const UniversalEventDetailModal = ({ 
  event, 
  onClose, 
  userRole = 'operator', 
  onEventUpdate 
}: UniversalEventDetailModalProps) => {
  const { toast } = useToast();
  const { completeTask, undoTaskCompletion, rescheduleEvent, cancelEvent, isLoading } = useUniversalEvent();
  const { stamps, addStamp, removeStamp, getStampsForEvent } = useTaskCompletionStamps();
  const [activeTab, setActiveTab] = useState<'details' | 'message' | 'timeline'>('details');
  const [messageText, setMessageText] = useState('');
  const [currentEvent, setCurrentEvent] = useState(event);
  const [showRescheduleFlow, setShowRescheduleFlow] = useState(false);

  // Safely get event type - handle both new format and legacy format
  const eventTypeId = currentEvent.type || 'lease-signing';
  const eventType = getEventType(eventTypeId);
  
  // Get task templates for this event type
  const taskTemplates = getTasksForEventType(eventTypeId);

  // Convert old event format to UniversalEvent if needed
  const universalEvent: UniversalEvent = currentEvent.tasks ? currentEvent : {
    id: currentEvent.id,
    type: eventTypeId,
    title: currentEvent.title,
    description: currentEvent.description,
    date: currentEvent.date,
    time: currentEvent.time,
    status: currentEvent.status || 'scheduled',
    priority: currentEvent.priority || 'medium',
    category: currentEvent.category || eventType?.category || 'Leasing',
    tasks: taskTemplates.map((taskTemplate, index) => ({
      id: `${Date.now()}-${index}`,
      title: taskTemplate.name,
      description: `Complete: ${taskTemplate.name}`,
      assignedRole: taskTemplate.role,
      isComplete: false,
      isRequired: true,
      status: 'available' as const,
      estimatedDuration: 15
    })),
    assignedUsers: [],
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    rescheduledCount: currentEvent.rescheduledCount || 0,
    followUpHistory: [],
    metadata: currentEvent,
    taskCompletionStamps: []
  };

  console.log('Universal event with tasks:', universalEvent);
  console.log('Event type:', eventType);
  console.log('Task templates:', taskTemplates);

  // Overdue detection logic
  const isEventOverdue = (event: UniversalEvent): boolean => {
    if (event.status === 'completed' || event.status === 'cancelled') return false;
    
    const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
    const now = new Date();
    
    if (isPast(eventDate) && !isToday(eventDate)) {
      return true;
    }
    
    if (isToday(eventDate) && event.time) {
      try {
        const [hours, minutes] = event.time.split(':').map(Number);
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(hours, minutes || 0, 0, 0);
        
        return isPast(eventDateTime);
      } catch (error) {
        console.warn('Error parsing event time:', event.time, error);
        return false;
      }
    }
    
    return false;
  };

  const eventIsOverdue = isEventOverdue(universalEvent);

  const getEventTypeIcon = (type: string) => {
    return eventType?.icon || '📅';
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'move-in': return 'bg-green-100 text-green-800 border-green-200';
      case 'move-out': return 'bg-red-100 text-red-800 border-red-200';
      case 'lease-signing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lease': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'message': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'tour': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'payment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'work-order': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'inspection': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'amenity-reservation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'community-event': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string, status?: string, isOverdue?: boolean) => {
    if (isOverdue) return 'bg-red-100 text-red-800 border-red-200';
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTaskStart = async (taskId: string) => {
    const updatedEvent = {
      ...universalEvent,
      tasks: universalEvent.tasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'in-progress' as const }
          : task
      )
    };
    
    setCurrentEvent(updatedEvent);
    onEventUpdate?.(updatedEvent);
    
    toast({
      title: "Task Started",
      description: "Task has been started.",
    });
  };

  const handleTaskComplete = async (taskId: string) => {
    const task = universalEvent.tasks.find(t => t.id === taskId);
    if (!task) return;

    const success = await completeTask(universalEvent.id, taskId, userRole);
    if (success) {
      // Add completion stamp
      const stamp = addStamp(
        taskId,
        task.title,
        universalEvent.id,
        universalEvent.type,
        userRole,
        `${userRole} User`
      );

      // Update local state
      const updatedEvent = {
        ...universalEvent,
        tasks: universalEvent.tasks.map(t =>
          t.id === taskId
            ? { 
                ...t, 
                isComplete: true, 
                completedAt: new Date(), 
                completedBy: userRole,
                status: 'complete' as const,
                canUndo: true
              }
            : t
        ),
        taskCompletionStamps: [...universalEvent.taskCompletionStamps, stamp]
      };
      
      setCurrentEvent(updatedEvent);
      onEventUpdate?.(updatedEvent);

      // Check if all required tasks are complete
      const allRequiredComplete = updatedEvent.tasks
        .filter(task => task.isRequired)
        .every(task => task.isComplete);

      if (allRequiredComplete) {
        updatedEvent.status = 'completed';
        updatedEvent.completedAt = new Date();
        toast({
          title: "Event Completed!",
          description: `${updatedEvent.title} has been completed successfully.`,
        });
      }
    }
  };

  const handleTaskUndo = async (taskId: string) => {
    const success = await undoTaskCompletion(universalEvent.id, taskId);
    if (success) {
      // Remove completion stamp
      removeStamp(taskId);

      // Update local state
      const updatedEvent = {
        ...universalEvent,
        tasks: universalEvent.tasks.map(task =>
          task.id === taskId
            ? { 
                ...task, 
                isComplete: false, 
                completedAt: undefined, 
                completedBy: undefined,
                status: 'available' as const,
                canUndo: false
              }
            : task
        ),
        taskCompletionStamps: universalEvent.taskCompletionStamps.filter(s => s.taskId !== taskId)
      };
      
      setCurrentEvent(updatedEvent);
      onEventUpdate?.(updatedEvent);

      toast({
        title: "Task Undone",
        description: "Task completion has been undone.",
      });
    }
  };

  const handleTaskClick = (task: any) => {
    console.log('Task clicked:', task);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    toast({
      title: "Message Sent",
      description: `Message sent regarding ${universalEvent.title}`,
    });
    
    setMessageText('');
    setActiveTab('timeline');
  };

  const handleReschedule = () => {
    const enhancedEvent: EnhancedEvent = {
      id: universalEvent.id,
      date: universalEvent.date,
      time: universalEvent.time,
      title: universalEvent.title,
      description: universalEvent.description,
      category: universalEvent.category,
      priority: universalEvent.priority,
      canReschedule: eventType?.allowsReschedule || true,
      canCancel: true,
      estimatedDuration: eventType?.estimatedDuration || 60,
      rescheduledCount: universalEvent.rescheduledCount,
      assignedTeamMember: teamAvailabilityService.assignTeamMember({ category: universalEvent.category }),
      residentName: 'Resident',
      phone: '(555) 123-4567',
      unit: universalEvent.metadata?.unit,
      building: universalEvent.metadata?.building,
      status: universalEvent.status
    };
    
    setShowRescheduleFlow(true);
  };

  const handleRescheduleConfirm = async (rescheduleData: any) => {
    const success = await rescheduleEvent(
      universalEvent.id, 
      rescheduleData.newDate, 
      rescheduleData.newTime
    );
    
    if (success) {
      const updatedEvent = {
        ...universalEvent,
        date: rescheduleData.newDate,
        time: rescheduleData.newTime,
        rescheduledCount: universalEvent.rescheduledCount + 1
      };
      
      setCurrentEvent(updatedEvent);
      setShowRescheduleFlow(false);
      onEventUpdate?.(updatedEvent);
    }
  };

  const canReschedule = () => {
    return universalEvent.status !== 'completed' && universalEvent.status !== 'cancelled' && (eventType?.allowsReschedule !== false);
  };

  const getCompletedTasksCount = () => {
    return universalEvent.tasks.filter(task => task.isComplete).length;
  };

  const getTotalTasksCount = () => {
    return universalEvent.tasks.length;
  };

  const getProgressPercentage = () => {
    if (getTotalTasksCount() === 0) return 0;
    return Math.round((getCompletedTasksCount() / getTotalTasksCount()) * 100);
  };

  if (showRescheduleFlow) {
    const enhancedEvent: EnhancedEvent = {
      id: universalEvent.id,
      date: universalEvent.date,
      time: universalEvent.time,
      title: universalEvent.title,
      description: universalEvent.description,
      category: universalEvent.category,
      priority: universalEvent.priority,
      canReschedule: true,
      canCancel: true,
      estimatedDuration: eventType?.estimatedDuration || 60,
      rescheduledCount: universalEvent.rescheduledCount,
      assignedTeamMember: teamAvailabilityService.assignTeamMember({ category: universalEvent.category }),
      residentName: 'Resident',
      phone: '(555) 123-4567',
      unit: universalEvent.metadata?.unit,
      building: universalEvent.metadata?.building,
      status: universalEvent.status
    };

    return (
      <RescheduleFlow
        event={enhancedEvent}
        onClose={() => setShowRescheduleFlow(false)}
        onConfirm={handleRescheduleConfirm}
        userRole={userRole as "resident" | "operator" | "maintenance"}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-3">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[95vh] overflow-hidden" style={{ maxWidth: 'calc(100% - 24px)', overflowX: 'hidden' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200" style={{ overflowX: 'hidden' }}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-xl sm:text-2xl flex-shrink-0">{getEventTypeIcon(universalEvent.type)}</span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {eventIsOverdue && <span className="text-red-700 font-bold mr-1">OVERDUE:</span>}
                  {universalEvent.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {universalEvent.time} • {eventType?.name || universalEvent.type}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
            <Badge className={`${getEventTypeColor(universalEvent.type)} text-xs whitespace-nowrap`}>
              {eventType?.name || universalEvent.type}
            </Badge>
            <Badge className={`${getPriorityColor(universalEvent.priority, universalEvent.status, eventIsOverdue)} text-xs whitespace-nowrap`}>
              {eventIsOverdue ? 'OVERDUE' : universalEvent.priority?.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        {universalEvent.tasks.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100" style={{ overflowX: 'hidden' }}>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{getCompletedTasksCount()} of {getTotalTasksCount()} tasks completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Overdue Warning */}
        {eventIsOverdue && (
          <div className="px-4 py-3 bg-red-50 border-b border-red-200" style={{ overflowX: 'hidden' }}>
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">This event is overdue and requires immediate attention</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {canReschedule() && (
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50" style={{ overflowX: 'hidden' }}>
            <div className="flex gap-2">
              <Button
                onClick={handleReschedule}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Reschedule
              </Button>
              {universalEvent.status === 'completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-green-700 border-green-300"
                  disabled
                >
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200" style={{ overflowX: 'hidden' }}>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'message'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Message
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'timeline'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Timeline
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(95vh - 280px)', overflowX: 'hidden' }}>
          {activeTab === 'details' && (
            <div className="p-4 pt-6" style={{ overflowX: 'hidden' }}>
              {/* Event Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 break-words">{universalEvent.description}</p>
                  {eventType && (
                    <div className="mt-3 text-sm text-gray-600">
                      <p><strong>Category:</strong> {eventType.category}</p>
                      <p><strong>Estimated Duration:</strong> {eventType.estimatedDuration} minutes</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Task Checklist */}
              {universalEvent.tasks && universalEvent.tasks.length > 0 && (
                <div className="mb-6 pb-6">
                  <TaskChecklist
                    tasks={universalEvent.tasks}
                    currentUserRole={userRole}
                    onTaskComplete={handleTaskComplete}
                    onTaskUndo={handleTaskUndo}
                    onTaskStart={handleTaskStart}
                    completionStamps={getStampsForEvent(universalEvent.id)}
                    eventType={universalEvent.type}
                  />
                </div>
              )}

              {/* Debug info if no tasks */}
              {(!universalEvent.tasks || universalEvent.tasks.length === 0) && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Debug:</strong> No tasks found for this event.
                    <br />Event Type: {universalEvent.type}
                    <br />Task templates count: {taskTemplates.length}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'message' && (
            <EventMessaging
              event={universalEvent}
              messageText={messageText}
              setMessageText={setMessageText}
              onSendMessage={handleSendMessage}
              userRole={userRole}
            />
          )}
          
          {activeTab === 'timeline' && (
            <EventTimeline event={universalEvent} userRole={userRole} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalEventDetailModal;
