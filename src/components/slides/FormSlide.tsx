
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
    <div className="h-full flex flex-col max-h-screen">
      <BaseSlide title={title} subtitle={subtitle} icon={icon}>
        {children}
      </BaseSlide>

      {/* Swipe Up Prompt - Fixed at bottom */}
      {canProceed && showSwipePrompt && (
        <div className="flex-shrink-0 text-center py-4 px-4 bg-white border-t border-gray-100">
          <p className="text-green-600 font-medium text-sm mb-2">Ready to continue!</p>
          <ArrowUp className="text-green-600 animate-bounce mx-auto mb-2" size={20} />
          <p className="text-xs text-gray-500">Swipe up to continue</p>
        </div>
      )}
    </div>
  );
};

export default FormSlide;
