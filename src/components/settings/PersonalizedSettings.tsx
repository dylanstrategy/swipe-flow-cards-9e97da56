
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Bell, Shield, Palette, Database, Globe, HelpCircle, ChevronRight } from 'lucide-react';
import ResidentIdentitySetup from '@/components/resident/ResidentIdentitySetup';

interface PersonalizedSettingsProps {
  onClose?: () => void;
  userRole?: string;
}

const PersonalizedSettings = ({ onClose, userRole }: PersonalizedSettingsProps) => {
  const [showIdentitySetup, setShowIdentitySetup] = useState(false);

  const handleBack = () => {
    if (showIdentitySetup) {
      setShowIdentitySetup(false);
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  const handleIdentityAccess = () => {
    setShowIdentitySetup(true);
  };

  if (showIdentitySetup) {
    return <ResidentIdentitySetup onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Setup & Configuration</h1>
            <p className="text-sm text-gray-600">Personalize your experience and manage settings</p>
          </div>
        </div>

        {/* Personal Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto min-h-[3rem] px-4 py-3"
              onClick={handleIdentityAccess}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <User className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Identity & Access</div>
                  <div className="text-sm text-gray-600 truncate">Manage your personal information and account settings</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>

            <Button variant="ghost" className="w-full justify-between h-auto min-h-[3rem] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Bell className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Notifications</div>
                  <div className="text-sm text-gray-600 truncate">Configure how and when you receive notifications</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>

            <Button variant="ghost" className="w-full justify-between h-auto min-h-[3rem] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Shield className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Privacy & Security</div>
                  <div className="text-sm text-gray-600 truncate">Control your privacy settings and security preferences</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>
          </CardContent>
        </Card>

        {/* Appearance & Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance & Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-between h-auto min-h-[3rem] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Palette className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Theme & Display</div>
                  <div className="text-sm text-gray-600 truncate">Customize colors, fonts, and layout preferences</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>

            <Button variant="ghost" className="w-full justify-between h-auto min-h-[3rem] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Globe className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Language & Region</div>
                  <div className="text-sm text-gray-600 truncate">Set your preferred language and regional settings</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>
          </CardContent>
        </Card>

        {/* Data & Storage */}
        <Card>
          <CardHeader>
            <CardTitle>Data & Storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-between h-auto min-h-[3rem] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Database className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Data Management</div>
                  <div className="text-sm text-gray-600 truncate">Manage your data storage and backup preferences</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle>Help & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-between h-auto min-h-[3rem] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <HelpCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Getting Started</div>
                  <div className="text-sm text-gray-600 truncate">Learn how to use the platform and get tips</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalizedSettings;
