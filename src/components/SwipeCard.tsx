
import React, { useState, useRef } from 'react';
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

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    hasMoved.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);
    
    // Require much more movement before showing action and reduce sensitivity
    if (horizontalDistance > 30 || verticalDistance > 30) {
      hasMoved.current = true;
      
      // Determine primary direction with stricter thresholds
      if (verticalDistance > horizontalDistance * 1.5) {
        // Vertical swipe - much more restrictive movement
        const dampedY = deltaY * 0.3; // Reduced from 0.6 to 0.3 for less jumpy feel
        setDragOffset({ x: 0, y: Math.max(-80, Math.min(20, dampedY)) }); // Clamp the movement
        if (deltaY < -100 && onSwipeUp) setShowAction('up'); // Increased threshold from -60 to -100
        else setShowAction(null);
      } else if (horizontalDistance > verticalDistance * 1.5) {
        // Horizontal swipe - much more restrictive movement
        const dampedX = deltaX * 0.3; // Reduced from 0.6 to 0.3 for less jumpy feel
        setDragOffset({ x: Math.max(-80, Math.min(80, dampedX)), y: 0 }); // Clamp the movement
        if (deltaX > 100 && onSwipeRight) setShowAction('right'); // Increased threshold from 60 to 100
        else if (deltaX < -100 && onSwipeLeft) setShowAction('left'); // Increased threshold from -60 to -100
        else setShowAction(null);
      } else {
        // Mixed movement - reset to prevent jumpy behavior
        setDragOffset({ x: 0, y: 0 });
        setShowAction(null);
      }
    }
  };

  const handleTouchEnd = () => {
    const threshold = 150; // Increased from 120 to 150 for more intentional swipes
    
    if (Math.abs(dragOffset.y) > threshold && dragOffset.y < -threshold && onSwipeUp) {
      onSwipeUp.action();
    } else if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > threshold && onSwipeRight) {
        onSwipeRight.action();
      } else if (dragOffset.x < -threshold && onSwipeLeft) {
        onSwipeLeft.action();
      }
    } else if (!hasMoved.current && onTap) {
      onTap();
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
    hasMoved.current = false;
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const distance = showAction === 'up' ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
    const progress = Math.min(distance / 150, 1); // Updated to match new threshold
    return Math.max(0.3, progress * 0.9); // Slightly higher base opacity
  };

  return (
    <div className="relative mb-4 overflow-hidden rounded-xl">
      {/* Left Action Background */}
      {onSwipeLeft && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-start pl-8 transition-all duration-200",
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
            "absolute inset-0 flex items-center justify-end pr-8 transition-all duration-200",
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
            "absolute inset-0 flex items-start justify-center pt-8 transition-all duration-200",
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
          "bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-200 cursor-pointer relative z-10",
          isDragging ? "shadow-2xl" : "hover:shadow-xl",
          className
        )}
        style={{
          transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) ${isDragging && (Math.abs(dragOffset.x) > 40 || Math.abs(dragOffset.y) > 40) ? 'rotate(' + ((dragOffset.x + dragOffset.y) * 0.005) + 'deg)' : ''}`, // Reduced rotation sensitivity
          transition: isDragging ? 'none' : 'transform 0.3s ease-out, box-shadow 0.2s ease-out'
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
