import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Wrench, MessageCircle, Clock, FileText, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import SwipeActionOverlays from './SwipeActionOverlays';

interface EventCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  type: string;
}

interface MultidimensionalEventCardsProps {
  onCardTap: (cardType: string) => void;
  onCardSwipeUp: (cardType: string) => void;
  className?: string;
}

const MultidimensionalEventCards = ({ onCardTap, onCardSwipeUp, className = '' }: MultidimensionalEventCardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const eventCards: EventCard[] = [
    {
      id: 'Message',
      title: 'Send Message',
      description: 'Contact management, leasing, or maintenance team for any questions or requests',
      icon: MessageCircle,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      type: 'Message'
    },
    {
      id: 'Work Order',
      title: 'Work Order',
      description: 'Report maintenance issues and schedule repairs for your unit',
      icon: Wrench,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      type: 'Work Order'
    },
    {
      id: 'Appointment',
      title: 'Schedule Appointment',
      description: 'Book meetings, consultations, or viewings with the leasing team',
      icon: Calendar,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      type: 'Appointment'
    },
    {
      id: 'Service',
      title: 'Request Service',
      description: 'Schedule cleaning, package delivery, or other building services',
      icon: Clock,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      type: 'Service Request'
    },
    {
      id: 'Document',
      title: 'Document Request',
      description: 'Request lease documents, forms, or building information',
      icon: FileText,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      type: 'Document'
    },
    {
      id: 'Event',
      title: 'Community Event',
      description: 'RSVP for building events, parties, and community activities',
      icon: Users,
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
      type: 'Event'
    }
  ];

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % eventCards.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + eventCards.length) % eventCards.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const getCardStyle = (index: number) => {
    const diff = (index - currentIndex + eventCards.length) % eventCards.length;
    const normalizedDiff = diff > eventCards.length / 2 ? diff - eventCards.length : diff;
    const isHovered = hoveredCard === index;

    if (normalizedDiff === 0) {
      // Center card with floating animation
      return {
        transform: `translateX(0%) scale(${isHovered ? 1.02 : 1}) rotateY(0deg) translateZ(${isHovered ? '20px' : '0px'})`,
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1)',
        animation: 'float 6s ease-in-out infinite'
      };
    } else if (normalizedDiff === 1 || normalizedDiff === -(eventCards.length - 1)) {
      // Right card with subtle movement
      return {
        transform: `translateX(85%) scale(${isHovered ? 0.85 : 0.8}) rotateY(-15deg) translateZ(${isHovered ? '10px' : '0px'})`,
        zIndex: 20,
        opacity: isHovered ? 0.8 : 0.7,
        filter: 'brightness(0.8)',
        animation: 'floatRight 8s ease-in-out infinite'
      };
    } else if (normalizedDiff === -1 || normalizedDiff === (eventCards.length - 1)) {
      // Left card with subtle movement
      return {
        transform: `translateX(-85%) scale(${isHovered ? 0.85 : 0.8}) rotateY(15deg) translateZ(${isHovered ? '10px' : '0px'})`,
        zIndex: 20,
        opacity: isHovered ? 0.8 : 0.7,
        filter: 'brightness(0.8)',
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

  // Get colors for gradient background
  const getBackgroundGradient = () => {
    const centerCard = eventCards[currentIndex];
    const nextCard = eventCards[(currentIndex + 1) % eventCards.length];
    const prevCard = eventCards[(currentIndex - 1 + eventCards.length) % eventCards.length];
    
    // Convert card color classes to hex colors
    const getHexFromClass = (colorClass: string) => {
      const colorMap: { [key: string]: string } = {
        'bg-blue-500': '#3B82F6',
        'bg-green-500': '#22C55E',
        'bg-purple-500': '#A855F7',
        'bg-orange-500': '#F97316',
        'bg-red-500': '#EF4444',
        'bg-indigo-500': '#6366F1',
        'bg-teal-500': '#14B8A6',
        'bg-pink-500': '#EC4899'
      };
      return colorMap[colorClass] || '#6B7280';
    };

    const centerColor = getHexFromClass(centerCard.color);
    const topColor = getHexFromClass(prevCard.color);
    const bottomColor = getHexFromClass(nextCard.color);
    
    return `linear-gradient(180deg, ${topColor}20, ${centerColor}10, ${bottomColor}20)`;
  };

  const EventCardComponent = ({ card, index }: { card: EventCard; index: number }) => {
    const swipeGestures = useSwipeGestures({
      onSwipeUp: () => onCardSwipeUp(card.type),
      onSwipeLeft: goToNext,
      onSwipeRight: goToPrev,
      canSwipeUp: true
    });

    const IconComponent = card.icon;
    const style = getCardStyle(index);
    const isCenter = (index - currentIndex + eventCards.length) % eventCards.length === 0;

    return (
      <div
        className={`absolute inset-0 transition-all duration-500 ease-out cursor-pointer ${
          isTransitioning ? 'pointer-events-none' : ''
        }`}
        style={{
          transform: style.transform,
          zIndex: style.zIndex,
          opacity: style.opacity,
          filter: style.filter,
          transformStyle: 'preserve-3d',
          animation: style.animation
        }}
        onClick={() => isCenter && onCardTap(card.type)}
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
        {...(isCenter ? swipeGestures : {})}
      >
        <div
          className={`w-full h-full rounded-2xl shadow-2xl overflow-hidden ${card.color} ${
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
              cardColor={card.color.includes('bg-') ? '#22C55E' : card.color}
            />
          )}

          <div className="relative h-full p-8 flex flex-col justify-between text-white">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="bg-white bg-opacity-20 rounded-2xl p-4">
                <IconComponent size={32} className="text-white" />
              </div>
              {isCenter && (
                <div className="text-sm opacity-80 text-right">
                  <div>Tap to create</div>
                  <div>Swipe up to schedule</div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4 leading-tight">{card.title}</h2>
              <p className="text-lg opacity-90 leading-relaxed">{card.description}</p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end">
              <div className="text-sm opacity-70">
                Swipe to navigate
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{String(index + 1).padStart(2, '0')}</div>
                <div className="text-sm opacity-70">of {String(eventCards.length).padStart(2, '0')}</div>
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

  return (
    <div 
      className={`relative h-screen ${className}`}
      style={{ background: getBackgroundGradient() }}
    >
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

      {/* Desktop Navigation Arrows */}
      <div className="hidden md:block">
        <button
          onClick={goToPrev}
          disabled={isTransitioning}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 hover:text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          disabled={isTransitioning}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 hover:text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Main Card Container */}
      <div
        ref={containerRef}
        className="relative h-96 mx-8 mb-8"
        style={{ perspective: '1500px' }}
        {...containerSwipeGestures}
      >
        {eventCards.map((card, index) => (
          <EventCardComponent key={card.id} card={card} index={index} />
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-3 mb-6">
        {eventCards.map((_, index) => (
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
        Swipe left or right to explore • Tap center card to create • Swipe up to auto-schedule
      </div>
    </div>
  );
};

export default MultidimensionalEventCards;