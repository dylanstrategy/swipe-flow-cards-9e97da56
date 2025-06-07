
import { useState, useRef, useCallback } from 'react';

interface SwipeGesturesConfig {
  onSwipeUp?: () => void;
  onSwipeLeft?: () => void;
  canSwipeUp?: boolean;
}

export const useSwipeGestures = ({ onSwipeUp, onSwipeLeft, canSwipeUp = false }: SwipeGesturesConfig) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAction, setShowAction] = useState<'up' | 'left' | null>(null);
  
  const startPos = useRef({ x: 0, y: 0 });
  const startTime = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    console.log('TOUCH START - SWIPE GESTURE');
    
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    console.log('TOUCH MOVE - SWIPE GESTURE');
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX * 0.3, y: deltaY * 0.3 });
    
    // Show action indicators
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -20 && canSwipeUp && onSwipeUp) {
      setShowAction('up');
    } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -20 && onSwipeLeft) {
      setShowAction('left');
    } else {
      setShowAction(null);
    }
  }, [isDragging, canSwipeUp, onSwipeUp, onSwipeLeft]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    console.log('TOUCH END - SWIPE GESTURE');
    
    const deltaX = dragOffset.x / 0.3;
    const deltaY = dragOffset.y / 0.3;
    
    console.log('SWIPE END ANALYSIS:', { 
      deltaX, 
      deltaY, 
      canSwipeUp, 
      hasUpHandler: !!onSwipeUp,
      swipeUpCondition: deltaY < -30 && Math.abs(deltaY) > Math.abs(deltaX)
    });
    
    // Check for swipe up
    if (deltaY < -30 && Math.abs(deltaY) > Math.abs(deltaX) && canSwipeUp && onSwipeUp) {
      console.log('EXECUTING SWIPE UP!');
      setTimeout(() => onSwipeUp(), 50);
    } 
    // Check for swipe left
    else if (deltaX < -30 && Math.abs(deltaX) > Math.abs(deltaY) && onSwipeLeft) {
      console.log('EXECUTING SWIPE LEFT!');
      setTimeout(() => onSwipeLeft(), 50);
    }
    
    // Reset state
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  }, [isDragging, dragOffset, canSwipeUp, onSwipeUp, onSwipeLeft]);

  const getActionOpacity = useCallback(() => {
    if (!showAction) return 0;
    const distance = showAction === 'up' ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
    return Math.min(0.8, Math.max(0.3, distance / 40));
  }, [showAction, dragOffset]);

  const getRotation = useCallback(() => {
    return isDragging ? dragOffset.x * 0.015 : 0;
  }, [isDragging, dragOffset.x]);

  return {
    isDragging,
    dragOffset,
    showAction,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getActionOpacity,
    getRotation
  };
};
