
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
      {/* Header Section */}
      {(title || subtitle || icon) && (
        <div className="text-center mb-4 flex-shrink-0">
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

      {/* Content Section */}
      <div className={cn(
        "flex-1 min-h-0 overflow-y-auto",
        "border border-gray-200 rounded-lg bg-white",
        "p-4 space-y-4",
        className
      )}>
        {children}
      </div>
    </div>
  );
};

export default BaseSlide;
