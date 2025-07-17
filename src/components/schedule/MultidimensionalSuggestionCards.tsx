import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import SwipeActionOverlays from './SwipeActionOverlays';
import { sharedEventService } from '@/services/sharedEventService';
import { UniversalEvent } from '@/types/eventTasks';
import { isSameDay, isPast, startOfDay } from 'date-fns';

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
  onCurrentIndexChange?: (index: number) => void;
  onEventClick?: (event: UniversalEvent) => void;
  className?: string;
}

const MultidimensionalSuggestionCards = ({ 
  suggestions, 
  onCardTap, 
  onCardSwipeUp, 
  onCardSwipeDown, 
  onCurrentIndexChange,
  onEventClick,
  className = '' 
}: MultidimensionalSuggestionCardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [incompleteEvents, setIncompleteEvents] = useState<UniversalEvent[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  // Get incomplete events from yesterday that need attention
  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const allEvents = sharedEventService.getEventsForRole('resident');
    const incompleteFromYesterday = allEvents.filter(event => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      const isFromYesterday = isSameDay(eventDate, yesterday);
      const hasIncompleteTasks = event.tasks.some(task => !task.isComplete);
      return isFromYesterday && hasIncompleteTasks;
    });
    
    setIncompleteEvents(incompleteFromYesterday);
  }, []);

  // Filter out completed events
  const activeEvents = suggestions.filter(s => s.title !== 'Complete work order');

  useEffect(() => {
    if (currentIndex >= activeEvents.length && activeEvents.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeEvents.length, currentIndex]);

  // Initialize infinite scroll position and handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container || activeEvents.length === 0) return;

    // Set initial scroll position to middle array for infinite scroll
    const cardWidth = 296; // 280px card + 16px gap = 296px total
    const initialScrollPosition = activeEvents.length * cardWidth;
    
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      container.scrollLeft = initialScrollPosition;
    }, 0);

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const totalArrayWidth = activeEvents.length * cardWidth;
      
      // Calculate which card is centered for navigation dots
      const cardIndex = Math.round(scrollLeft / cardWidth) % activeEvents.length;
      const normalizedIndex = ((cardIndex % activeEvents.length) + activeEvents.length) % activeEvents.length;
      
      setScrollIndex(normalizedIndex);
      setCurrentIndex(normalizedIndex);
      onCurrentIndexChange?.(normalizedIndex);

      // Infinite scroll logic - reset position when reaching boundaries
      if (scrollLeft <= cardWidth / 2) {
        // Scrolled too far left, jump to end of middle array
        container.scrollLeft = totalArrayWidth + scrollLeft;
      } else if (scrollLeft >= totalArrayWidth * 2 - cardWidth / 2) {
        // Scrolled too far right, jump to start of middle array
        container.scrollLeft = totalArrayWidth + (scrollLeft - totalArrayWidth * 2);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeEvents.length, onCurrentIndexChange]);

  const goToNext = () => {
    if (isTransitioning || activeEvents.length === 0) return;
    setIsTransitioning(true);
    const newIndex = (currentIndex + 1) % activeEvents.length;
    setCurrentIndex(newIndex);
    onCurrentIndexChange?.(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrev = () => {
    if (isTransitioning || activeEvents.length === 0) return;
    setIsTransitioning(true);
    const newIndex = (currentIndex - 1 + activeEvents.length) % activeEvents.length;
    setCurrentIndex(newIndex);
    onCurrentIndexChange?.(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
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
    const isHovered = hoveredCard === index;

    if (normalizedDiff === 0) {
      // Center card - completely flat when centered, locks into place  
      return {
        transform: `translateX(0%) scale(${isHovered ? 1.01 : 1}) rotateY(0deg) translateZ(${isHovered ? '15px' : '8px'})`,
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1)',
        animation: 'none'
      };
    } else if (normalizedDiff === 1 || normalizedDiff === -(activeEvents.length - 1)) {
      // Right card with reduced rotation for better snap behavior
      return {
        transform: `translateX(85%) scale(${isHovered ? 0.88 : 0.85}) rotateY(-8deg) translateZ(${isHovered ? '5px' : '0px'})`,
        zIndex: 20,
        opacity: isHovered ? 0.85 : 0.75,
        filter: 'brightness(0.85)',
        animation: 'floatRight 8s ease-in-out infinite'
      };
    } else if (normalizedDiff === -1 || normalizedDiff === (activeEvents.length - 1)) {
      // Left card with reduced rotation for better snap behavior
      return {
        transform: `translateX(-85%) scale(${isHovered ? 0.88 : 0.85}) rotateY(8deg) translateZ(${isHovered ? '5px' : '0px'})`,
        zIndex: 20,
        opacity: isHovered ? 0.85 : 0.75,
        filter: 'brightness(0.85)',
        animation: 'floatLeft 8s ease-in-out infinite'
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
        className={`w-full h-full transition-all duration-500 ease-out cursor-pointer ${
          isTransitioning ? 'pointer-events-none' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d'
        }}
        onClick={() => {
          if (isCenter) {
            // Find matching incomplete event and open its modal
            const matchingEvent = incompleteEvents.find(event => 
              event.title.toLowerCase().includes(suggestion.title.toLowerCase()) ||
              suggestion.title.toLowerCase().includes(event.title.toLowerCase())
            );
            
            if (matchingEvent && onEventClick) {
              onEventClick(matchingEvent);
            } else {
              onCardTap(suggestion);
            }
          }
        }}
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
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
          {/* Swipe Action Overlays */}
          {isCenter && (
            <SwipeActionOverlays
              showAction={swipeGestures.showAction}
              canSwipeUp={true}
              getActionOpacity={swipeGestures.getActionOpacity}
              cardColor={(() => {
                switch (suggestion.priority) {
                  case 'urgent': return '#EF4444';
                  case 'high': return '#F97316';
                  case 'medium': return '#EAB308';
                  case 'low': return '#22C55E';
                  default: return '#6B7280';
                }
              })()}
            />
          )}

          <div className="relative h-full p-6 flex flex-col justify-between text-white min-h-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white bg-opacity-20`}>
                {suggestion.priority}
              </div>
              {isCenter && (
                <div className="text-xs opacity-80 text-right leading-tight">
                  <div>Tap to view</div>
                  <div>Swipe to schedule</div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center py-2 min-h-0">
              <h2 className="text-2xl font-bold mb-3 leading-tight">{suggestion.title}</h2>
              <p className="text-base opacity-90 leading-relaxed mb-2">{suggestion.description}</p>
              <div className="text-sm opacity-75 capitalize font-medium">{suggestion.category}</div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end pt-2">
              <div className="text-xs opacity-70">
                Swipe to navigate
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{String(index + 1).padStart(2, '0')}</div>
                <div className="text-xs opacity-70">of {String(activeEvents.length).padStart(2, '0')}</div>
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
    <div className={`relative h-full ${className}`}>
      {/* Today's Suggestions Title */}
      <div className="px-6 mb-4 mt-6">
        <h2 className="text-xl font-semibold text-foreground">Today's Suggestions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Events from yesterday that still need your attention
        </p>
      </div>
      
      {/* Floating CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateX(0%) scale(1) rotateY(0deg) translateY(0px); }
          50% { transform: translateX(0%) scale(1) rotateY(0deg) translateY(-8px); }
        }
        @keyframes floatLeft {
          0%, 100% { transform: translateX(-85%) scale(0.8) rotateY(15deg) translateY(0px); }
          50% { transform: translateX(-85%) scale(0.8) rotateY(15deg) translateY(-4px); }
        }
        @keyframes floatRight {
          0%, 100% { transform: translateX(85%) scale(0.8) rotateY(-15deg) translateY(0px); }
          50% { transform: translateX(85%) scale(0.8) rotateY(-15deg) translateY(-4px); }
        }
      `}</style>

      {/* Main Card Container - Infinite scroll with consistent card sizing */}
      <div
        ref={containerRef}
        className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide h-[360px] mx-6 mb-8"
        style={{ 
          touchAction: 'pan-x pinch-zoom',
          scrollSnapType: 'x mandatory'
        }}
      >
        <div className="flex px-[50vw] py-8" style={{ width: 'max-content', gap: '16px' }}>
          {/* Create infinite scroll by tripling cards */}
          {[...activeEvents, ...activeEvents, ...activeEvents].map((suggestion, index) => (
            <div
              key={`${suggestion.id}-${Math.floor(index / activeEvents.length)}`}
              className="flex-shrink-0 w-[280px] h-[300px] snap-center"
            >
              <SuggestionCardComponent 
                suggestion={suggestion} 
                index={index % activeEvents.length} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots - Synced with infinite scroll */}
      <div className="flex justify-center space-x-3 mb-8">
        {activeEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (containerRef.current) {
                const cardWidth = 296; // 280px + 16px gap = 296px
                const targetScroll = (activeEvents.length * cardWidth) + (index * cardWidth);
                containerRef.current.scrollTo({
                  left: targetScroll,
                  behavior: 'smooth'
                });
              }
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === scrollIndex
                ? 'bg-blue-500 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MultidimensionalSuggestionCards;