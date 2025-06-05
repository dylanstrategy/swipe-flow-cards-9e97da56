
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Bell, Shield, Palette, Database, Globe, HelpCircle, ChevronRight, Calendar } from 'lucide-react';
import ResidentIdentitySetup from '@/components/resident/ResidentIdentitySetup';

interface PersonalizedSettingsProps {
  onClose?: () => void;
  userRole?: string;
}

type SettingsSection = 'overview' | 'identity' | 'notifications' | 'privacy' | 'theme' | 'language' | 'calendar' | 'data' | 'help';

const PersonalizedSettings = ({ onClose, userRole }: PersonalizedSettingsProps) => {
  const [currentSection, setCurrentSection] = useState<SettingsSection>('overview');

  const handleBack = () => {
    if (currentSection !== 'overview') {
      setCurrentSection('overview');
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSectionSelect = (section: SettingsSection) => {
    setCurrentSection(section);
  };

  if (currentSection === 'identity') {
    return <ResidentIdentitySetup onBack={handleBack} />;
  }

  const renderSectionContent = () => {
    switch (currentSection) {
      case 'notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'privacy':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Privacy and security settings coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'theme':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme & Display
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Theme and display settings coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'language':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Language and region settings coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'calendar':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Calendar Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Calendar settings and preferences coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'data':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Data management settings coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'help':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Help and support content coming soon...</p>
            </CardContent>
          </Card>
        );

      default:
        return (
          <>
            {/* Personal Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between h-auto min-h-[3rem] px-4 py-3"
                  onClick={() => handleSectionSelect('identity')}
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

                <Button 
                  variant="ghost" 
                  className="w-full justify-between h-auto min-h-[3rem] px-4 py-3"
                  onClick={() => handleSectionSelect('notifications')}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Bell className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-medium truncate">Notifications</div>
                      <div className="text-sm text-gray-600 truncate">Configure how and when you receive notifications</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full justify-between h-auto min-h-[3rem] px-4 py-3"
                  onClick={() => handleSectionSelect('privacy')}
                >
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
                <Button 
                  variant="ghost" 
                  className="w-full justify-between h-auto min-h-[3rem] px-4 py-3"
                  onClick={() => handleSectionSelect('theme')}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Palette className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-medium truncate">Theme & Display</div>
                      <div className="text-sm text-gray-600 truncate">Customize colors, fonts, and layout preferences</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full justify-between h-auto min-h-[3rem] px-4 py-3"
                  onClick={() => handleSectionSelect('language')}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Globe className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-medium truncate">Language & Region</div>
                      <div className="text-sm text-gray-600 truncate">Set your preferred language and regional settings</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full justify-between h-auto min-h-[3rem] px-4 py-3"
                  onClick={() => handleSectionSelect('calendar')}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-medium truncate">Calendar Settings</div>
                      <div className="text-sm text-gray-600 truncate">Configure calendar preferences and scheduling options</div>
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
                <Button 
                  variant="ghost" 
                  className="w-full justify-between h-auto min-h-[3rem] px-4 py-3"
                  onClick={() => handleSectionSelect('data')}
                >
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
                <Button 
                  variant="ghost" 
                  className="w-full justify-between h-auto min-h-[3rem] px-4 py-3"
                  onClick={() => handleSectionSelect('help')}
                >
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
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentSection === 'overview' ? 'Setup & Configuration' : 
               currentSection === 'identity' ? 'Identity & Access' :
               currentSection === 'notifications' ? 'Notifications' :
               currentSection === 'privacy' ? 'Privacy & Security' :
               currentSection === 'theme' ? 'Theme & Display' :
               currentSection === 'language' ? 'Language & Region' :
               currentSection === 'calendar' ? 'Calendar Settings' :
               currentSection === 'data' ? 'Data Management' :
               currentSection === 'help' ? 'Getting Started' : 'Setup & Configuration'}
            </h1>
            <p className="text-sm text-gray-600">
              {currentSection === 'overview' ? 'Personalize your experience and manage settings' : 
               'Configure your preferences and settings'}
            </p>
          </div>
        </div>

        {renderSectionContent()}
      </div>
    </div>
  );
};

export default PersonalizedSettings;
