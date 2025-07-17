import React from 'react';

interface SuggestionCard {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low' | 'urgent';
  category: string;
  type?: string;
}

interface TodaysSuggestionCardsProps {
  suggestions: SuggestionCard[];
  onCardTap: (suggestion: SuggestionCard) => void;
  onCardSwipeUp: (suggestion: SuggestionCard) => void;
  onCardSwipeDown: (suggestion: SuggestionCard) => void;
  className?: string;
}

const TodaysSuggestionCards = ({ 
  suggestions, 
  onCardTap, 
  onCardSwipeUp, 
  onCardSwipeDown, 
  className = '' 
}: TodaysSuggestionCardsProps) => {
  // Filter out completed events
  const activeEvents = suggestions.filter(s => s.title !== 'Complete work order');

  // Create infinite scroll by repeating the events multiple times
  const infiniteEvents = Array.from({ length: 20 }, (_, i) => 
    activeEvents[i % activeEvents.length]
  ).filter(Boolean);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-green-500';
    }
  };

  const getPriorityText = (priority: string) => {
    return priority.toUpperCase();
  };

  if (activeEvents.length === 0) {
    return null;
  }

  return (
    <div className={`mb-6 ${className}`}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Today's Suggestions</h2>
        <p className="text-sm text-gray-600">Events from yesterday that still need your attention</p>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
          {infiniteEvents.map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="flex-shrink-0 w-80"
              onClick={() => onCardTap(event)}
            >
              <div className="relative bg-amber-50 rounded-2xl p-1 overflow-hidden">
                {/* Left accent */}
                <div className="absolute left-0 top-4 bottom-4 w-6 bg-yellow-400 rounded-r-lg"></div>
                
                {/* Right accent */}
                <div className="absolute right-0 top-4 bottom-4 w-6 bg-yellow-400 rounded-l-lg"></div>

                <div
                  className={`${getPriorityColor(event.priority)} rounded-xl p-6 mx-3 min-h-[200px] flex flex-col justify-between text-white relative cursor-pointer hover:scale-105 transition-transform duration-200`}
                >
                  {/* Priority badge */}
                  <div className="inline-block">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                      {getPriorityText(event.priority)}
                    </span>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 flex flex-col justify-center py-4">
                    <h3 className="text-2xl font-bold mb-2 leading-tight">{event.title}</h3>
                    <p className="text-lg opacity-90 mb-1">{event.description}</p>
                    <p className="text-base opacity-75 capitalize">{event.category}</p>
                  </div>

                  {/* Bottom section */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm opacity-75">Tap to open</p>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCardSwipeUp(event);
                        }}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 mb-2"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodaysSuggestionCards;