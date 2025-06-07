
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
  const isProcessing = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isProcessing.current) return;
    
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
    
    console.log('SWIPE START:', { canSwipeUp, hasUpHandler: !!onSwipeUp });
  }, [canSwipeUp, onSwipeUp]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || isProcessing.current) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    // Only prevent default if we're actually swiping
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      e.preventDefault();
    }
    
    setDragOffset({ x: deltaX * 0.5, y: deltaY * 0.5 });
    
    // Show action indicators
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -30 && canSwipeUp && onSwipeUp) {
      setShowAction('up');
    } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -30 && onSwipeLeft) {
      setShowAction('left');
    } else {
      setShowAction(null);
    }
    
    console.log('SWIPE MOVE:', { deltaX, deltaY, showAction, canSwipeUp });
  }, [isDragging, canSwipeUp, onSwipeUp, onSwipeLeft]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || isProcessing.current) return;
    
    const deltaX = dragOffset.x / 0.5;
    const deltaY = dragOffset.y / 0.5;
    const timeDelta = Date.now() - startTime.current;
    
    console.log('SWIPE END:', { 
      deltaX, 
      deltaY, 
      timeDelta, 
      canSwipeUp, 
      hasUpHandler: !!onSwipeUp,
      hasLeftHandler: !!onSwipeLeft 
    });
    
    // More lenient thresholds
    const shouldSwipeUp = deltaY < -50 && Math.abs(deltaY) > Math.abs(deltaX) && canSwipeUp && onSwipeUp;
    const shouldSwipeLeft = deltaX < -50 && Math.abs(deltaX) > Math.abs(deltaY) && onSwipeLeft;
    
    if (shouldSwipeUp) {
      console.log('EXECUTING SWIPE UP!');
      isProcessing.current = true;
      setTimeout(() => {
        onSwipeUp();
        isProcessing.current = false;
      }, 100);
    } else if (shouldSwipeLeft) {
      console.log('EXECUTING SWIPE LEFT!');
      isProcessing.current = true;
      setTimeout(() => {
        onSwipeLeft();
        isProcessing.current = false;
      }, 100);
    }
    
    // Reset state
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  }, [isDragging, dragOffset, canSwipeUp, onSwipeUp, onSwipeLeft]);

  const getActionOpacity = useCallback(() => {
    if (!showAction) return 0;
    const distance = showAction === 'up' ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
    return Math.min(0.8, Math.max(0.3, distance / 60));
  }, [showAction, dragOffset]);

  const getRotation = useCallback(() => {
    return isDragging ? dragOffset.x * 0.02 : 0;
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
