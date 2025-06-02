
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
    <div className="h-full flex flex-col max-h-screen">
      {/* Header Section - Fixed height */}
      {(title || subtitle || icon) && (
        <div className="text-center mb-4 flex-shrink-0 px-4 pt-4">
          {icon && (
            <div className="mb-2">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}

      {/* Content Section - Scrollable with max height */}
      <div className={cn(
        "flex-1 min-h-0",
        "mx-4 mb-4",
        "border border-gray-200 rounded-lg bg-white",
        "overflow-y-auto",
        "max-h-[calc(100vh-240px)]", // Reserve space for header, footer, and swipe prompt
        className
      )}>
        <div className="p-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseSlide;
