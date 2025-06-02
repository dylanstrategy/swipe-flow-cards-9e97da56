
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
    <div className="h-full max-h-full flex flex-col overflow-hidden">
      {/* Header Section - Fixed height */}
      {(title || subtitle || icon) && (
        <div className="text-center flex-shrink-0 px-4 pt-4 pb-3">
          {icon && (
            <div className="mb-2">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 leading-tight">{subtitle}</p>
          )}
        </div>
      )}

      {/* Content Section - Flexible with proper boundaries */}
      <div className={cn(
        "flex-1 min-h-0 px-4 pb-4",
        "overflow-y-auto",
        className
      )}>
        {children}
      </div>
    </div>
  );
};

export default BaseSlide;
