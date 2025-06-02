
import React from 'react';
import { ArrowUp } from 'lucide-react';
import BaseSlide from './BaseSlide';

interface FormSlideProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  canProceed?: boolean;
  showSwipePrompt?: boolean;
}

const FormSlide = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  canProceed = false,
  showSwipePrompt = true 
}: FormSlideProps) => {
  return (
    <div className="h-full flex flex-col">
      <BaseSlide title={title} subtitle={subtitle} icon={icon} className="pb-0">
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto">
            {children}
          </div>
          
          {/* Swipe Up Prompt - Fixed at bottom of content area */}
          {canProceed && showSwipePrompt && (
            <div className="flex-shrink-0 text-center py-6 mt-4">
              <p className="text-green-600 font-medium text-sm mb-2">Ready to continue!</p>
              <ArrowUp className="text-green-600 animate-bounce mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-500">Swipe up to continue</p>
            </div>
          )}
        </div>
      </BaseSlide>
    </div>
  );
};

export default FormSlide;
