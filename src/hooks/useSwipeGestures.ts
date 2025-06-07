
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
    
    console.log('SWIPE START:', { canSwipeUp, hasUpHandler: !!onSwipeUp, startPos: startPos.current });
  }, [canSwipeUp, onSwipeUp]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || isProcessing.current) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    // Prevent default scrolling for significant movements
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      e.preventDefault();
    }
    
    setDragOffset({ x: deltaX * 0.3, y: deltaY * 0.3 });
    
    // Show action indicators with lower thresholds
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -20 && canSwipeUp && onSwipeUp) {
      setShowAction('up');
      console.log('SHOWING UP ACTION:', { deltaY, canSwipeUp });
    } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -20 && onSwipeLeft) {
      setShowAction('left');
    } else {
      setShowAction(null);
    }
  }, [isDragging, canSwipeUp, onSwipeUp, onSwipeLeft]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || isProcessing.current) return;
    
    const deltaX = dragOffset.x / 0.3;
    const deltaY = dragOffset.y / 0.3;
    const timeDelta = Date.now() - startTime.current;
    
    console.log('SWIPE END:', { 
      deltaX, 
      deltaY, 
      timeDelta, 
      canSwipeUp, 
      hasUpHandler: !!onSwipeUp,
      hasLeftHandler: !!onSwipeLeft,
      threshold: 'deltaY < -30'
    });
    
    // Much more lenient thresholds for swipe detection
    const shouldSwipeUp = deltaY < -30 && Math.abs(deltaY) > Math.abs(deltaX) * 0.5 && canSwipeUp && onSwipeUp;
    const shouldSwipeLeft = deltaX < -30 && Math.abs(deltaX) > Math.abs(deltaY) * 0.5 && onSwipeLeft;
    
    if (shouldSwipeUp) {
      console.log('EXECUTING SWIPE UP!', { deltaY, condition: 'deltaY < -30 && vertical dominance' });
      isProcessing.current = true;
      setTimeout(() => {
        onSwipeUp();
        isProcessing.current = false;
      }, 50);
    } else if (shouldSwipeLeft) {
      console.log('EXECUTING SWIPE LEFT!', { deltaX });
      isProcessing.current = true;
      setTimeout(() => {
        onSwipeLeft();
        isProcessing.current = false;
      }, 50);
    } else {
      console.log('NO SWIPE DETECTED:', { 
        deltaY, 
        deltaX, 
        upCondition: `${deltaY} < -30 = ${deltaY < -30}`,
        verticalDominance: `${Math.abs(deltaY)} > ${Math.abs(deltaX) * 0.5} = ${Math.abs(deltaY) > Math.abs(deltaX) * 0.5}`,
        canSwipeUp,
        hasHandler: !!onSwipeUp
      });
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
