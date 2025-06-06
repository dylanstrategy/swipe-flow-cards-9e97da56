
import React, { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import TodayTab from '@/components/tabs/TodayTab';
import ScheduleTab from '@/components/tabs/ScheduleTab';
import MessagesTab from '@/components/tabs/MessagesTab';
import AccountTab from '@/components/tabs/AccountTab';

const ResidentPreview = () => {
  console.log('🏠 ResidentPreview rendering...');
  const [activeTab, setActiveTab] = useState('today');

  const tabs = [
    { id: 'today', label: 'Today', icon: '📊' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'account', label: 'Account', icon: '👤' }
  ];

  const renderActiveTab = () => {
    try {
      console.log('🏠 ResidentPreview rendering tab:', activeTab);
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
    } catch (error) {
      console.error('❌ Error rendering tab:', error);
      return (
        <div className="p-4 text-center">
          <p className="text-red-600">Something went wrong loading the {activeTab} tab.</p>
          <p className="text-sm text-gray-600 mt-2">{error.message}</p>
          <button 
            onClick={() => setActiveTab('today')} 
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Today
          </button>
        </div>
      );
    }
  };

  try {
    return (
      <div className="flex flex-col h-full">
        <div 
          className="flex-1 overflow-y-auto" 
          style={{ paddingBottom: '88px' }}
          data-scroll-container
        >
          {renderActiveTab()}
        </div>
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>
    );
  } catch (error) {
    console.error('❌ Error in ResidentPreview:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resident Interface</h2>
          <p className="text-gray-600 mb-4">Preview of resident dashboard</p>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium mb-2">Today's Overview</h3>
            <p className="text-sm text-gray-500">This would show the resident's daily summary</p>
          </div>
        </div>
      </div>
    );
  }
};

export default ResidentPreview;
