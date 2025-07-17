import React, { useState } from 'react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';

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
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter out completed events
  const activeEvents = suggestions.filter(s => s.title !== 'Complete work order');

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

  const navigateToCard = (index: number) => {
    if (index >= 0 && index < activeEvents.length) {
      setCurrentIndex(index);
    }
  };

  const navigateLeft = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : activeEvents.length - 1;
    setCurrentIndex(newIndex);
  };

  const navigateRight = () => {
    const newIndex = currentIndex < activeEvents.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
  };

  if (activeEvents.length === 0) {
    return null;
  }

  const currentCard = activeEvents[currentIndex];

  const swipeGestures = useSwipeGestures({
    onSwipeUp: () => onCardSwipeUp(currentCard),
    onSwipeDown: () => onCardSwipeDown(currentCard),
    onSwipeLeft: navigateRight,
    onSwipeRight: navigateLeft,
    canSwipeUp: true
  });

  return (
    <div className={`mb-6 ${className}`}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Today's Suggestions</h2>
        <p className="text-sm text-gray-600">Events from yesterday that still need your attention</p>
      </div>

      <div className="relative">
        <div
          className="relative bg-amber-50 rounded-2xl p-1 overflow-hidden"
          {...swipeGestures}
          onClick={() => onCardTap(currentCard)}
        >
          {/* Left accent */}
          <div className="absolute left-0 top-4 bottom-4 w-6 bg-yellow-400 rounded-r-lg"></div>
          
          {/* Right accent */}
          <div className="absolute right-0 top-4 bottom-4 w-6 bg-yellow-400 rounded-l-lg"></div>

          <div
            className={`${getPriorityColor(currentCard.priority)} rounded-xl p-6 mx-3 min-h-[200px] flex flex-col justify-between text-white relative cursor-pointer`}
            style={{
              transform: `translateY(${swipeGestures.dragOffset.y}px) translateX(${swipeGestures.dragOffset.x}px)`,
              opacity: swipeGestures.showAction ? 0.8 : 1
            }}
          >
            {/* Priority badge */}
            <div className="inline-block">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                {getPriorityText(currentCard.priority)}
              </span>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col justify-center py-4">
              <h3 className="text-2xl font-bold mb-2 leading-tight">{currentCard.title}</h3>
              <p className="text-lg opacity-90 mb-1">{currentCard.description}</p>
              <p className="text-base opacity-75 capitalize">{currentCard.category}</p>
            </div>

            {/* Bottom section */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm opacity-75">Swipe to navigate</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  {String(currentIndex + 1).padStart(2, '0')}
                </p>
                <p className="text-sm opacity-75">
                  of {String(activeEvents.length).padStart(2, '0')}
                </p>
              </div>
            </div>

            {/* Swipe Indicators */}
            {swipeGestures.showAction && swipeGestures.dragOffset.y < -20 && (
              <div className="absolute inset-0 bg-green-600 bg-opacity-90 flex items-center justify-center rounded-xl">
                <div className="text-white text-center">
                  <div className="text-3xl mb-2">⬆️</div>
                  <div className="text-lg font-medium">Auto Schedule</div>
                </div>
              </div>
            )}
            
            {swipeGestures.showAction && swipeGestures.dragOffset.y > 20 && (
              <div className="absolute inset-0 bg-blue-600 bg-opacity-90 flex items-center justify-center rounded-xl">
                <div className="text-white text-center">
                  <div className="text-3xl mb-2">⬇️</div>
                  <div className="text-lg font-medium">Schedule Later</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dots indicator */}
        {activeEvents.length > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {activeEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToCard(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysSuggestionCards;