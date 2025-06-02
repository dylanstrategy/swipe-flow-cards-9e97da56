
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
      <BaseSlide title={title} subtitle={subtitle} icon={icon}>
        {children}
      </BaseSlide>

      {/* Swipe Up Prompt */}
      {canProceed && showSwipePrompt && (
        <div className="text-center pt-4 flex-shrink-0">
          <p className="text-green-600 font-medium text-sm mb-2">Ready to continue!</p>
          <ArrowUp className="text-green-600 animate-bounce mx-auto mb-2" size={20} />
          <p className="text-xs text-gray-500">Swipe up to continue</p>
        </div>
      )}
    </div>
  );
};

export default FormSlide;
