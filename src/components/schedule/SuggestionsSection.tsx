
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

  // Get swipe actions based on event type - this will be configurable later
  const getSwipeActionsForEvent = (suggestion: Suggestion) => {
    // Load user's swipe preferences from localStorage (will be set in notifications/gestures)
    const swipePreferences = JSON.parse(localStorage.getItem('swipeGesturePreferences') || '{}');
    
    const defaultActions = {
      payment: {
        left: { label: "Remind Me", action: () => onAction("Remind Me", suggestion.title), color: "#F59E0B", icon: "⏰" },
        right: { label: "Pay Now", action: () => onAction("Pay Now", suggestion.title), color: "#10B981", icon: "💳" }
      },
      service: {
        left: { label: "Skip", action: () => onAction("Skipped", suggestion.title), color: "#6B7280", icon: "⏭️" },
        right: { label: "Schedule", action: () => onSchedule(suggestion.type), color: "#10B981", icon: "📅" }
      },
      event: {
        left: { label: "Not Interested", action: () => onAction("Not Interested", suggestion.title), color: "#EF4444", icon: "❌" },
        right: { label: "RSVP", action: () => onAction("RSVP", suggestion.title), color: "#10B981", icon: "✅" }
      }
    };

    const userPreference = swipePreferences[suggestion.type];
    const defaultAction = defaultActions[suggestion.type as keyof typeof defaultActions];
    
    return {
      onSwipeLeft: userPreference?.left || defaultAction?.left || { label: "Remind Me", action: () => onAction("Remind Me", suggestion.title), color: "#F59E0B", icon: "⏰" },
      onSwipeRight: userPreference?.right || defaultAction?.right || { label: "Schedule", action: () => onSchedule(suggestion.type), color: "#10B981", icon: "📅" }
    };
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onAction("Viewed", suggestion.title);
  };

  const handleSuggestionContextMenu = (e: React.MouseEvent, suggestion: Suggestion) => {
    e.preventDefault();
    const actions = getSwipeActionsForEvent(suggestion);
    
    // Create a simple context menu
    const contextMenu = document.createElement('div');
    contextMenu.className = 'fixed bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50';
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
    
    const leftOption = document.createElement('button');
    leftOption.className = 'block w-full text-left px-3 py-2 hover:bg-gray-100 rounded';
    leftOption.textContent = `${actions.onSwipeLeft.icon} ${actions.onSwipeLeft.label}`;
    leftOption.onclick = () => {
      actions.onSwipeLeft.action();
      document.body.removeChild(contextMenu);
    };
    
    const rightOption = document.createElement('button');
    rightOption.className = 'block w-full text-left px-3 py-2 hover:bg-gray-100 rounded';
    rightOption.textContent = `${actions.onSwipeRight.icon} ${actions.onSwipeRight.label}`;
    rightOption.onclick = () => {
      actions.onSwipeRight.action();
      document.body.removeChild(contextMenu);
    };
    
    contextMenu.appendChild(leftOption);
    contextMenu.appendChild(rightOption);
    document.body.appendChild(contextMenu);
    
    // Remove context menu when clicking elsewhere
    const handleClickOutside = (event: MouseEvent) => {
      if (!contextMenu.contains(event.target as Node)) {
        document.body.removeChild(contextMenu);
        document.removeEventListener('click', handleClickOutside);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Suggestions</h2>
      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          const swipeActions = getSwipeActionsForEvent(suggestion);
          
          return (
            <SwipeCard
              key={suggestion.id}
              onSwipeRight={swipeActions.onSwipeRight}
              onSwipeLeft={swipeActions.onSwipeLeft}
              onTap={() => handleSuggestionClick(suggestion)}
            >
              <div 
                className="flex items-center p-4 bg-white rounded-lg border-l-4 border-blue-500 cursor-pointer"
                onContextMenu={(e) => handleSuggestionContextMenu(e, suggestion)}
              >
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
          );
        })}
      </div>
    </div>
  );
};

export default SuggestionsSection;
