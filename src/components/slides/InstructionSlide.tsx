
import React from 'react';
import BaseSlide from './BaseSlide';

interface InstructionSlideProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  content: string | React.ReactNode;
  bulletPoints?: string[];
  showContinuePrompt?: boolean;
}

const InstructionSlide = ({ 
  title, 
  subtitle, 
  icon, 
  content, 
  bulletPoints,
  showContinuePrompt = true 
}: InstructionSlideProps) => {
  return (
    <div className="h-full flex flex-col">
      <BaseSlide title={title} subtitle={subtitle} icon={icon} className="pb-0">
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="text-center space-y-6">
              {typeof content === 'string' ? (
                <p className="text-gray-700 text-lg leading-relaxed">{content}</p>
              ) : (
                content
              )}
              
              {bulletPoints && (
                <ul className="text-left space-y-3 mt-8 max-w-md mx-auto">
                  {bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-3 mt-1 text-lg">•</span>
                      <span className="text-gray-700 text-base">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {showContinuePrompt && (
            <div className="flex-shrink-0 text-center py-6 mt-4">
              <p className="text-blue-600 font-medium text-sm mb-2">Ready to continue!</p>
              <p className="text-xs text-gray-500">Swipe up to continue</p>
            </div>
          )}
        </div>
      </BaseSlide>
    </div>
  );
};

export default InstructionSlide;
