
import React from 'react';
import { ArrowUp } from 'lucide-react';

interface SwipeActionOverlaysProps {
  showAction: 'up' | 'down' | 'left' | 'right' | null;
  canSwipeUp: boolean;
  getActionOpacity: () => number;
  cardColor?: string;
}

const SwipeActionOverlays = ({ 
  showAction, 
  canSwipeUp, 
  getActionOpacity,
  cardColor = '#22C55E'
}: SwipeActionOverlaysProps) => {
  
  // Convert hex to lighter version for background
  const getLighterColor = (hexColor: string, opacity: number = 0.3) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  return (
    <>
      {/* Swipe Up Action Overlay */}
      {showAction === 'up' && canSwipeUp && (
        <div 
          className="absolute inset-0 flex items-start justify-center pt-16 transition-all duration-200 pointer-events-none z-50"
          style={{ 
            backgroundColor: getLighterColor(cardColor, getActionOpacity() * 0.8),
            opacity: 1
          }}
        >
          <div className="text-white font-bold text-2xl flex flex-col items-center gap-3">
            <ArrowUp size={40} />
            <span>Continue</span>
          </div>
        </div>
      )}

      {/* Swipe Left Action Overlay */}
      {showAction === 'left' && (
        <div 
          className="absolute inset-0 flex items-center justify-start pl-12 transition-all duration-200 pointer-events-none z-50"
          style={{ 
            backgroundColor: getLighterColor('#EF4444', getActionOpacity() * 0.8),
            opacity: 1
          }}
        >
          <div className="text-white font-bold text-2xl flex items-center gap-4">
            <span className="text-3xl">←</span>
            <span>Back</span>
          </div>
        </div>
      )}
    </>
  );
};

export default SwipeActionOverlays;
