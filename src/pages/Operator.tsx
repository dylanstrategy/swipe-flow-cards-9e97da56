
import React, { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import OperatorTodayTab from '@/components/operator/tabs/OperatorTodayTab';
import OperatorScheduleTab from '@/components/operator/tabs/OperatorScheduleTab';
import OperatorMessagesTab from '@/components/operator/tabs/OperatorMessagesTab';
import OperatorDashboardTab from '@/components/operator/tabs/OperatorDashboardTab';

const Operator = () => {
  const [activeTab, setActiveTab] = useState('today');

  const tabs = [
    { id: 'today', label: 'Today', icon: '📊' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'dashboard', label: 'Dashboard', icon: '📈' }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'today':
        return <OperatorTodayTab />;
      case 'schedule':
        return <OperatorScheduleTab />;
      case 'messages':
        return <OperatorMessagesTab />;
      case 'dashboard':
        return <OperatorDashboardTab />;
      default:
        return <OperatorTodayTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applaud Operations</h1>
            <p className="text-sm text-gray-600">The Meridian • Property Management</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">OP</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative">
        {renderActiveTab()}
      </main>

      {/* Tab Navigation */}
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default Operator;
