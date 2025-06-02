
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
      {/* Compact Header Section */}
      {(title || subtitle || icon) && (
        <div className="text-center mb-3 flex-shrink-0 px-4 pt-2">
          {icon && (
            <div className="mb-1">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="text-base font-semibold text-gray-900 mb-1 leading-tight">{title}</h3>
          )}
          {subtitle && (
            <p className="text-xs text-gray-600 leading-tight">{subtitle}</p>
          )}
        </div>
      )}

      {/* Content Section - Maximum available space */}
      <div className={cn(
        "flex-1 min-h-0",
        "mx-4 mb-3",
        "border border-gray-200 rounded-lg bg-white",
        "overflow-y-auto",
        "max-h-[calc(100vh-180px)]", // Reduced from 240px to account for smaller header
        className
      )}>
        <div className="p-3 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseSlide;
