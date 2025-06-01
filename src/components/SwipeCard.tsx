
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SwipeAction {
  label: string;
  action: () => void;
  color: string;
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
      if (deltaX > 50 && onSwipeRight) setShowAction('right');
      else if (deltaX < -50 && onSwipeLeft) setShowAction('left');
      else setShowAction(null);
    } else if (deltaY < -50 && onSwipeUp) {
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

  return (
    <div className="relative mb-4">
      {/* Action hint background */}
      <div 
        className={cn(
          "absolute inset-0 rounded-xl transition-all duration-200 flex items-center justify-center",
          showAction ? "opacity-100" : "opacity-0"
        )}
        style={{ backgroundColor: getActionColor() }}
      >
        <span className="text-white font-semibold text-lg">
          {showAction === 'right' && onSwipeRight?.label}
          {showAction === 'left' && onSwipeLeft?.label}
          {showAction === 'up' && onSwipeUp?.label}
        </span>
      </div>
      
      {/* Card */}
      <div
        ref={cardRef}
        className={cn(
          "bg-white rounded-xl shadow-lg border border-gray-100 transition-transform duration-200 cursor-pointer",
          isDragging ? "shadow-2xl scale-105" : "hover:shadow-xl",
          className
        )}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) ${isDragging ? 'rotate(' + (dragOffset.x * 0.1) + 'deg)' : ''}`
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
