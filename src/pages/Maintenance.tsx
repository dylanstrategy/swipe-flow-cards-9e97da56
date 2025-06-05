
import React, { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Settings, Wrench, Calendar, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MaintenanceTodayTab from '@/components/maintenance/tabs/MaintenanceTodayTab';
import MaintenanceScheduleTab from '@/components/maintenance/tabs/MaintenanceScheduleTab';
import MaintenanceInventoryTab from '@/components/maintenance/tabs/MaintenanceInventoryTab';
import PropertySetupModule from '@/components/property/PropertySetupModule';

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [showPropertySetup, setShowPropertySetup] = useState(false);

  if (showPropertySetup) {
    return <PropertySetupModule onClose={() => setShowPropertySetup(false)} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'today':
        return <MaintenanceTodayTab />;
      case 'schedule':
        return <MaintenanceScheduleTab />;
      case 'inventory':
        return <MaintenanceInventoryTab />;
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
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={[
          { id: 'today', label: 'Today', icon: 'Wrench' },
          { id: 'schedule', label: 'Schedule', icon: 'Calendar' },
          { id: 'inventory', label: 'Inventory', icon: 'Package' }
        ]}
      />
    </div>
  );
};

export default Maintenance;
