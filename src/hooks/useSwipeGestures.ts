
import { useState, useRef } from 'react';

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

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();
    setIsDragging(true);
    console.log('Touch start at:', startPos.current);
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
      } else {
        setShowAction(null);
      }
    } else {
      if (deltaX < -30) {
        setShowAction('left');
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
                            deltaY < -30 && canSwipeUp;
    const shouldCompleteLeft = (Math.abs(deltaX) > distanceThreshold || velocityX > velocityThreshold) && 
                              deltaX < -30;
    
    console.log('Touch end - deltaY:', deltaY, 'shouldCompleteUp:', shouldCompleteUp, 'canSwipeUp:', canSwipeUp, 'onSwipeUp exists:', !!onSwipeUp);
    
    if (shouldCompleteUp && onSwipeUp) {
      console.log('EXECUTING SWIPE UP ACTION');
      setTimeout(() => onSwipeUp(), 100); // Small delay to ensure UI feedback
    } else if (shouldCompleteLeft && onSwipeLeft) {
      console.log('EXECUTING SWIPE LEFT ACTION');
      setTimeout(() => onSwipeLeft(), 100);
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const distance = showAction === 'up' ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
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
