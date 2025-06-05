
import React, { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Settings, Wrench, Calendar, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MaintenanceTodayTab from '@/components/maintenance/tabs/MaintenanceTodayTab';
import MaintenanceScheduleTab from '@/components/maintenance/tabs/MaintenanceScheduleTab';
import MaintenanceInventoryTab from '@/components/maintenance/tabs/MaintenanceInventoryTab';
import MaintenanceVendorsTab from '@/components/maintenance/tabs/MaintenanceVendorsTab';
import PropertySetupModule from '@/components/property/PropertySetupModule';

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [showSetup, setShowSetup] = useState(false);

  if (showSetup) {
    return <PropertySetupModule onClose={() => setShowSetup(false)} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'today':
        return <MaintenanceTodayTab />;
      case 'schedule':
        return <MaintenanceScheduleTab />;
      case 'inventory':
        return <MaintenanceInventoryTab />;
      case 'vendors':
        return <MaintenanceVendorsTab />;
      default:
        return <MaintenanceTodayTab />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-orange-600" />
            <h1 className="text-xl font-semibold text-gray-900">Maintenance Portal</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSetup(true)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Setup
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'today', label: 'Today', icon: '🔧' },
          { id: 'schedule', label: 'Schedule', icon: '📅' },
          { id: 'inventory', label: 'Inventory', icon: '📦' },
          { id: 'vendors', label: 'Vendors', icon: '🏢' }
        ]}
      />
    </div>
  );
};

export default Maintenance;
