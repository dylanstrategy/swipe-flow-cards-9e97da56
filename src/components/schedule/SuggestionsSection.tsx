
import React from 'react';
import SwipeCard from '../SwipeCard';
import { cn } from '@/lib/utils';
import { format, isSameDay, isToday } from 'date-fns';

interface Suggestion {
  id: number;
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeSlot?: string;
  duration?: string;
}

interface SuggestionsSectionProps {
  selectedDate: Date;
  onSchedule: (type: string) => void;
  onAction: (action: string, item: string) => void;
}

const SuggestionsSection = ({ selectedDate, onSchedule, onAction }: SuggestionsSectionProps) => {
  // Generate suggestions based on the selected date
  const generateSuggestionsForDate = (date: Date): Suggestion[] => {
    const baseId = date.getTime();
    
    if (isToday(date)) {
      return [
        { 
          id: baseId + 1, 
          type: 'payment', 
          title: 'Rent Due Soon', 
          description: 'Due in 3 days - $1,550', 
          priority: 'high',
          timeSlot: '2:00 PM - 3:00 PM',
          duration: '1 hour'
        },
        { 
          id: baseId + 2, 
          type: 'service', 
          title: 'Free Time Slot Available', 
          description: 'Perfect time for quarterly cleaning', 
          priority: 'medium',
          timeSlot: '10:00 AM - 12:00 PM',
          duration: '2 hours'
        },
        { 
          id: baseId + 3, 
          type: 'event', 
          title: 'Community Event Planning', 
          description: 'Help organize this Saturday\'s BBQ', 
          priority: 'low',
          timeSlot: '4:00 PM - 5:00 PM',
          duration: '1 hour'
        },
      ];
    }

    // Future dates get different suggestions
    const daysDiff = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      return [
        { 
          id: baseId + 1, 
          type: 'maintenance', 
          title: 'Schedule Maintenance', 
          description: 'Free slot available for HVAC check', 
          priority: 'medium',
          timeSlot: '9:00 AM - 11:00 AM',
          duration: '2 hours'
        },
        { 
          id: baseId + 2, 
          type: 'meeting', 
          title: 'Lease Discussion', 
          description: 'Available time to discuss renewal', 
          priority: 'high',
          timeSlot: '3:00 PM - 4:00 PM',
          duration: '1 hour'
        },
      ];
    }

    if (daysDiff >= 2 && daysDiff <= 7) {
      return [
        { 
          id: baseId + 1, 
          type: 'service', 
          title: 'Book Cleaning Service', 
          description: 'Multiple time slots available', 
          priority: 'medium',
          timeSlot: '10:00 AM - 2:00 PM',
          duration: '4 hours'
        },
        { 
          id: baseId + 2, 
          type: 'tour', 
          title: 'Property Tour Available', 
          description: 'Show friends around the building', 
          priority: 'low',
          timeSlot: '1:00 PM - 2:30 PM',
          duration: '1.5 hours'
        },
      ];
    }

    // Weekend suggestions
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend) {
      return [
        { 
          id: baseId + 1, 
          type: 'event', 
          title: 'Weekend Activity', 
          description: 'Join the rooftop social event', 
          priority: 'medium',
          timeSlot: '6:00 PM - 8:00 PM',
          duration: '2 hours'
        },
        { 
          id: baseId + 2, 
          type: 'personal', 
          title: 'Free Time Available', 
          description: 'Perfect for personal errands', 
          priority: 'low',
          timeSlot: '11:00 AM - 4:00 PM',
          duration: '5 hours'
        },
      ];
    }

    // Default weekday suggestions
    return [
      { 
        id: baseId + 1, 
        type: 'meeting', 
        title: 'Available Meeting Slot', 
        description: 'Schedule important discussions', 
        priority: 'medium',
        timeSlot: '2:00 PM - 3:00 PM',
        duration: '1 hour'
      },
      { 
        id: baseId + 2, 
        type: 'service', 
        title: 'Service Window Open', 
        description: 'Book maintenance or cleaning', 
        priority: 'low',
        timeSlot: '9:00 AM - 12:00 PM',
        duration: '3 hours'
      },
    ];
  };

  const suggestions = generateSuggestionsForDate(selectedDate);

  const getDateDisplayText = () => {
    if (isToday(selectedDate)) {
      return "Today's Suggestions";
    }
    return `Suggestions for ${format(selectedDate, 'EEEE, MMM d')}`;
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{getDateDisplayText()}</h2>
      <div className="space-y-3">
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No suggestions available for this date.</p>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <SwipeCard
              key={suggestion.id}
              onSwipeRight={{
                label: "Schedule",
                action: () => onSchedule(suggestion.type),
                color: "#10B981",
                icon: "📅"
              }}
              onSwipeLeft={{
                label: "Remind Me",
                action: () => onAction("Remind Me", suggestion.title),
                color: "#F59E0B",
                icon: "⏰"
              }}
              onTap={() => onAction("Viewed", suggestion.title)}
            >
              <div className="flex items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      suggestion.priority === 'high' ? "bg-red-100 text-red-800" :
                      suggestion.priority === 'medium' ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    )}>
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{suggestion.description}</p>
                  {suggestion.timeSlot && (
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        🕐 {suggestion.timeSlot}
                      </span>
                      {suggestion.duration && (
                        <span className="flex items-center gap-1">
                          ⏱️ {suggestion.duration}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </SwipeCard>
          ))
        )}
      </div>
    </div>
  );
};

export default SuggestionsSection;
