
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
import ContactProfileForm from '@/components/user/ContactProfileForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserProfile, ROLE_PERMISSIONS } from '@/types/users';

const Maintenance = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('today');
  const [showSetup, setShowSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContactProfile, setShowContactProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Mock current user profile
  const [currentUserProfile] = useState<UserProfile>({
    id: '2',
    first_name: 'Mike',
    last_name: 'Rodriguez',
    email: 'mike.rodriguez@meridian.com',
    phone: '(555) 234-5678',
    role: 'maintenance',
    permissions: ROLE_PERMISSIONS.maintenance,
    contactInfo: {
      email: 'mike.rodriguez@meridian.com',
      phone: '(555) 234-5678',
      emergencyContact: {
        name: 'Maria Rodriguez',
        phone: '(555) 876-5432',
        relationship: 'Wife'
      }
    },
    status: 'active',
    createdAt: new Date('2025-02-15'),
    lastLogin: new Date('2025-06-05'),
    createdBy: '1'
  });

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

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    console.log('Saving profile:', updatedProfile);
    // In real app, this would update the backend
    setIsEditingProfile(false);
  };

  if (showSetup) {
    return <MaintenanceSetupModule onClose={() => setShowSetup(false)} />;
  }

  if (showSettings) {
    return <PersonalizedSettings onClose={() => setShowSettings(false)} userRole="maintenance" />;
  }

  if (showContactProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <ContactProfileForm
          userProfile={currentUserProfile}
          onSave={handleSaveProfile}
          onCancel={() => {
            setShowContactProfile(false);
            setIsEditingProfile(false);
          }}
          isEditing={isEditingProfile}
        />
        {!isEditingProfile && (
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setShowContactProfile(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    );
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

  const fullName = `${currentUserProfile.first_name} ${currentUserProfile.last_name}`;

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
                    <p className="text-sm font-medium leading-none">{fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Maintenance Technician
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => setShowContactProfile(true)}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Contact Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
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
