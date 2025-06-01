
import React, { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import TodayTab from '@/components/tabs/TodayTab';
import ScheduleTab from '@/components/tabs/ScheduleTab';
import MessagesTab from '@/components/tabs/MessagesTab';
import AccountTab from '@/components/tabs/AccountTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('today');

  const tabs = [
    { id: 'today', label: 'Today', icon: '🏠' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'account', label: 'Account', icon: '👤' }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'today':
        return <TodayTab />;
      case 'schedule':
        return <ScheduleTab />;
      case 'messages':
        return <MessagesTab />;
      case 'account':
        return <AccountTab />;
      default:
        return <TodayTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applaud Living</h1>
            <p className="text-sm text-gray-600">The Meridian • Apt 204</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">JD</span>
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

export default Index;
