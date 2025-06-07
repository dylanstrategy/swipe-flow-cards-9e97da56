
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Calendar, MessageSquare, Wrench, Gift, Coffee, Car } from 'lucide-react';

interface Suggestion {
  id: number;
  title: string;
  description: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: string;
  category?: string;
}

interface DraggableSuggestionsSectionProps {
  selectedDate: Date;
  onSchedule: (type: string) => void;
  onAction: (action: string, item: string) => void;
  scheduledSuggestionIds: number[];
}

const DraggableSuggestionsSection = ({ 
  selectedDate, 
  onSchedule, 
  onAction,
  scheduledSuggestionIds 
}: DraggableSuggestionsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const suggestions: Suggestion[] = [
    {
      id: 1,
      title: 'Schedule Annual Inspection',
      description: 'Fire safety and HVAC inspection due',
      type: 'Maintenance',
      priority: 'high',
      estimatedTime: '2 hours',
      category: 'safety'
    },
    {
      id: 2,
      title: 'Community Newsletter',
      description: 'Monthly updates and announcements',
      type: 'Message',
      priority: 'medium',
      estimatedTime: '15 min',
      category: 'communication'
    },
    {
      id: 3,
      title: 'Book Dog Walking Service',
      description: 'Professional pet care available',
      type: 'Service',
      priority: 'low',
      estimatedTime: '30 min',
      category: 'pet'
    },
    {
      id: 4,
      title: 'Coffee Shop Discount',
      description: '25% off at ground floor café',
      type: 'Offer',
      priority: 'low',
      estimatedTime: '5 min',
      category: 'dining'
    },
    {
      id: 5,
      title: 'Parking Spot Upgrade',
      description: 'Covered parking now available',
      type: 'Service',
      priority: 'medium',
      estimatedTime: '10 min',
      category: 'parking'
    },
    {
      id: 6,
      title: 'Lease Renewal Reminder',
      description: 'Review your renewal options',
      type: 'Message',
      priority: 'high',
      estimatedTime: '20 min',
      category: 'lease'
    }
  ];

  const availableSuggestions = suggestions.filter(
    suggestion => !scheduledSuggestionIds.includes(suggestion.id)
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'Maintenance': return <Wrench className="w-4 h-4" />;
      case 'Message': return <MessageSquare className="w-4 h-4" />;
      case 'Service': return <Car className="w-4 h-4" />;
      case 'Offer': return <Gift className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDragStart = (e: React.DragEvent, suggestion: Suggestion) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'suggestion',
      ...suggestion
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  if (availableSuggestions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h3 className="font-medium text-gray-900 mb-1">All caught up!</h3>
          <p className="text-sm">No pending suggestions for {format(selectedDate, 'MMMM d')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100 flex items-center justify-between hover:from-purple-100 hover:to-pink-100 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">
          Today's Suggestions ({availableSuggestions.length})
        </h3>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {availableSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                draggable
                onDragStart={(e) => handleDragStart(e, suggestion)}
                className="p-3 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-all duration-200 cursor-move group"
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex-shrink-0 p-1.5 rounded-md bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                    {getIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight truncate">
                      {suggestion.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {suggestion.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority}
                  </span>
                  {suggestion.estimatedTime && (
                    <span className="text-xs text-gray-500">
                      {suggestion.estimatedTime}
                    </span>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onSchedule(suggestion.type)}
                    className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Schedule Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Drag suggestions to the calendar above to schedule them
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableSuggestionsSection;

