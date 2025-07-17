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

  // Enhanced event suggestions with more variety
  const enhancedEvents: SuggestionCard[] = [
    { id: 1, title: 'Book community room', description: 'Reserve for weekend event', priority: 'low' as const, category: 'Community' },
    { id: 2, title: 'Schedule maintenance', description: 'Fix kitchen faucet leak', priority: 'high' as const, category: 'Maintenance' },
    { id: 3, title: 'Pay monthly rent', description: 'Rent due in 3 days', priority: 'urgent' as const, category: 'Payment' },
    { id: 4, title: 'Submit work order', description: 'Bathroom light not working', priority: 'medium' as const, category: 'Maintenance' },
    { id: 5, title: 'Renew lease', description: 'Lease expires next month', priority: 'high' as const, category: 'Leasing' },
    { id: 6, title: 'Schedule tour', description: 'Show friend available unit', priority: 'low' as const, category: 'Leasing' },
    { id: 7, title: 'Update emergency contact', description: 'Required information missing', priority: 'medium' as const, category: 'Profile' },
    { id: 8, title: 'Book gym session', description: 'Reserve fitness center time', priority: 'low' as const, category: 'Amenities' },
    { id: 9, title: 'Submit parking request', description: 'Need guest parking pass', priority: 'medium' as const, category: 'Parking' },
    { id: 10, title: 'Schedule move-out', description: 'Coordinate inspection', priority: 'high' as const, category: 'Moving' },
    ...activeEvents
  ];

  // Create infinite scroll with variety
  const infiniteEvents = Array.from({ length: 30 }, (_, i) => 
    enhancedEvents[i % enhancedEvents.length]
  ).filter(Boolean);

  const getPriorityText = (priority: string) => {
    return priority.toUpperCase();
  };

  if (activeEvents.length === 0) {
    return null;
  }

    return (
      <div className={`mb-6 ${className}`}>
        <div className="bg-yellow-100 px-4 pt-4 pb-8 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Today's Suggestions</h2>
          <p className="text-sm text-gray-600">Events from yesterday that still need your attention</p>
        </div>

        <div className="bg-yellow-100 overflow-x-auto scrollbar-hide pb-8">
          <div className="flex space-x-4 px-4" style={{ width: 'max-content' }}>
            {infiniteEvents.map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                className="flex-shrink-0 w-80 relative"
                onClick={() => onCardTap(event)}
              >
                {/* Left accent strip */}
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-orange-400 rounded-l-2xl z-10"></div>
                
                {/* Right accent strip */}
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-orange-400 rounded-r-2xl z-10"></div>

                {/* Main card */}
                <div className="bg-green-500 rounded-2xl h-80 flex flex-col justify-between text-white relative cursor-pointer hover:scale-[1.02] transition-transform duration-300 mx-3 p-6">
                  {/* Priority badge */}
                  <div className="flex justify-start">
                    <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                      {getPriorityText(event.priority)}
                    </span>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3 leading-tight">{event.title}</h3>
                    <p className="text-lg opacity-90 mb-4">{event.description}</p>
                    <p className="text-base opacity-80 font-medium">{event.category}</p>
                  </div>

                  {/* Bottom section */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm opacity-75">Swipe to navigate</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold mb-1">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <p className="text-sm opacity-75">
                        of {String(infiniteEvents.length).padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="bg-yellow-100 flex justify-center space-x-2 pb-4 rounded-b-2xl">
          {Array.from({ length: Math.min(5, infiniteEvents.length) }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === 0 ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
};

export default TodaysSuggestionCards;