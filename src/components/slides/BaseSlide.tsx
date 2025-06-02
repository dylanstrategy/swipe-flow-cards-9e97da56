
import React from 'react';
import { cn } from '@/lib/utils';

interface BaseSlideProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const BaseSlide = ({ children, className, title, subtitle, icon }: BaseSlideProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header Section - Fixed height */}
      {(title || subtitle || icon) && (
        <div className="text-center mb-6 flex-shrink-0 px-6 pt-6">
          {icon && (
            <div className="mb-3">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}

      {/* Content Section - Flexible with proper boundaries */}
      <div className={cn(
        "flex-1 min-h-0 px-6 pb-6",
        "overflow-y-auto",
        className
      )}>
        {children}
      </div>
    </div>
  );
};

export default BaseSlide;
