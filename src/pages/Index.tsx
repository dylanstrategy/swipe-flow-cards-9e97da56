
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabNavigation from '@/components/TabNavigation';
import TodayTab from '@/components/tabs/TodayTab';
import ScheduleTab from '@/components/tabs/ScheduleTab';
import MessagesTab from '@/components/tabs/MessagesTab';
import AccountTab from '@/components/tabs/AccountTab';
import { useAuth } from '@/contexts/AuthContext';

interface IndexProps {
  isImpersonated?: boolean;
}

const Index: React.FC<IndexProps> = ({ isImpersonated = false }) => {
  const navigate = useNavigate();
  const { user, userProfile, loading, impersonatedUser } = useAuth();
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    // Only redirect if not impersonated and no auth
    if (!isImpersonated && !loading && (!user || !userProfile)) {
      console.log('🚫 No user/profile, redirecting to login');
      navigate('/login');
    }
  }, [user, userProfile, loading, navigate, isImpersonated]);

  // Show loading while checking auth (but not during impersonation)
  if (!isImpersonated && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated (but allow during impersonation)
  if (!isImpersonated && (!user || !userProfile)) {
    return null;
  }

  // When impersonated, use the specific impersonated user if available, otherwise create mock user
  const effectiveUser = isImpersonated ? (impersonatedUser ? {
    id: impersonatedUser.id,
    email: impersonatedUser.email
  } : {
    id: 'impersonated-user',
    email: 'test@resident.com'
  }) : user;

  const effectiveUserProfile = isImpersonated ? (impersonatedUser || {
    id: 'impersonated-profile',
    email: 'test@resident.com',
    first_name: 'Test',
    last_name: 'Resident',
    role: 'resident' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }) : userProfile;

  console.log('🏠 Index rendering with:', { 
    isImpersonated, 
    hasUser: !!user, 
    hasProfile: !!userProfile,
    hasImpersonatedUser: !!impersonatedUser,
    effectiveUser: !!effectiveUser,
    effectiveProfile: !!effectiveUserProfile
  });

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
