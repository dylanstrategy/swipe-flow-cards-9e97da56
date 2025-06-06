
import React, { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import TodayTab from '@/components/tabs/TodayTab';
import ScheduleTab from '@/components/tabs/ScheduleTab';
import MessagesTab from '@/components/tabs/MessagesTab';
import AccountTab from '@/components/tabs/AccountTab';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      <div className="flex flex-col h-full relative">
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="pb-24"> {/* Reduced padding since we're using fixed positioning */}
            {renderActiveTab()}
          </div>
        </ScrollArea>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-[9999]">
          <TabNavigation 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>
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
