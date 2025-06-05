
import React, { useState } from 'react';
import { ChevronLeft, Wrench, Users, Package, Settings as SettingsIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MaintenanceSetupModuleProps {
  onClose: () => void;
}

type SetupSection = 'overview' | 'vendors' | 'inventory' | 'schedules' | 'notifications';

const MaintenanceSetupModule = ({ onClose }: MaintenanceSetupModuleProps) => {
  const [currentSection, setCurrentSection] = useState<SetupSection>('overview');

  const setupSections = [
    {
      id: 'vendors' as const,
      title: 'Vendor Management',
      description: 'Add vendors, set response times, manage contracts',
      icon: Users,
      status: 'incomplete',
      completedItems: 3,
      totalItems: 8
    },
    {
      id: 'inventory' as const,
      title: 'Inventory Setup',
      description: 'Parts, supplies, stock levels, reorder points',
      icon: Package,
      status: 'incomplete',
      completedItems: 1,
      totalItems: 5
    },
    {
      id: 'schedules' as const,
      title: 'Maintenance Schedules',
      description: 'Preventive maintenance, recurring tasks',
      icon: Clock,
      status: 'incomplete',
      completedItems: 0,
      totalItems: 4
    },
    {
      id: 'notifications' as const,
      title: 'Alert Settings',
      description: 'Emergency alerts, escalation rules, SLA settings',
      icon: SettingsIcon,
      status: 'incomplete',
      completedItems: 2,
      totalItems: 6
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'complete' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'vendors':
        return (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Vendor Management</h1>
                <p className="text-sm text-gray-600">Configure your maintenance vendors and contractors</p>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Vendor setup will be implemented here...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'inventory':
        return (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Inventory Setup</h1>
                <p className="text-sm text-gray-600">Manage parts, supplies, and stock levels</p>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Inventory setup will be implemented here...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'schedules':
        return (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Maintenance Schedules</h1>
                <p className="text-sm text-gray-600">Set up preventive maintenance and recurring tasks</p>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Schedule setup will be implemented here...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <SettingsIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Alert Settings</h1>
                <p className="text-sm text-gray-600">Configure emergency alerts and escalation rules</p>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Notification setup will be implemented here...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Maintenance Setup</h1>
                <p className="text-sm text-gray-600">Configure your maintenance operations</p>
              </div>
            </div>

            <div className="grid gap-3">
              {setupSections.map((section) => {
                const Icon = section.icon;
                const completionPercentage = Math.round((section.completedItems / section.totalItems) * 100);
                
                return (
                  <Card 
                    key={section.id}
                    className="cursor-pointer hover:shadow-md transition-shadow shadow-sm"
                    onClick={() => setCurrentSection(section.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
                            <Icon className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">{section.title}</h3>
                              <Badge className={`${getStatusColor(section.status)} text-xs`}>
                                {section.status === 'complete' ? 'Complete' : 'Incomplete'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-2 truncate">{section.description}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-orange-600 h-1.5 rounded-full transition-all"
                                  style={{ width: `${completionPercentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {section.completedItems}/{section.totalItems}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs px-3 py-1 flex-shrink-0">
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={currentSection === 'overview' ? onClose : () => setCurrentSection('overview')}
            className="flex items-center gap-2 text-sm"
          >
            <ChevronLeft size={18} />
            {currentSection === 'overview' ? 'Back to Maintenance' : 'Back to Overview'}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {renderCurrentSection()}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSetupModule;
