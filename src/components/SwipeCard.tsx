
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
  onTap?: () => void;
  className?: string;
}

const SwipeCard = ({ 
  children, 
  onSwipeRight, 
  onSwipeLeft, 
  onTap,
  className 
}: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAction, setShowAction] = useState<'left' | 'right' | null>(null);
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
    
    // Only track horizontal movement, ignore vertical
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);
    
    // If moving more vertically than horizontally, don't treat as swipe
    if (verticalDistance > horizontalDistance * 1.5) {
      return;
    }
    
    // Require more movement before showing action (increased threshold)
    if (horizontalDistance > 15) {
      hasMoved.current = true;
      setDragOffset({ x: deltaX * 0.6, y: 0 }); // Reduced sensitivity
      
      // Show action hints only for significant horizontal movement
      if (deltaX > 60 && onSwipeRight) setShowAction('right');
      else if (deltaX < -60 && onSwipeLeft) setShowAction('left');
      else setShowAction(null);
    }
  };

  const handleTouchEnd = () => {
    const threshold = 120; // Increased threshold for more deliberate swipes
    
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > threshold && onSwipeRight) {
        onSwipeRight.action();
      } else if (dragOffset.x < -threshold && onSwipeLeft) {
        onSwipeLeft.action();
      }
    } else if (!hasMoved.current && onTap) {
      // Only trigger tap if there was minimal movement
      onTap();
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
    hasMoved.current = false;
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const progress = Math.min(Math.abs(dragOffset.x) / 120, 1);
    return Math.max(0.2, progress * 0.8);
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
      
      {/* Card */}
      <div
        ref={cardRef}
        className={cn(
          "bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-200 cursor-pointer relative z-10",
          isDragging ? "shadow-2xl" : "hover:shadow-xl",
          className
        )}
        style={{
          transform: `translateX(${dragOffset.x}px) ${isDragging && Math.abs(dragOffset.x) > 30 ? 'rotate(' + (dragOffset.x * 0.02) + 'deg)' : ''}`,
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
