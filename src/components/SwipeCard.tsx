
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
  enableSwipeUp?: boolean;
}

const SwipeCard = ({ 
  children, 
  onSwipeRight, 
  onSwipeLeft, 
  onSwipeUp,
  onTap,
  className,
  enableSwipeUp = false
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
    console.log('Touch start', { x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);
    
    if (horizontalDistance > 10 || (enableSwipeUp && verticalDistance > 10)) {
      hasMoved.current = true;
      
      if (enableSwipeUp && verticalDistance > horizontalDistance * 1.5) {
        const dampedY = deltaY * 0.3;
        setDragOffset({ x: 0, y: Math.max(-80, Math.min(20, dampedY)) });
        if (deltaY < -50 && onSwipeUp) setShowAction('up');
        else setShowAction(null);
      } else if (horizontalDistance > (enableSwipeUp ? verticalDistance * 1.5 : 5)) {
        const dampedX = deltaX * 0.3;
        setDragOffset({ x: Math.max(-80, Math.min(80, dampedX)), y: 0 });
        if (deltaX > 50 && onSwipeRight) {
          setShowAction('right');
          console.log('Showing right action');
        } else if (deltaX < -50 && onSwipeLeft) {
          setShowAction('left');
          console.log('Showing left action', onSwipeLeft);
        } else {
          setShowAction(null);
        }
      } else {
        setDragOffset({ x: 0, y: 0 });
        setShowAction(null);
      }
    }
  };

  const handleTouchEnd = () => {
    const threshold = 80; // Reduced threshold for easier swiping
    
    console.log('Touch end', { dragOffset, threshold, onSwipeLeft, onSwipeRight });
    
    if (enableSwipeUp && Math.abs(dragOffset.y) > threshold && dragOffset.y < -threshold && onSwipeUp) {
      console.log('Executing swipe up');
      onSwipeUp.action();
    } else if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > threshold && onSwipeRight) {
        console.log('Executing swipe right');
        onSwipeRight.action();
      } else if (dragOffset.x < -threshold && onSwipeLeft) {
        console.log('Executing swipe left', onSwipeLeft.label);
        onSwipeLeft.action();
      }
    } else if (!hasMoved.current && onTap) {
      console.log('Executing tap');
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
    const progress = Math.min(distance / 80, 1);
    return Math.max(0.3, progress * 0.9);
  };

  const getCurrentAction = () => {
    if (showAction === 'left') return onSwipeLeft;
    if (showAction === 'right') return onSwipeRight;
    if (showAction === 'up') return onSwipeUp;
    return null;
  };

  const currentAction = getCurrentAction();
  const shouldShowActionState = showAction && currentAction;

  return (
    <div className="relative mb-4 overflow-hidden rounded-xl">
      {/* Card */}
      <div
        ref={cardRef}
        className={cn(
          "rounded-xl shadow-lg border border-gray-100 transition-all duration-200 cursor-pointer relative z-10",
          isDragging ? "shadow-2xl" : "hover:shadow-xl",
          className
        )}
        style={{
          transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) ${isDragging && (Math.abs(dragOffset.x) > 40 || Math.abs(dragOffset.y) > 40) ? 'rotate(' + ((dragOffset.x + dragOffset.y) * 0.005) + 'deg)' : ''}`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out, box-shadow 0.2s ease-out',
          backgroundColor: shouldShowActionState ? currentAction.color : 'white',
          opacity: shouldShowActionState ? getActionOpacity() : 1
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={!hasMoved.current ? onTap : undefined}
      >
        {shouldShowActionState ? (
          <div className="p-4 flex items-center justify-center min-h-[80px]">
            <div className="text-white font-bold text-xl flex items-center gap-3">
              {currentAction.icon && <span className="text-2xl">{currentAction.icon}</span>}
              <span>{currentAction.label}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeCard;
