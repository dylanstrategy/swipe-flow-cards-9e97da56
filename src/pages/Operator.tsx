import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabNavigation from '@/components/TabNavigation';
import OperatorTodayTab from '@/components/operator/tabs/OperatorTodayTab';
import OperatorScheduleTab from '@/components/operator/tabs/OperatorScheduleTab';
import OperatorMessagesTab from '@/components/operator/tabs/OperatorMessagesTab';
import OperatorResidentsTab from '@/components/operator/tabs/OperatorResidentsTab';
import PropertySetupModule from '@/components/property/setup/PropertySetupModule';
import UserManagement from '@/components/user/UserManagement';
import ContactProfileForm from '@/components/user/ContactProfileForm';
import { eventMonitoringService } from '@/services/eventMonitoringService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, LogOut, Users, ArrowLeft } from 'lucide-react';
import { UserProfile, ROLE_PERMISSIONS } from '@/types/users';
import { Button } from '@/components/ui/button';

const Operator = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('today');
  const [showSettings, setShowSettings] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showContactProfile, setShowContactProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(4);

  // Mock current user profile - updated to senior_operator
  const [currentUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Smith',
    email: 'john.smith@meridian.com',
    phone: '(555) 123-4567',
    role: 'senior_operator',
    permissions: ROLE_PERMISSIONS.senior_operator,
    contactInfo: {
      email: 'john.smith@meridian.com',
      phone: '(555) 123-4567',
      emergencyContact: {
        name: 'Jane Smith',
        phone: '(555) 987-6543',
        relationship: 'Spouse'
      }
    },
    status: 'active',
    createdAt: new Date('2025-01-01'),
    lastLogin: new Date('2025-06-05')
  });

  // Initialize event monitoring service
  useEffect(() => {
    console.log('Initializing event monitoring service for Operator dashboard');
    
    // In a real app, this would fetch events from the API
    const mockEvents = []; // Empty for now, will be populated by actual events
    
    eventMonitoringService.startMonitoring(mockEvents, 60000); // Check every minute
    
    return () => {
      eventMonitoringService.stopMonitoring();
    };
  }, []);

  const tabs = [
    { id: 'today', label: 'Today', icon: '📊' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'messages', label: 'Messages', icon: '💬', badgeCount: unreadMessagesCount },
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

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    console.log('Saving profile:', updatedProfile);
    // In real app, this would update the backend
    setIsEditingProfile(false);
  };

  const handleUnreadCountChange = (count: number) => {
    setUnreadMessagesCount(count);
  };

  if (showSettings) {
    return <PropertySetupModule onClose={() => setShowSettings(false)} />;
  }

  if (showUserManagement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Applaud Operations</h1>
              <p className="text-sm text-gray-600">The Meridian • Property Management</p>
            </div>
            <Button variant="outline" onClick={() => setShowUserManagement(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
        <UserManagement />
      </div>
    );
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        return <OperatorTodayTab />;
      case 'schedule':
        return <OperatorScheduleTab />;
      case 'messages':
        return <OperatorMessagesTab onUnreadCountChange={handleUnreadCountChange} />;
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
                  <p className="text-sm font-medium leading-none">{currentUserProfile.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Property Manager
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
                onClick={() => setShowUserManagement(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Manage Users</span>
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
