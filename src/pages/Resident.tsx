
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabNavigation from '@/components/TabNavigation';
import TodayTab from '@/components/tabs/TodayTab';
import ScheduleTab from '@/components/tabs/ScheduleTab';
import MessagesTab from '@/components/tabs/MessagesTab';
import AccountTab from '@/components/tabs/AccountTab';
import PersonalizedSettings from '@/components/settings/PersonalizedSettings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, LogOut, Home } from 'lucide-react';

const Resident = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('today');
  const [showSettings, setShowSettings] = useState(false);
  const [messagesUnreadCount, setMessagesUnreadCount] = useState(0);

  // Log the unread count changes for debugging
  useEffect(() => {
    console.log('Resident: messagesUnreadCount updated to:', messagesUnreadCount);
  }, [messagesUnreadCount]);

  const tabs = [
    { id: 'today', label: 'Today', icon: '🏠' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'messages', label: 'Messages', icon: '💬', badgeCount: messagesUnreadCount },
    { id: 'account', label: 'Account', icon: '👤' }
  ];

  const handleRoleSwitch = (role: string) => {
    switch (role) {
      case 'prospect':
        navigate('/discovery');
        break;
      case 'resident':
        // Already in resident view
        break;
      case 'operator':
        navigate('/operator');
        break;
      default:
        break;
    }
  };

  const handleMessagesUnreadCountChange = (count: number) => {
    console.log('Resident: Received unread count update:', count);
    setMessagesUnreadCount(count);
  };

  if (showSettings) {
    return <PersonalizedSettings onClose={() => setShowSettings(false)} userRole="resident" />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'today':
        return <TodayTab />;
      case 'schedule':
        return <ScheduleTab />;
      case 'messages':
        return <MessagesTab onUnreadCountChange={handleMessagesUnreadCountChange} />;
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Back to Home"
            >
              <Home size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Applaud Living</h1>
              <p className="text-sm text-gray-600">The Meridian • Apt 204</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all">
                  <AvatarFallback className="bg-blue-600 text-white font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white border shadow-lg z-[100] max-h-[calc(100vh-200px)] overflow-y-auto mb-32"
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Resident • Apt 204
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => setShowSettings(true)}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Setup</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer focus:bg-accent">
                <div className="flex items-center w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Role</span>
                </div>
              </DropdownMenuItem>
              
              {/* Role submenu items */}
              <div className="ml-6 space-y-1">
                <DropdownMenuItem 
                  className="cursor-pointer text-sm"
                  onClick={() => handleRoleSwitch('prospect')}
                >
                  Prospect View
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-sm bg-blue-50"
                  onClick={() => handleRoleSwitch('resident')}
                >
                  Resident View (Current)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-sm"
                  onClick={() => handleRoleSwitch('operator')}
                >
                  Operator View
                </DropdownMenuItem>
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

export default Resident;
