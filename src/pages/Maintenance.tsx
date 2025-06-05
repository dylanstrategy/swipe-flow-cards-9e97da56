
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabNavigation from '@/components/TabNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Settings, Wrench, Calendar, Package, Users, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MaintenanceTodayTab from '@/components/maintenance/tabs/MaintenanceTodayTab';
import MaintenanceScheduleTab from '@/components/maintenance/tabs/MaintenanceScheduleTab';
import MaintenanceInventoryTab from '@/components/maintenance/tabs/MaintenanceInventoryTab';
import MaintenanceVendorsTab from '@/components/maintenance/tabs/MaintenanceVendorsTab';
import MaintenanceSetupModule from '@/components/maintenance/MaintenanceSetupModule';
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

const Maintenance = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('today');
  const [showSetup, setShowSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

  if (showSetup) {
    return <MaintenanceSetupModule onClose={() => setShowSetup(false)} />;
  }

  if (showSettings) {
    return <PersonalizedSettings onClose={() => setShowSettings(false)} userRole="maintenance" />;
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
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Maintenance Portal</h1>
              <p className="text-sm text-gray-600">The Meridian • Maintenance Team</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSetup(true)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Setup
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-orange-200 transition-all">
                    <AvatarFallback className="bg-orange-600 text-white font-semibold">
                      MT
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
                    <p className="text-sm font-medium leading-none">Mike Rodriguez</p>
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
