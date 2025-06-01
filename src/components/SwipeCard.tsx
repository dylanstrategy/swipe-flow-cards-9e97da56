
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

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    
    // Show action hints based on drag direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 30 && onSwipeRight) setShowAction('right');
      else if (deltaX < -30 && onSwipeLeft) setShowAction('left');
      else setShowAction(null);
    } else if (deltaY < -30 && onSwipeUp) {
      setShowAction('up');
    } else {
      setShowAction(null);
    }
  };

  const handleTouchEnd = () => {
    const threshold = 80;
    
    if (Math.abs(dragOffset.x) > threshold || Math.abs(dragOffset.y) > threshold) {
      if (Math.abs(dragOffset.x) > Math.abs(dragOffset.y)) {
        if (dragOffset.x > threshold && onSwipeRight) {
          onSwipeRight.action();
        } else if (dragOffset.x < -threshold && onSwipeLeft) {
          onSwipeLeft.action();
        }
      } else if (dragOffset.y < -threshold && onSwipeUp) {
        onSwipeUp.action();
      }
    } else if (Math.abs(dragOffset.x) < 10 && Math.abs(dragOffset.y) < 10 && onTap) {
      onTap();
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  };

  const getActionColor = () => {
    if (showAction === 'right' && onSwipeRight) return onSwipeRight.color;
    if (showAction === 'left' && onSwipeLeft) return onSwipeLeft.color;
    if (showAction === 'up' && onSwipeUp) return onSwipeUp.color;
    return 'transparent';
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const progress = Math.min(Math.abs(dragOffset.x) / 100, Math.abs(dragOffset.y) / 100, 1);
    return Math.max(0.3, progress * 0.9);
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
            "absolute inset-0 flex items-center justify-center transition-all duration-200",
            showAction === 'up' ? "opacity-100" : "opacity-0"
          )}
          style={{ 
            backgroundColor: onSwipeUp.color,
            opacity: showAction === 'up' ? getActionOpacity() : 0
          }}
        >
          <div className="text-white font-bold text-xl flex items-center gap-3">
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
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) ${isDragging ? 'rotate(' + (dragOffset.x * 0.05) + 'deg)' : ''}`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out, box-shadow 0.2s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onTap}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeCard;
