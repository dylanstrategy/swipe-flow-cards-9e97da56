
import React from 'react';
import SwipeCard from '../SwipeCard';
import { cn } from '@/lib/utils';

interface Suggestion {
  id: number;
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface SuggestionsSectionProps {
  onSchedule: (type: string) => void;
  onAction: (action: string, item: string) => void;
}

const SuggestionsSection = ({ onSchedule, onAction }: SuggestionsSectionProps) => {
  const suggestions: Suggestion[] = [
    { id: 1, type: 'payment', title: 'Rent Due Soon', description: 'Due in 3 days - $1,550', priority: 'high' },
    { id: 2, type: 'service', title: 'Quarterly Cleaning', description: 'Schedule your quarterly deep clean', priority: 'medium' },
    { id: 3, type: 'event', title: 'Rooftop BBQ', description: 'This Saturday 6PM - RSVP needed', priority: 'low' },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Suggestions</h2>
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
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
                <p className="text-gray-600 text-sm">{suggestion.description}</p>
              </div>
            </div>
          </SwipeCard>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsSection;
