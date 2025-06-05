import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabNavigation from '@/components/TabNavigation';
import MaintenanceTodayTab from '@/components/maintenance/tabs/MaintenanceTodayTab';
import MaintenanceScheduleTab from '@/components/maintenance/tabs/MaintenanceScheduleTab';
import MaintenanceInventoryTab from '@/components/maintenance/tabs/MaintenanceInventoryTab';
import MaintenanceVendorsTab from '@/components/maintenance/tabs/MaintenanceVendorsTab';
import MaintenanceSetupModule from '@/components/maintenance/MaintenanceSetupModule';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Settings, LogOut, User } from 'lucide-react';
import { UserProfile, ROLE_PERMISSIONS } from '@/types/users';
import { getFullName } from '@/utils/nameUtils';

const Maintenance = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('today');
  const [showSettings, setShowSettings] = useState(false);

  // Mock current user profile
  const [currentUserProfile] = useState<UserProfile>({
    id: '1',
    firstName: 'Mike',
    lastName: 'Rodriguez',
    email: 'mike.rodriguez@meridian.com',
    phone: '(555) 234-5678',
    role: 'maintenance',
    permissions: ROLE_PERMISSIONS.maintenance,
    contactInfo: {
      email: 'mike.rodriguez@meridian.com',
      phone: '(555) 234-5678'
    },
    status: 'active',
    createdAt: new Date('2025-01-01'),
    lastLogin: new Date('2025-06-05')
  });

  const tabs = [
    { id: 'today', label: 'Today', icon: '🔧' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'vendors', label: 'Vendors', icon: '🏢' }
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
        navigate('/operator');
        break;
      case 'maintenance':
        // Already in maintenance view
        break;
      default:
        break;
    }
  };

  if (showSettings) {
    return <MaintenanceSetupModule onClose={() => setShowSettings(false)} />;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applaud Maintenance</h1>
            <p className="text-sm text-gray-600">The Meridian • Maintenance Operations</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-orange-200 transition-all">
                  <AvatarFallback className="bg-orange-600 text-white font-semibold">
                    {currentUserProfile.firstName.charAt(0)}{currentUserProfile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getFullName(currentUserProfile.firstName, currentUserProfile.lastName)}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Maintenance Technician
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Setup</span>
              </DropdownMenuItem>
              
              {/* Role submenu items */}
              <DropdownMenuSeparator />
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
                  className="cursor-pointer text-sm"
                  onClick={() => handleRoleSwitch('resident')}
                >
                  Resident View
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-sm"
                  onClick={() => handleRoleSwitch('operator')}
                >
                  Operator View
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-sm bg-orange-50"
                  onClick={() => handleRoleSwitch('maintenance')}
                >
                  Maintenance View (Current)
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

export default Maintenance;
