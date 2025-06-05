
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabNavigation from '@/components/TabNavigation';
import TodayTab from '@/components/tabs/TodayTab';
import ScheduleTab from '@/components/tabs/ScheduleTab';
import MessagesTab from '@/components/tabs/MessagesTab';
import AccountTab from '@/components/tabs/AccountTab';
import { useAuth } from '@/contexts/AuthContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

interface IndexProps {
  isImpersonated?: boolean;
}

const Index: React.FC<IndexProps> = ({ isImpersonated = false }) => {
  const navigate = useNavigate();
  const { user, userProfile, loading, impersonatedUser, isDevMode, devModeRole } = useAuth();
  const [activeTab, setActiveTab] = useState('today');
  
  const isReady = useProtectedRoute();
  
  // Don't render if not ready (either loading or redirecting)
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Create stable dev profile to avoid hydration issues
  const devProfile = {
    id: 'dev-mode-profile',
    email: 'test@resident.com',
    first_name: 'Test',
    last_name: 'User',
    role: devModeRole || 'resident' as const,
    phone: '201.212.0935',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z'
  };

  // When impersonated/dev mode, use the specific impersonated user if available, otherwise create mock user
  const effectiveUser = (isImpersonated || isDevMode) ? (impersonatedUser ? {
    id: impersonatedUser.id,
    email: impersonatedUser.email
  } : {
    id: 'dev-mode-user',
    email: 'test@resident.com'
  }) : user;

  const effectiveUserProfile = (isImpersonated || isDevMode) 
    ? (impersonatedUser || devProfile) 
    : userProfile;

  if (process.env.NODE_ENV === 'development') {
    console.log('🏠 Index rendering with:', { 
      isImpersonated, 
      isDevMode,
      hasUser: !!user, 
      hasProfile: !!userProfile,
      hasImpersonatedUser: !!impersonatedUser,
      effectiveUser: !!effectiveUser,
      effectiveProfile: !!effectiveUserProfile,
      devModeRole
    });
  }

  const tabs = [
    { id: 'today', label: 'Today', icon: '📊' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'account', label: 'Account', icon: '👤' }
  ];

  const renderActiveTab = () => {
    try {
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
      console.error('Error rendering tab:', error);
      return (
        <div className="p-4 text-center">
          <p className="text-red-600">Something went wrong. Please refresh the page.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="relative">
        {renderActiveTab()}
      </main>
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default Index;
