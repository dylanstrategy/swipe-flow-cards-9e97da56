
import React, { useState } from 'react';
import { format, differenceInDays, isPast, isToday } from 'date-fns';
import { ChevronDown, ChevronUp, Calendar, MessageSquare, Wrench, Gift, Coffee, Car, AlertTriangle } from 'lucide-react';

interface Suggestion {
  id: number;
  title: string;
  description: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: string;
  category?: string;
  dueDate?: Date;
  createdDate: Date;
  isCompleted: boolean;
  completedDate?: Date;
  scheduledCount: number; // How many times it's been scheduled but not completed
}

interface DraggableSuggestionsSectionProps {
  selectedDate: Date;
  onSchedule: (type: string) => void;
  onAction: (action: string, item: string) => void;
  scheduledSuggestionIds: number[];
  completedSuggestionIds?: number[];
}

const DraggableSuggestionsSection = ({ 
  selectedDate, 
  onSchedule, 
  onAction,
  scheduledSuggestionIds,
  completedSuggestionIds = []
}: DraggableSuggestionsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Enhanced suggestions with completion tracking and due dates
  const suggestions: Suggestion[] = [
    {
      id: 1,
      title: 'Schedule Annual Inspection',
      description: 'Fire safety and HVAC inspection overdue',
      type: 'Maintenance',
      priority: 'high',
      estimatedTime: '2 hours',
      category: 'safety',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days overdue
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
      estimatedTime: '15 min',
      category: 'communication',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Due in 2 days
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
      estimatedTime: '30 min',
      category: 'pet',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days
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
      estimatedTime: '5 min',
      category: 'dining',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Due tomorrow
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
      estimatedTime: '10 min',
      category: 'parking',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Due in 3 days
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
      estimatedTime: '20 min',
      category: 'lease',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day overdue
      createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      scheduledCount: 3
    }
  ];

  // Filter suggestions based on completion status and scheduling
  const getAvailableSuggestions = () => {
    return suggestions
      .filter(suggestion => {
        // Don't show completed suggestions
        if (suggestion.isCompleted || completedSuggestionIds.includes(suggestion.id)) {
          return false;
        }
        
        // Show all uncompleted suggestions (they persist until completed)
        return true;
      })
      .sort((a, b) => {
        // Sort by priority and overdue status
        const aIsOverdue = a.dueDate && isPast(a.dueDate);
        const bIsOverdue = b.dueDate && isPast(b.dueDate);
        
        // Overdue items first
        if (aIsOverdue && !bIsOverdue) return -1;
        if (!aIsOverdue && bIsOverdue) return 1;
        
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

  const getPriorityColor = (priority: string, isOverdue: boolean = false) => {
    if (isOverdue) {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIndicator = (suggestion: Suggestion) => {
    const isOverdue = suggestion.dueDate && isPast(suggestion.dueDate);
    const daysOverdue = suggestion.dueDate ? Math.abs(differenceInDays(new Date(), suggestion.dueDate)) : 0;
    
    if (isOverdue) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <AlertTriangle className="w-3 h-3" />
          <span className="text-xs font-medium">
            {daysOverdue === 0 ? 'Due today' : `${daysOverdue}d overdue`}
          </span>
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
      type: 'suggestion', // This identifies it as a dragged suggestion
      id: suggestion.id,
      title: suggestion.title,
      description: suggestion.description,
      suggestionType: suggestion.type, // This is the actual suggestion type like "Maintenance"
      priority: suggestion.priority,
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h3 className="font-medium text-gray-900 mb-1">All caught up!</h3>
          <p className="text-sm">No pending tasks for {format(selectedDate, 'MMMM d')}</p>
        </div>
      </div>
    );
  }

  const overdueCount = availableSuggestions.filter(s => s.dueDate && isPast(s.dueDate)).length;
  const highPriorityCount = availableSuggestions.filter(s => s.priority === 'high').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100 flex items-center justify-between hover:from-purple-100 hover:to-pink-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Pending Tasks ({availableSuggestions.length})
          </h3>
          {overdueCount > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {overdueCount} overdue
            </span>
          )}
          {highPriorityCount > 0 && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
              {highPriorityCount} urgent
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3">
            {availableSuggestions.map((suggestion) => {
              const isOverdue = suggestion.dueDate && isPast(suggestion.dueDate);
              const isScheduled = scheduledSuggestionIds.includes(suggestion.id);
              
              return (
                <div
                  key={suggestion.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, suggestion)}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-move group ${
                    isOverdue 
                      ? 'border-red-300 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg' 
                      : isScheduled
                      ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md'
                      : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`flex-shrink-0 p-2 rounded-md transition-colors ${
                      isOverdue 
                        ? 'bg-red-200 text-red-700' 
                        : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                    }`}>
                      {getIcon(suggestion.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 leading-tight">
                        {suggestion.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {suggestion.description}
                      </p>
                      
                      <div className="mt-2">
                        {getUrgencyIndicator(suggestion)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority, isOverdue)}`}>
                      {suggestion.priority}
                    </span>
                    {suggestion.estimatedTime && (
                      <span className="text-xs text-gray-500">
                        {suggestion.estimatedTime}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => onSchedule(suggestion.type)}
                      className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {isScheduled ? 'Reschedule' : 'Schedule Now'}
                    </button>
                  </div>
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
