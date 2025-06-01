
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SwipeAction {
  label: string;
  action: () => void;
  color: string;
  icon?: string;
}

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeRight?: SwipeAction;
  onSwipeLeft?: SwipeAction;
  onSwipeUp?: SwipeAction;
  onTap?: () => void;
  className?: string;
}

const SwipeCard = ({ 
  children, 
  onSwipeRight, 
  onSwipeLeft, 
  onSwipeUp,
  onTap,
  className 
}: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAction, setShowAction] = useState<'left' | 'right' | 'up' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const lastTouchTime = useRef(0);

  // Prevent scrolling on the document when interacting with the card
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isDragging]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    hasMoved.current = false;
    lastTouchTime.current = Date.now();
    setIsDragging(true);
    
    // Prevent any default touch behavior
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);
    
    // More sensitive threshold - like Tinder
    if (horizontalDistance > 5 || verticalDistance > 5) {
      hasMoved.current = true;
      
      // Determine primary direction with higher sensitivity
      if (verticalDistance > horizontalDistance * 0.8) {
        // Vertical swipe - more sensitive
        setDragOffset({ x: 0, y: deltaY * 0.8 });
        if (deltaY < -30 && onSwipeUp) setShowAction('up');
        else setShowAction(null);
      } else {
        // Horizontal swipe
        setDragOffset({ x: deltaX * 0.8, y: 0 });
        if (deltaX > 40 && onSwipeRight) setShowAction('right');
        else if (deltaX < -40 && onSwipeLeft) setShowAction('left');
        else setShowAction(null);
      }
    }
    
    // Prevent scrolling
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const threshold = 80; // Lower threshold for more sensitivity
    const touchDuration = Date.now() - lastTouchTime.current;
    
    if (Math.abs(dragOffset.y) > threshold && dragOffset.y < -threshold && onSwipeUp) {
      onSwipeUp.action();
    } else if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > threshold && onSwipeRight) {
        onSwipeRight.action();
      } else if (dragOffset.x < -threshold && onSwipeLeft) {
        onSwipeLeft.action();
      }
    } else if (!hasMoved.current && touchDuration < 200 && onTap) {
      // Quick tap
      onTap();
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
    hasMoved.current = false;
    
    e.preventDefault();
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const distance = showAction === 'up' ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
    const progress = Math.min(distance / 80, 1); // More responsive
    return Math.max(0.3, progress * 0.9);
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      {/* Left Action Background */}
      {onSwipeLeft && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-start pl-8 transition-all duration-100",
            showAction === 'left' ? "opacity-100" : "opacity-0"
          )}
          style={{ 
            backgroundColor: onSwipeLeft.color,
            opacity: showAction === 'left' ? getActionOpacity() : 0
          }}
        >
          <div className="text-white font-bold text-xl flex items-center gap-3">
            {onSwipeLeft.icon && <span className="text-2xl">{onSwipeLeft.icon}</span>}
            <span>{onSwipeLeft.label}</span>
          </div>
        </div>
      )}

      {/* Right Action Background */}
      {onSwipeRight && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-end pr-8 transition-all duration-100",
            showAction === 'right' ? "opacity-100" : "opacity-0"
          )}
          style={{ 
            backgroundColor: onSwipeRight.color,
            opacity: showAction === 'right' ? getActionOpacity() : 0
          }}
        >
          <div className="text-white font-bold text-xl flex items-center gap-3">
            <span>{onSwipeRight.label}</span>
            {onSwipeRight.icon && <span className="text-2xl">{onSwipeRight.icon}</span>}
          </div>
        </div>
      )}

      {/* Up Action Background */}
      {onSwipeUp && (
        <div 
          className={cn(
            "absolute inset-0 flex items-start justify-center pt-8 transition-all duration-100",
            showAction === 'up' ? "opacity-100" : "opacity-0"
          )}
          style={{ 
            backgroundColor: onSwipeUp.color,
            opacity: showAction === 'up' ? getActionOpacity() : 0
          }}
        >
          <div className="text-white font-bold text-xl flex flex-col items-center gap-2">
            {onSwipeUp.icon && <span className="text-2xl">{onSwipeUp.icon}</span>}
            <span>{onSwipeUp.label}</span>
          </div>
        </div>
      )}
      
      {/* Card */}
      <div
        ref={cardRef}
        className={cn(
          "bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-100 cursor-pointer relative z-10 touch-none",
          isDragging ? "shadow-2xl" : "hover:shadow-xl"
        )}
        style={{
          transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) ${isDragging && (Math.abs(dragOffset.x) > 20 || Math.abs(dragOffset.y) > 20) ? 'rotate(' + ((dragOffset.x + dragOffset.y) * 0.005) + 'deg)' : ''}`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out, box-shadow 0.2s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={!hasMoved.current ? onTap : undefined}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeCard;
