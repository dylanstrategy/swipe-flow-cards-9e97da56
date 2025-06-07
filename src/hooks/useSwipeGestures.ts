
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
  const hasTriggered = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    console.log('SWIPE: Touch start', { canSwipeUp, onSwipeUp: !!onSwipeUp });
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();
    hasTriggered.current = false;
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    // Prevent default scrolling if we're swiping
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      e.preventDefault();
    }
    
    // Apply dampening to the drag
    const dampening = 0.6;
    setDragOffset({ x: deltaX * dampening, y: deltaY * dampening });
    
    // Determine which action to show
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      // Vertical swipe
      if (deltaY < -20 && canSwipeUp && onSwipeUp) {
        setShowAction('up');
        console.log('SWIPE: Showing UP action', { deltaY, canSwipeUp });
      } else {
        setShowAction(null);
      }
    } else {
      // Horizontal swipe
      if (deltaX < -20 && onSwipeLeft) {
        setShowAction('left');
        console.log('SWIPE: Showing LEFT action', { deltaX });
      } else {
        setShowAction(null);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || hasTriggered.current) {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      setShowAction(null);
      return;
    }

    const deltaX = dragOffset.x / 0.6; // Reverse the dampening
    const deltaY = dragOffset.y / 0.6;
    const deltaTime = Date.now() - startTime.current;
    
    console.log('SWIPE: Touch end', { deltaX, deltaY, deltaTime, canSwipeUp, onSwipeUp: !!onSwipeUp, onSwipeLeft: !!onSwipeLeft });
    
    // More aggressive thresholds for completion
    const distanceThreshold = 30;
    const velocityThreshold = 0.15;
    
    const velocityX = Math.abs(deltaX) / Math.max(deltaTime, 1);
    const velocityY = Math.abs(deltaY) / Math.max(deltaTime, 1);
    
    const shouldCompleteUp = (Math.abs(deltaY) > distanceThreshold || velocityY > velocityThreshold) && 
                            deltaY < -15 && canSwipeUp && onSwipeUp;
    const shouldCompleteLeft = (Math.abs(deltaX) > distanceThreshold || velocityX > velocityThreshold) && 
                              deltaX < -15 && onSwipeLeft;
    
    console.log('SWIPE: Should complete?', { 
      shouldCompleteUp, 
      shouldCompleteLeft, 
      velocityY, 
      velocityX,
      distanceY: Math.abs(deltaY),
      distanceX: Math.abs(deltaX)
    });
    
    if (shouldCompleteUp) {
      console.log('SWIPE: EXECUTING UP ACTION!');
      hasTriggered.current = true;
      setTimeout(() => onSwipeUp(), 50); // Small delay to ensure state is clean
    } else if (shouldCompleteLeft) {
      console.log('SWIPE: EXECUTING LEFT ACTION!');
      hasTriggered.current = true;
      setTimeout(() => onSwipeLeft(), 50);
    }
    
    // Reset state
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const distance = showAction === 'up' ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
    const progress = Math.min(distance / 40, 1);
    return Math.max(0.4, progress * 0.9);
  };

  const getRotation = () => {
    if (!isDragging) return 0;
    return (dragOffset.x * 0.005); // Reduced rotation
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
