
import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SwipeUpPromptProps {
  onContinue: () => void;
  message?: string;
  buttonText?: string;
  className?: string;
}

const SwipeUpPrompt = ({ 
  onContinue, 
  message = "Ready to continue!", 
  buttonText = "Continue",
  className = ""
}: SwipeUpPromptProps) => {
  return (
    <div className={`text-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm ${className}`}>
      <p className="text-green-600 font-medium text-sm mb-2">{message}</p>
      <ArrowUp className="text-green-600 animate-bounce mx-auto mb-3" size={24} />
      <p className="text-xs text-gray-500 mb-3">Swipe up anywhere to continue</p>
      <Button
        onClick={onContinue}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default SwipeUpPrompt;
