
import React from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon: string;
  badgeCount?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation = ({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 relative overflow-visible",
              activeTab === tab.id 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-500 hover:text-gray-700"
            )}
            style={{ position: 'relative' }}
          >
            <div className="relative flex items-center justify-center w-10 h-10 mb-1">
              <span className="text-2xl">{tab.icon}</span>
              {tab.badgeCount && tab.badgeCount > 0 && (
                <div 
                  className="absolute bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg border-2 border-white"
                  style={{
                    top: '-2px',
                    right: '-2px',
                    zIndex: 30
                  }}
                >
                  {tab.badgeCount > 99 ? '99+' : tab.badgeCount}
                </div>
              )}
            </div>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
