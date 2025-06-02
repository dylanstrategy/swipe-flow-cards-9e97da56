
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
    <div className="h-full flex flex-col max-h-screen">
      <BaseSlide title={title} subtitle={subtitle} icon={icon}>
        {/* Content wrapper with controlled spacing */}
        <div className="text-center space-y-4 max-h-[400px] overflow-y-auto">
          {typeof content === 'string' ? (
            <p className="text-gray-700 text-base leading-relaxed">{content}</p>
          ) : (
            content
          )}
          
          {bulletPoints && (
            <ul className="text-left space-y-2 mt-6">
              {bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </BaseSlide>

      {showContinuePrompt && (
        <div className="flex-shrink-0 text-center py-4 px-4 bg-white border-t border-gray-100">
          <p className="text-blue-600 font-medium text-sm mb-2">Ready to continue!</p>
          <p className="text-xs text-gray-500">Swipe up to continue</p>
        </div>
      )}
    </div>
  );
};

export default InstructionSlide;
