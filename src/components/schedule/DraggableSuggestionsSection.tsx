
import React, { useState } from 'react';
import { format, differenceInDays, isPast, isToday } from 'date-fns';
import { ChevronDown, ChevronUp, Calendar, MessageSquare, Wrench, Gift, Coffee, Car, AlertTriangle } from 'lucide-react';
import { sharedEventService } from '@/services/sharedEventService';

export type EventStatus = 
  | "scheduled"
  | "in-progress" 
  | "overdue"
  | "complete"
  | "cancelled"
  | "urgent";

export type Priority = "low" | "medium" | "high";

interface Suggestion {
  id: number;
  title: string;
  description: string;
  type: string;
  priority: Priority;
  status?: EventStatus;
  estimatedTime?: string;
  category?: string;
  dueDate?: Date;
  createdDate: Date;
  isCompleted: boolean;
  completedDate?: Date;
  scheduledCount: number;
}

interface DraggableSuggestionsSectionProps {
  scheduledSuggestionIds: number[];
  completedSuggestionIds?: number[];
  onDropInTimeline?: (suggestion: any, targetTime?: string) => void;
  selectedDate: Date;
}

const DraggableSuggestionsSection = ({ 
  scheduledSuggestionIds,
  completedSuggestionIds = [],
  onDropInTimeline,
  selectedDate
}: DraggableSuggestionsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get incomplete events from shared service - filter for incomplete tasks only
  const getIncompleteEventsAsSuggestions = (): Suggestion[] => {
    const todayEvents = sharedEventService.getEventsForRoleAndDate('resident', selectedDate);
    
    return todayEvents
      .filter(event => {
        // Only show events that have incomplete required tasks
        const requiredTasks = event.tasks.filter(task => task.isRequired);
        const completedRequiredTasks = requiredTasks.filter(task => task.isComplete);
        
        // Show if there are incomplete required tasks
        return completedRequiredTasks.length < requiredTasks.length;
      })
      .map(event => {
        // Dynamically assign status based on event state
        let status: EventStatus = "scheduled";
        const now = new Date();
        const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
        
        // Check if event is overdue
        if (isPast(eventDate) && !isToday(eventDate)) {
          status = "overdue";
        } else if (isToday(eventDate) && event.time) {
          try {
            const [hours, minutes] = event.time.split(':').map(Number);
            const eventDateTime = new Date(eventDate);
            eventDateTime.setHours(hours, minutes || 0, 0, 0);
            
            if (isPast(eventDateTime)) {
              status = "overdue";
            } else if (eventDateTime.getTime() - now.getTime() <= 60 * 60 * 1000) { // Within 1 hour
              status = "urgent";
            }
          } catch (error) {
            console.warn('Error parsing event time:', event.time, error);
          }
        }
        
        // Check task completion status
        const completedTasks = event.tasks.filter(task => task.isComplete);
        if (completedTasks.length > 0 && completedTasks.length < event.tasks.length) {
          status = "in-progress";
        } else if (completedTasks.length === event.tasks.length) {
          status = "complete";
        }

        return {
          id: parseInt(event.id as string) || Math.random() * 1000,
          title: event.title,
          description: event.description,
          type: event.type,
          priority: (event.priority === 'urgent' ? 'high' : event.priority) as Priority,
          status,
          estimatedTime: event.estimatedDuration ? `${event.estimatedDuration} min` : '30 min',
          category: event.category,
          dueDate: event.date instanceof Date ? event.date : new Date(event.date),
          createdDate: event.createdAt,
          isCompleted: false,
          scheduledCount: event.rescheduledCount || 0
        };
      });
  };

  // Enhanced suggestions with completion tracking and due dates
  const staticSuggestions: Suggestion[] = [
    {
      id: 1,
      title: 'Schedule Annual Inspection',
      description: 'Fire safety and HVAC inspection overdue',
      type: 'Maintenance',
      priority: 'high',
      status: 'overdue',
      estimatedTime: '2 hours',
      category: 'safety',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      scheduledCount: 2
    },
    {
      id: 2,
      title: 'Community Newsletter',
      description: 'Monthly updates and announcements pending',
      type: 'Message',
      priority: 'medium',
      status: 'scheduled',
      estimatedTime: '15 min',
      category: 'communication',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      scheduledCount: 0
    },
    {
      id: 3,
      title: 'Book Dog Walking Service',
      description: 'Professional pet care request pending',
      type: 'Service',
      priority: 'low',
      status: 'scheduled',
      estimatedTime: '30 min',
      category: 'pet',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      scheduledCount: 1
    },
    {
      id: 4,
      title: 'Coffee Shop Discount',
      description: '25% off at ground floor café expires soon',
      type: 'Offer',
      priority: 'low',
      status: 'urgent',
      estimatedTime: '5 min',
      category: 'dining',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      scheduledCount: 0
    },
    {
      id: 5,
      title: 'Parking Spot Upgrade',
      description: 'Covered parking now available - respond needed',
      type: 'Service',
      priority: 'medium',
      status: 'scheduled',
      estimatedTime: '10 min',
      category: 'parking',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      scheduledCount: 1
    },
    {
      id: 6,
      title: 'Lease Renewal Reminder',
      description: 'Review your renewal options - deadline approaching',
      type: 'Message',
      priority: 'high',
      status: 'overdue',
      estimatedTime: '20 min',
      category: 'lease',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      scheduledCount: 3
    }
  ];

  // Combine real incomplete events with static suggestions
  const incompleteEvents = getIncompleteEventsAsSuggestions();
  const allSuggestions = [...incompleteEvents, ...staticSuggestions];

  // Filter suggestions based on completion status and scheduling
  const getAvailableSuggestions = () => {
    return allSuggestions
      .filter(suggestion => {
        // Don't show completed suggestions
        if (suggestion.isCompleted || completedSuggestionIds.includes(suggestion.id)) {
          return false;
        }
        
        // Show all uncompleted suggestions (they persist until completed)
        return true;
      })
      .sort((a, b) => {
        // Sort by status first (overdue > urgent > in-progress > scheduled)
        const statusOrder = { 
          'overdue': 4, 
          'urgent': 3, 
          'in-progress': 2, 
          'scheduled': 1,
          'complete': 0,
          'cancelled': 0
        };
        const statusDiff = (statusOrder[b.status || 'scheduled'] || 1) - (statusOrder[a.status || 'scheduled'] || 1);
        if (statusDiff !== 0) return statusDiff;
        
        // Then by priority
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then by due date (earliest first)
        if (a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime();
        }
        
        return 0;
      });
  };

  const availableSuggestions = getAvailableSuggestions();

  const getIcon = (type: string) => {
    switch (type) {
      case 'Maintenance': return <Wrench className="w-4 h-4" />;
      case 'Message': return <MessageSquare className="w-4 h-4" />;
      case 'Service': return <Car className="w-4 h-4" />;
      case 'Offer': return <Gift className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: EventStatus | undefined, priority: Priority) => {
    switch (status) {
      case 'overdue': return 'bg-red-500 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'in-progress': return 'bg-blue-500 text-white';
      case 'complete': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      default:
        // Fallback to priority-based colors for scheduled status
        switch (priority) {
          case 'high': return 'bg-red-500 text-white';
          case 'medium': return 'bg-yellow-500 text-white';
          case 'low': return 'bg-green-500 text-white';
          default: return 'bg-gray-500 text-white';
        }
    }
  };

  const getUrgencyIndicator = (suggestion: Suggestion) => {
    const isOverdue = suggestion.status === 'overdue' || (suggestion.dueDate && isPast(suggestion.dueDate));
    const daysOverdue = suggestion.dueDate ? Math.abs(differenceInDays(new Date(), suggestion.dueDate)) : 0;
    
    if (suggestion.status === 'overdue' || isOverdue) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <AlertTriangle className="w-3 h-3" />
          <span className="text-xs font-medium">
            {daysOverdue === 0 ? 'Due today' : `${daysOverdue}d overdue`}
          </span>
        </div>
      );
    }
    
    if (suggestion.status === 'urgent') {
      return (
        <div className="flex items-center gap-1 text-orange-600">
          <AlertTriangle className="w-3 h-3" />
          <span className="text-xs font-medium">Urgent</span>
        </div>
      );
    }
    
    if (suggestion.dueDate) {
      const daysUntilDue = differenceInDays(suggestion.dueDate, new Date());
      if (daysUntilDue <= 1) {
        return (
          <div className="text-orange-600 text-xs font-medium">
            {daysUntilDue === 0 ? 'Due today' : 'Due tomorrow'}
          </div>
        );
      }
    }
    
    if (suggestion.scheduledCount > 0) {
      return (
        <div className="text-blue-600 text-xs">
          Scheduled {suggestion.scheduledCount} time{suggestion.scheduledCount > 1 ? 's' : ''}
        </div>
      );
    }
    
    return null;
  };

  const handleDragStart = (e: React.DragEvent, suggestion: Suggestion) => {
    console.log('Suggestion drag start:', suggestion);
    const dragData = {
      type: 'suggestion',
      id: suggestion.id,
      title: suggestion.title,
      description: suggestion.description,
      suggestionType: suggestion.type,
      priority: suggestion.priority,
      status: suggestion.status,
      estimatedTime: suggestion.estimatedTime,
      category: suggestion.category,
      dueDate: suggestion.dueDate,
      scheduledCount: suggestion.scheduledCount
    };
    console.log('Setting drag data:', dragData);
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  if (availableSuggestions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="text-center text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h3 className="font-medium text-gray-900 mb-1">All caught up!</h3>
          <p className="text-sm">No pending tasks for {format(selectedDate, 'MMMM d')}</p>
        </div>
      </div>
    );
  }

  const overdueCount = availableSuggestions.filter(s => s.status === 'overdue').length;
  const urgentCount = availableSuggestions.filter(s => s.status === 'urgent').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100 flex items-center justify-between hover:from-purple-100 hover:to-pink-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Today's Suggestions ({availableSuggestions.length})
          </h3>
          {overdueCount > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {overdueCount} overdue
            </span>
          )}
          {urgentCount > 0 && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
              {urgentCount} urgent
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {availableSuggestions.map((suggestion) => {
              const isScheduled = scheduledSuggestionIds.includes(suggestion.id);
              
              return (
                <div
                  key={suggestion.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, suggestion)}
                  className={`p-3 rounded-lg border cursor-move transition-all duration-200 hover:shadow-md ${
                    suggestion.status === 'overdue'
                      ? 'border-red-200 bg-red-50' 
                      : suggestion.status === 'urgent'
                      ? 'border-orange-200 bg-orange-50'
                      : isScheduled
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-1.5 rounded ${
                      suggestion.status === 'overdue'
                        ? 'bg-red-200 text-red-700' 
                        : suggestion.status === 'urgent'
                        ? 'bg-orange-200 text-orange-700'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {getIcon(suggestion.type)}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(suggestion.status, suggestion.priority)}`}>
                      {suggestion.status || suggestion.priority}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1">
                    {suggestion.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {suggestion.description}
                  </p>
                  
                  {getUrgencyIndicator(suggestion)}
                  
                  {suggestion.estimatedTime && (
                    <div className="text-xs text-gray-500 mt-1">
                      {suggestion.estimatedTime}
                    </div>
                  )}

                  <button
                    onClick={() => onDropInTimeline && onDropInTimeline(suggestion)}
                    className="w-full mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {isScheduled ? 'Reschedule' : 'Schedule'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Drag tasks to the calendar above to schedule them
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableSuggestionsSection;
