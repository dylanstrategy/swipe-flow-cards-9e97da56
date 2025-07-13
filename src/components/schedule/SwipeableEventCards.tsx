import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Wrench, MessageCircle, Clock, FileText, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';

interface EventCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  type: string;
}

interface SwipeableEventCardsProps {
  onCardTap: (cardType: string) => void;
  onCardSwipeUp: (cardType: string) => void;
  className?: string;
}

const SwipeableEventCards = ({ onCardTap, onCardSwipeUp, className = '' }: SwipeableEventCardsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(280);

  const eventCards: EventCard[] = [
    {
      id: 'Message',
      title: 'Send Message',
      description: 'Contact management, leasing, or maintenance',
      icon: MessageCircle,
      color: 'bg-blue-500',
      type: 'Message'
    },
    {
      id: 'Work Order',
      title: 'Work Order',
      description: 'Report maintenance issues',
      icon: Wrench,
      color: 'bg-orange-500',
      type: 'Work Order'
    },
    {
      id: 'Appointment',
      title: 'Schedule Appointment',
      description: 'Book a meeting or consultation',
      icon: Calendar,
      color: 'bg-green-500',
      type: 'Appointment'
    },
    {
      id: 'Service',
      title: 'Request Service',
      description: 'Schedule cleaning or other services',
      icon: Clock,
      color: 'bg-purple-500',
      type: 'Service Request'
    },
    {
      id: 'Document',
      title: 'Document Request',
      description: 'Request lease documents or forms',
      icon: FileText,
      color: 'bg-indigo-500',
      type: 'Document'
    },
    {
      id: 'Event',
      title: 'Community Event',
      description: 'RSVP for building events',
      icon: Users,
      color: 'bg-pink-500',
      type: 'Event'
    }
  ];

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
    const newIndex = Math.min(eventCards.length - 1, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  const EventCardComponent = ({ card, index }: { card: EventCard; index: number }) => {
    const swipeGestures = useSwipeGestures({
      onSwipeUp: () => onCardSwipeUp(card.type),
      canSwipeUp: true
    });

    const IconComponent = card.icon;

    return (
      <div
        className="relative flex-shrink-0 cursor-pointer"
        style={{ width: cardWidth }}
        onClick={() => onCardTap(card.type)}
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
          {/* Swipe Up Indicator */}
          {swipeGestures.showAction && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center rounded-xl">
              <div className="text-white text-center">
                <div className="text-2xl mb-1">⬆️</div>
                <div className="text-sm font-medium">Auto Schedule</div>
              </div>
            </div>
          )}

          <div className="flex items-start">
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
              <IconComponent className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-tight">{card.title}</h3>
              <p className="text-gray-600 text-xs leading-tight">{card.description}</p>
            </div>
          </div>

          <div className="text-xs text-gray-400 mt-2">
            Tap to create • Swipe up to auto-schedule
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Create Event</h3>
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
            disabled={currentIndex >= eventCards.length - 1}
            className={`p-2 rounded-full transition-all ${
              currentIndex >= eventCards.length - 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {eventCards.map((card, index) => (
          <EventCardComponent key={card.id} card={card} index={index} />
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {eventCards.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipeableEventCards;