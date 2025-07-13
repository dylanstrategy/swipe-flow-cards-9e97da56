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

interface MultidimensionalSuggestionCardsProps {
  suggestions: SuggestionCard[];
  onCardTap: (suggestion: SuggestionCard) => void;
  onCardSwipeUp: (suggestion: SuggestionCard) => void;
  onCardSwipeDown: (suggestion: SuggestionCard) => void;
  className?: string;
}

const MultidimensionalSuggestionCards = ({ 
  suggestions, 
  onCardTap, 
  onCardSwipeUp, 
  onCardSwipeDown, 
  className = '' 
}: MultidimensionalSuggestionCardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out completed events
  const activeEvents = suggestions.filter(s => s.title !== 'Complete work order');

  useEffect(() => {
    if (currentIndex >= activeEvents.length && activeEvents.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeEvents.length, currentIndex]);

  const goToNext = () => {
    if (isTransitioning || activeEvents.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % activeEvents.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToPrev = () => {
    if (isTransitioning || activeEvents.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + activeEvents.length) % activeEvents.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-gradient-to-br from-red-500 to-red-600';
      case 'high': return 'bg-gradient-to-br from-orange-500 to-orange-600';
      case 'medium': return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
      case 'low': return 'bg-gradient-to-br from-green-500 to-green-600';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  const getCardStyle = (index: number) => {
    if (activeEvents.length === 0) return { transform: 'scale(0)', opacity: 0, zIndex: 0 };
    
    const diff = (index - currentIndex + activeEvents.length) % activeEvents.length;
    const normalizedDiff = diff > activeEvents.length / 2 ? diff - activeEvents.length : diff;

    if (normalizedDiff === 0) {
      // Center card
      return {
        transform: 'translateX(0%) scale(1) rotateY(0deg)',
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1)'
      };
    } else if (normalizedDiff === 1 || normalizedDiff === -(activeEvents.length - 1)) {
      // Right card
      return {
        transform: 'translateX(85%) scale(0.8) rotateY(-15deg)',
        zIndex: 20,
        opacity: 0.7,
        filter: 'brightness(0.8)'
      };
    } else if (normalizedDiff === -1 || normalizedDiff === (activeEvents.length - 1)) {
      // Left card
      return {
        transform: 'translateX(-85%) scale(0.8) rotateY(15deg)',
        zIndex: 20,
        opacity: 0.7,
        filter: 'brightness(0.8)'
      };
    } else {
      // Hidden cards
      return {
        transform: `translateX(${normalizedDiff > 0 ? '200%' : '-200%'}) scale(0.6)`,
        zIndex: 10,
        opacity: 0,
        filter: 'brightness(0.6)'
      };
    }
  };

  const SuggestionCardComponent = ({ suggestion, index }: { suggestion: SuggestionCard; index: number }) => {
    const swipeGestures = useSwipeGestures({
      onSwipeUp: () => onCardSwipeUp(suggestion),
      onSwipeDown: () => onCardSwipeDown(suggestion),
      onSwipeLeft: goToNext,
      onSwipeRight: goToPrev,
      canSwipeUp: true
    });

    const style = getCardStyle(index);
    const isCenter = (index - currentIndex + activeEvents.length) % activeEvents.length === 0;

    return (
      <div
        className={`absolute inset-0 transition-all duration-300 ease-out cursor-pointer ${
          isTransitioning ? 'pointer-events-none' : ''
        }`}
        style={{
          transform: style.transform,
          zIndex: style.zIndex,
          opacity: style.opacity,
          filter: style.filter,
          transformStyle: 'preserve-3d'
        }}
        onClick={() => isCenter && onCardTap(suggestion)}
        {...(isCenter ? swipeGestures : {})}
      >
        <div
          className={`w-full h-full rounded-2xl shadow-2xl overflow-hidden ${getPriorityColor(suggestion.priority)} ${
            swipeGestures.isDragging && isCenter ? 'scale-95' : ''
          }`}
          style={{
            transform: isCenter ? `translateY(${swipeGestures.dragOffset?.y || 0}px)` : undefined,
            transition: isCenter && swipeGestures.isDragging ? 'none' : 'transform 0.3s ease'
          }}
        >
          {/* Swipe Indicators for center card */}
          {isCenter && swipeGestures.showAction === 'up' && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center rounded-2xl z-10">
              <div className="text-white text-center">
                <div className="text-4xl mb-2">⬆️</div>
                <div className="text-lg font-bold">Auto Schedule</div>
              </div>
            </div>
          )}
          
          {isCenter && swipeGestures.showAction === 'down' && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-90 flex items-center justify-center rounded-2xl z-10">
              <div className="text-white text-center">
                <div className="text-4xl mb-2">⬇️</div>
                <div className="text-lg font-bold">Schedule Later</div>
              </div>
            </div>
          )}

          <div className="relative h-full p-8 flex flex-col justify-between text-white">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white bg-opacity-20`}>
                {suggestion.priority}
              </div>
              {isCenter && (
                <div className="text-sm opacity-80 text-right">
                  <div>Tap to view</div>
                  <div>Swipe to schedule</div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4 leading-tight">{suggestion.title}</h2>
              <p className="text-lg opacity-90 leading-relaxed mb-4">{suggestion.description}</p>
              <div className="text-base opacity-75 capitalize font-medium">{suggestion.category}</div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end">
              <div className="text-sm opacity-70">
                Swipe to navigate
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{String(index + 1).padStart(2, '0')}</div>
                <div className="text-sm opacity-70">of {String(activeEvents.length).padStart(2, '0')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Touch handlers for the container
  const containerSwipeGestures = useSwipeGestures({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev
  });

  if (activeEvents.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500 text-lg">No suggestions available</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Card Container */}
      <div
        ref={containerRef}
        className="relative h-80 mx-8 mb-8"
        style={{ perspective: '1000px' }}
        {...containerSwipeGestures}
      >
        {activeEvents.map((suggestion, index) => (
          <SuggestionCardComponent key={suggestion.id} suggestion={suggestion} index={index} />
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-3 mb-6">
        {activeEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setCurrentIndex(index);
              }
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-blue-500 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Swipe Hint */}
      <div className="text-center text-gray-500 text-sm">
        Swipe left or right to explore • Tap to view • Swipe up to schedule • Swipe down for later
      </div>
    </div>
  );
};

export default MultidimensionalSuggestionCards;