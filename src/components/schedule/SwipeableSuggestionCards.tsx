import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';

interface SuggestionCard {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low' | 'urgent';
  category: string;
  type?: string;
}

interface SwipeableSuggestionCardsProps {
  suggestions: SuggestionCard[];
  onCardTap: (suggestion: SuggestionCard) => void;
  onCardSwipeUp: (suggestion: SuggestionCard) => void;
  onCardSwipeDown: (suggestion: SuggestionCard) => void;
  className?: string;
  isExpanded?: boolean;
}

const SwipeableSuggestionCards = ({ 
  suggestions, 
  onCardTap, 
  onCardSwipeUp, 
  onCardSwipeDown, 
  className = '',
  isExpanded = false 
}: SwipeableSuggestionCardsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(280);

  // Filter out completed events
  const activeEvents = suggestions.filter(s => s.title !== 'Complete work order');

  useEffect(() => {
    const updateCardWidth = () => {
      if (scrollRef.current) {
        const containerWidth = scrollRef.current.offsetWidth;
        const newCardWidth = Math.min(280, containerWidth - 40); // 20px margin on each side
        setCardWidth(newCardWidth);
      }
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const scrollLeft = index * (cardWidth + 16); // 16px for gap
      scrollRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const newIndex = Math.min(activeEvents.length - 1, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const SuggestionCardComponent = ({ suggestion }: { suggestion: SuggestionCard }) => {
    const swipeGestures = useSwipeGestures({
      onSwipeUp: () => onCardSwipeUp(suggestion),
      onSwipeDown: () => onCardSwipeDown(suggestion),
      canSwipeUp: true
    });

    return (
      <div
        className="relative flex-shrink-0 cursor-pointer"
        style={{ width: cardWidth }}
        onClick={() => onCardTap(suggestion)}
        {...swipeGestures}
      >
        <div
          className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 h-32 flex flex-col justify-between relative overflow-hidden ${
            swipeGestures.isDragging ? 'scale-95' : ''
          }`}
          style={{
            transform: `translateY(${swipeGestures.dragOffset.y}px) rotate(${swipeGestures.getRotation()}deg)`,
            opacity: swipeGestures.showAction ? 0.8 : 1
          }}
        >
          {/* Swipe Indicators */}
          {swipeGestures.showAction && swipeGestures.dragOffset.y < -20 && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center rounded-xl">
              <div className="text-white text-center">
                <div className="text-2xl mb-1">⬆️</div>
                <div className="text-sm font-medium">Auto Schedule</div>
              </div>
            </div>
          )}
          
          {swipeGestures.showAction && swipeGestures.dragOffset.y > 20 && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-90 flex items-center justify-center rounded-xl">
              <div className="text-white text-center">
                <div className="text-2xl mb-1">⬇️</div>
                <div className="text-sm font-medium">Schedule Later</div>
              </div>
            </div>
          )}

          <div className="flex items-start">
            <div className={`w-3 h-3 ${getPriorityColor(suggestion.priority)} rounded-full mr-3 mt-1 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-tight">{suggestion.title}</h3>
              <p className="text-gray-600 text-xs leading-tight">{suggestion.description}</p>
              <div className="text-xs text-gray-500 mt-1 capitalize">{suggestion.category}</div>
            </div>
          </div>

          <div className="text-xs text-gray-400 mt-2">
            Tap to view • Swipe up to schedule • Swipe down for later
          </div>
        </div>
      </div>
    );
  };

  if (activeEvents.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Suggestions</h3>
        {activeEvents.length > 1 && (
          <div className="flex space-x-2">
            <button
              onClick={scrollLeft}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full transition-all ${
                currentIndex === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollRight}
              disabled={currentIndex >= activeEvents.length - 1}
              className={`p-2 rounded-full transition-all ${
                currentIndex >= activeEvents.length - 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {activeEvents.map((suggestion) => (
          <SuggestionCardComponent key={suggestion.id} suggestion={suggestion} />
        ))}
      </div>

      {/* Dots indicator */}
      {activeEvents.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {activeEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SwipeableSuggestionCards;