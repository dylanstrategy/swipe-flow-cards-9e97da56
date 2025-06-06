
import React, { useState } from 'react';
import ResidentPreview from '@/components/admin/ResidentPreview';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User } from 'lucide-react';
import ResidentIdentitySetup from '@/components/resident/ResidentIdentitySetup';
import ResidentNotificationSetup from '@/components/resident/ResidentNotificationSetup';
import ResidentPrivacySetup from '@/components/resident/ResidentPrivacySetup';

const Resident = () => {
  const [activeSetup, setActiveSetup] = useState<'none' | 'identity' | 'notifications' | 'privacy'>('none');

  const handleCloseSetup = () => {
    setActiveSetup('none');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Resident Dashboard</h1>
        
        {/* Resident Dashboard */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <ResidentPreview />
          </CardContent>
        </Card>

        {/* Setup Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">Personal Settings</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Manage your profile, notifications, and privacy preferences
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left" 
                  onClick={() => setActiveSetup('identity')}
                >
                  Identity & Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => setActiveSetup('notifications')}
                >
                  Notification Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => setActiveSetup('privacy')}
                >
                  Privacy & Security
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">Configuration</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Access property management and system setup options
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                >
                  Property Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                >
                  Payment Methods
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                >
                  App Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Setup Modals */}
      {activeSetup === 'identity' && (
        <ResidentIdentitySetup onBack={handleCloseSetup} />
      )}
      {activeSetup === 'notifications' && (
        <ResidentNotificationSetup onBack={handleCloseSetup} />
      )}
      {activeSetup === 'privacy' && (
        <ResidentPrivacySetup onBack={handleCloseSetup} />
      )}
    </div>
  );
};

export default Resident;
