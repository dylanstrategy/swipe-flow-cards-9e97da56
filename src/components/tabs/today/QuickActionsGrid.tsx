
import React from 'react';
import { Package, Wrench, CreditCard } from 'lucide-react';

interface QuickActionsGridProps {
  onAction: (action: string, item: string) => void;
  onServiceClick: () => void;
  onMaintenanceClick: () => void;
  getRentUrgencyClass: () => string;
}

const QuickActionsGrid = ({ onAction, onServiceClick, onMaintenanceClick, getRentUrgencyClass }: QuickActionsGridProps) => {
  const quickActions = [
    { 
      icon: Package, 
      label: 'Services', 
      action: 'services',
      onClick: onServiceClick,
      bgColor: 'bg-green-500',
      textColor: 'text-white'
    },
    { 
      icon: Wrench, 
      label: 'Work Orders', 
      action: 'maintenance',
      onClick: onMaintenanceClick,
      bgColor: 'bg-purple-600',
      textColor: 'text-white',
      backgroundImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      subtitle: '3 pending • 1 in progress'
    },
    { 
      icon: CreditCard, 
      label: 'Rent Due', 
      action: 'pay-rent',
      className: getRentUrgencyClass(),
      onClick: () => onAction('Opened', 'Rent Payment'),
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
      subtitle: '$1,550 • Due in 3 days'
    }
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.action}
              onClick={action.onClick}
              className={`relative overflow-hidden p-6 rounded-xl transition-all hover:scale-105 active:scale-95 ${action.bgColor} ${action.className || ''}`}
              style={action.backgroundImage ? {
                backgroundImage: `url(${action.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {}}
            >
              {action.backgroundImage && (
                <div className="absolute inset-0 bg-purple-600/80 backdrop-blur-sm"></div>
              )}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <IconComponent size={32} className={action.textColor} />
                  <div className="text-left">
                    <div className={`text-xl font-semibold ${action.textColor}`}>
                      {action.label}
                    </div>
                    {action.subtitle && (
                      <div className={`text-sm opacity-90 ${action.textColor}`}>
                        {action.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
