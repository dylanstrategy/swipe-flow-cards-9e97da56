
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
    
    console.log('SWIPE GESTURE START - preventing default');
    e.preventDefault();
    e.stopPropagation();
    
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
    
    console.log('SWIPE GESTURE MOVE - preventing default');
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX * 0.3, y: deltaY * 0.3 });
    
    // Show action indicators with lower thresholds
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -15 && canSwipeUp && onSwipeUp) {
      setShowAction('up');
      console.log('SHOWING UP ACTION:', { deltaY, canSwipeUp });
    } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -15 && onSwipeLeft) {
      setShowAction('left');
    } else {
      setShowAction(null);
    }
  }, [isDragging, canSwipeUp, onSwipeUp, onSwipeLeft]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging || isProcessing.current) return;
    
    console.log('SWIPE GESTURE END - preventing default');
    e.preventDefault();
    e.stopPropagation();
    
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
      threshold: 'deltaY < -25'
    });
    
    // Even more lenient thresholds for swipe detection
    const shouldSwipeUp = deltaY < -25 && Math.abs(deltaY) > Math.abs(deltaX) * 0.3 && canSwipeUp && onSwipeUp;
    const shouldSwipeLeft = deltaX < -25 && Math.abs(deltaX) > Math.abs(deltaY) * 0.3 && onSwipeLeft;
    
    if (shouldSwipeUp) {
      console.log('EXECUTING SWIPE UP!', { deltaY, condition: 'deltaY < -25 && vertical dominance' });
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
        upCondition: `${deltaY} < -25 = ${deltaY < -25}`,
        verticalDominance: `${Math.abs(deltaY)} > ${Math.abs(deltaX) * 0.3} = ${Math.abs(deltaY) > Math.abs(deltaX) * 0.3}`,
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
    return Math.min(0.8, Math.max(0.3, distance / 30));
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
