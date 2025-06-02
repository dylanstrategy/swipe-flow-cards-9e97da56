
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
      onClick: onServiceClick
    },
    { 
      icon: Wrench, 
      label: 'Maintenance', 
      action: 'maintenance',
      onClick: onMaintenanceClick
    },
    { 
      icon: CreditCard, 
      label: 'Pay Rent', 
      action: 'pay-rent',
      className: getRentUrgencyClass(),
      onClick: () => onAction('Opened', 'Rent Payment')
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.action}
              onClick={action.onClick}
              className={`bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all text-center ${action.className || ''}`}
            >
              <IconComponent size={24} className="mx-auto mb-2 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
