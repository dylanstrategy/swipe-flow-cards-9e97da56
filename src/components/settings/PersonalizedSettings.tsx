
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Bell, Shield, Palette, ChevronRight } from 'lucide-react';

type SettingsSection = 'data' | 'notifications' | 'privacy' | 'theme' | 'language' | 'help';

interface PersonalizedSettingsProps {
  onClose: () => void;
  userRole: 'prospect' | 'resident' | 'operator' | 'maintenance' | 'leasing' | 'management';
}

const PersonalizedSettings: React.FC<PersonalizedSettingsProps> = ({ onClose, userRole }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection | null>(null);

  const getSettingsForRole = () => {
    const baseSettings = [
      {
        id: 'data' as SettingsSection,
        title: 'Identity & Access',
        description: 'Manage your personal information, payment methods, and account access',
        icon: User,
        category: 'personal'
      },
      {
        id: 'notifications' as SettingsSection,
        title: 'Notifications',
        description: 'Configure how and when you receive alerts and updates',
        icon: Bell,
        category: 'personal'
      },
      {
        id: 'privacy' as SettingsSection,
        title: 'Privacy & Security',
        description: 'Control your privacy settings and security preferences',
        icon: Shield,
        category: 'personal'
      },
      {
        id: 'theme' as SettingsSection,
        title: 'Theme & Display',
        description: 'Customize colors, fonts, and layout preferences',
        icon: Palette,
        category: 'appearance'
      }
    ];

    // Add role-specific settings
    const roleSpecificSettings = [];
    
    if (userRole === 'operator' || userRole === 'management') {
      roleSpecificSettings.push(
        {
          id: 'language' as SettingsSection,
          title: 'Language & Region',
          description: 'Set your preferred language and regional settings',
          icon: Palette,
          category: 'appearance'
        },
        {
          id: 'help' as SettingsSection,
          title: 'Advanced Settings',
          description: 'Configure advanced system preferences and integrations',
          icon: Shield,
          category: 'appearance'
        }
      );
    } else if (userRole === 'maintenance') {
      roleSpecificSettings.push(
        {
          id: 'language' as SettingsSection,
          title: 'Work Preferences',
          description: 'Set your work schedule and maintenance preferences',
          icon: Palette,
          category: 'appearance'
        }
      );
    } else if (userRole === 'leasing') {
      roleSpecificSettings.push(
        {
          id: 'language' as SettingsSection,
          title: 'Communication',
          description: 'Configure prospect communication and follow-up settings',
          icon: Palette,
          category: 'appearance'
        }
      );
    }

    return [...baseSettings, ...roleSpecificSettings];
  };

  const settings = getSettingsForRole();
  const personalSettings = settings.filter(s => s.category === 'personal');
  const appearanceSettings = settings.filter(s => s.category === 'appearance');

  const renderSettingDetail = (section: SettingsSection) => {
    switch (section) {
      case 'data':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Full Name</span>
                  <span className="text-gray-600">John Doe</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Email</span>
                  <span className="text-gray-600">john.doe@example.com</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Phone</span>
                  <span className="text-gray-600">(555) 123-4567</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Settings</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Password</span>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Two-Factor Authentication</span>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-600">Receive updates via email</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-gray-600">Receive push notifications on your device</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-gray-600">Receive text message alerts</div>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Privacy Controls</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Data Sharing</div>
                    <div className="text-sm text-gray-600">Control how your data is shared</div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Activity Tracking</div>
                    <div className="text-sm text-gray-600">Choose what activity to track</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Appearance</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium mb-2">Theme</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Light</Button>
                    <Button variant="default" size="sm">Dark</Button>
                    <Button variant="outline" size="sm">Auto</Button>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium mb-2">Font Size</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Small</Button>
                    <Button variant="default" size="sm">Medium</Button>
                    <Button variant="outline" size="sm">Large</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Language & Region</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Language</span>
                  <span className="text-gray-600">English (US)</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Time Zone</span>
                  <span className="text-gray-600">Pacific Standard Time</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Advanced Settings</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Developer Mode</div>
                    <div className="text-sm text-gray-600">Enable advanced features</div>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Export Data</span>
                  <Button variant="outline" size="sm">Download</Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (activeSection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setActiveSection(null)}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {settings.find(s => s.id === activeSection)?.title}
              </h1>
              <p className="text-sm text-gray-600">
                {settings.find(s => s.id === activeSection)?.description}
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              {renderSettingDetail(activeSection)}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onClose} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Setup & Configuration</h1>
            <p className="text-sm text-gray-600">Personalize your experience and manage settings</p>
          </div>
        </div>

        {/* Personal Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Personal Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {personalSettings.map((setting) => {
              const IconComponent = setting.icon;
              return (
                <button
                  key={setting.id}
                  onClick={() => setActiveSection(setting.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">{setting.title}</div>
                      <div className="text-sm text-gray-600">{setting.description}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Appearance & Interface Section */}
        {appearanceSettings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Appearance & Interface</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appearanceSettings.map((setting) => {
                const IconComponent = setting.icon;
                return (
                  <button
                    key={setting.id}
                    onClick={() => setActiveSection(setting.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">{setting.title}</div>
                        <div className="text-sm text-gray-600">{setting.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PersonalizedSettings;
