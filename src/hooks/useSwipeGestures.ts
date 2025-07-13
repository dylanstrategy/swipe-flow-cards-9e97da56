import { useState, useRef } from 'react';

interface SwipeGesturesConfig {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  canSwipeUp?: boolean;
}

export const useSwipeGestures = ({ onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, canSwipeUp = false }: SwipeGesturesConfig) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAction, setShowAction] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startTime = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX * 0.8, y: deltaY * 0.8 });
    
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < -30 && canSwipeUp) {
        setShowAction('up');
      } else if (deltaY > 30) {
        setShowAction('down');
      } else {
        setShowAction(null);
      }
    } else {
      if (deltaX < -30) {
        setShowAction('left');
      } else if (deltaX > 30) {
        setShowAction('right');
      } else {
        setShowAction(null);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const deltaX = dragOffset.x;
    const deltaY = dragOffset.y;
    const deltaTime = Date.now() - startTime.current;
    
    const velocityX = Math.abs(deltaX) / deltaTime;
    const velocityY = Math.abs(deltaY) / deltaTime;
    
    const distanceThreshold = 50;
    const velocityThreshold = 0.3;
    
    const shouldCompleteUp = (Math.abs(deltaY) > distanceThreshold || velocityY > velocityThreshold) && 
                            deltaY < -distanceThreshold && canSwipeUp;
    const shouldCompleteDown = (Math.abs(deltaY) > distanceThreshold || velocityY > velocityThreshold) && 
                             deltaY > distanceThreshold;
    const shouldCompleteLeft = (Math.abs(deltaX) > distanceThreshold || velocityX > velocityThreshold) && 
                              deltaX < -distanceThreshold;
    const shouldCompleteRight = (Math.abs(deltaX) > distanceThreshold || velocityX > velocityThreshold) && 
                               deltaX > distanceThreshold;
    
    // Add playful delay before executing swipe actions
    const executeAction = () => {
      if (shouldCompleteUp && onSwipeUp) {
        onSwipeUp();
      } else if (shouldCompleteDown && onSwipeDown) {
        onSwipeDown();
      } else if (shouldCompleteLeft && onSwipeLeft) {
        onSwipeLeft();
      } else if (shouldCompleteRight && onSwipeRight) {
        onSwipeRight();
      }
    };
    
    // Reset UI state immediately for responsive feel
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
    
    // Execute action with a playful delay
    if (shouldCompleteUp || shouldCompleteDown || shouldCompleteLeft || shouldCompleteRight) {
      setTimeout(executeAction, 150);
    }
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const distance = (showAction === 'up' || showAction === 'down') ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
    const progress = Math.min(distance / 80, 1);
    return Math.max(0.2, progress * 0.8);
  };

  const getRotation = () => {
    if (!isDragging) return 0;
    return (dragOffset.x * 0.02);
  };

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