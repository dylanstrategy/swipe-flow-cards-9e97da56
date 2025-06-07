
import React, { useState } from 'react';
import MaintenanceScheduleTab from '@/components/maintenance/tabs/MaintenanceScheduleTab';
import MaintenanceTodayTab from '@/components/maintenance/tabs/MaintenanceTodayTab';
import MaintenanceInventoryTab from '@/components/maintenance/tabs/MaintenanceInventoryTab';
import MaintenanceVendorsTab from '@/components/maintenance/tabs/MaintenanceVendorsTab';
import TabNavigation from '@/components/TabNavigation';

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [sharedTodayWorkOrders, setSharedTodayWorkOrders] = useState<any[]>([]);

  const handleTodayWorkOrdersChange = (workOrders: any[]) => {
    console.log('Parent - Updating shared today work orders:', workOrders);
    setSharedTodayWorkOrders(workOrders);
  };

  const tabs = [
    {
      id: 'today',
      label: 'Today',
      icon: '📅',
      badgeCount: sharedTodayWorkOrders.length
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: '🔧'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: '📦'
    },
    {
      id: 'vendors',
      label: 'Vendors',
      icon: '👥'
    }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'today':
        return <MaintenanceTodayTab todayWorkOrders={sharedTodayWorkOrders} />;
      case 'schedule':
        return (
          <MaintenanceScheduleTab 
            onTodayWorkOrdersChange={handleTodayWorkOrdersChange}
            todayWorkOrders={sharedTodayWorkOrders}
          />
        );
      case 'inventory':
        return <MaintenanceInventoryTab />;
      case 'vendors':
        return <MaintenanceVendorsTab />;
      default:
        return <MaintenanceTodayTab todayWorkOrders={sharedTodayWorkOrders} />;
    }
  };

  return (
    <div className="h-screen flex flex-col pb-20">
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>
      
      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Maintenance;
