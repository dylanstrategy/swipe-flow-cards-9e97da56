
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabNavigation from '@/components/TabNavigation';
import OperatorTodayTab from '@/components/operator/tabs/OperatorTodayTab';
import OperatorScheduleTab from '@/components/operator/tabs/OperatorScheduleTab';
import OperatorMessagesTab from '@/components/operator/tabs/OperatorMessagesTab';
import OperatorResidentsTab from '@/components/operator/tabs/OperatorResidentsTab';
import PropertySetupModule from '@/components/property/PropertySetupModule';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, LogOut } from 'lucide-react';

const Operator = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('today');
  const [showPropertySetup, setShowPropertySetup] = useState(false);

  const tabs = [
    { id: 'today', label: 'Today', icon: '📊' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'residents', label: 'Residents', icon: '👥' }
  ];

  const handleRoleSwitch = (role: string) => {
    switch (role) {
      case 'prospect':
        navigate('/discovery');
        break;
      case 'resident':
        navigate('/');
        break;
      case 'operator':
        // Already in operator view
        break;
      case 'maintenance':
        navigate('/maintenance');
        break;
      default:
        break;
    }
  };

  if (showPropertySetup) {
    return <PropertySetupModule onClose={() => setShowPropertySetup(false)} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'today':
        return <OperatorTodayTab />;
      case 'schedule':
        return <OperatorScheduleTab />;
      case 'messages':
        return <OperatorMessagesTab />;
      case 'residents':
        return <OperatorResidentsTab />;
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all">
                  <AvatarFallback className="bg-blue-600 text-white font-semibold">
                    OP
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Smith</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Property Manager
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => setShowPropertySetup(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Setup</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer focus:bg-accent">
                <div className="flex items-center w-full">
                  <User className="mr-2 h-4 w-4" />
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
                  className="cursor-pointer text-sm"
                  onClick={() => handleRoleSwitch('resident')}
                >
                  Resident View
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-sm bg-blue-50"
                  onClick={() => handleRoleSwitch('operator')}
                >
                  Operator View (Current)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-sm"
                  onClick={() => handleRoleSwitch('maintenance')}
                >
                  Maintenance View
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

export default Operator;
