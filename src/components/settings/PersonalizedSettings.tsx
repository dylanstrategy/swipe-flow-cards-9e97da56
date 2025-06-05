
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Bell, Shield, Palette, Database, Globe, HelpCircle, ChevronRight, Calendar, Building } from 'lucide-react';
import ResidentIdentitySetup from '@/components/resident/ResidentIdentitySetup';
import PropertySetupModule from '@/components/property/PropertySetupModule';

interface PersonalizedSettingsProps {
  onClose?: () => void;
  userRole?: string;
}

type SettingsSection = 'overview' | 'identity' | 'notifications' | 'privacy' | 'theme' | 'language' | 'calendar' | 'data' | 'help' | 'property';

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

  if (currentSection === 'property') {
    return <PropertySetupModule onClose={handleBack} />;
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications on your device</p>
                  </div>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Maintenance Updates</h4>
                    <p className="text-sm text-gray-600">Get notified about work order updates</p>
                  </div>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
              </div>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Sharing</h4>
                    <p className="text-sm text-gray-600">Control how your data is shared</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Location Services</h4>
                    <p className="text-sm text-gray-600">Allow location-based features</p>
                  </div>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
              </div>
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
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Theme</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="bg-blue-50 border-blue-300">Light</Button>
                    <Button variant="outline" size="sm">Dark</Button>
                    <Button variant="outline" size="sm">Auto</Button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Font Size</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm">Small</Button>
                    <Button variant="outline" size="sm" className="bg-blue-50 border-blue-300">Medium</Button>
                    <Button variant="outline" size="sm">Large</Button>
                  </div>
                </div>
              </div>
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
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Language</h4>
                  <select className="w-full p-2 border rounded">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Date Format</h4>
                  <select className="w-full p-2 border rounded">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Time Format</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="bg-blue-50 border-blue-300">12 Hour</Button>
                    <Button variant="outline" size="sm">24 Hour</Button>
                  </div>
                </div>
              </div>
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
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Start of Week</h4>
                  <select className="w-full p-2 border rounded">
                    <option>Sunday</option>
                    <option>Monday</option>
                  </select>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Default View</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm">Day</Button>
                    <Button variant="outline" size="sm" className="bg-blue-50 border-blue-300">Week</Button>
                    <Button variant="outline" size="sm">Month</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Weekends</h4>
                    <p className="text-sm text-gray-600">Display weekends in calendar view</p>
                  </div>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
              </div>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto Backup</h4>
                    <p className="text-sm text-gray-600">Automatically backup your data</p>
                  </div>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Storage Usage</h4>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">4.5 GB of 10 GB used</p>
                </div>
                <Button variant="outline" className="w-full">Export Data</Button>
              </div>
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
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  📖 User Guide
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  💬 Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🎥 Video Tutorials
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  ❓ FAQ
                </Button>
              </div>
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

            {/* Property Management (for operators) */}
            {(userRole === 'operator' || userRole === 'senior_operator') && (
              <Card>
                <CardHeader>
                  <CardTitle>Property Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between h-auto min-h-[3rem] px-4 py-3"
                    onClick={() => handleSectionSelect('property')}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Building className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="text-left min-w-0 flex-1">
                        <div className="font-medium truncate">Property Setup</div>
                        <div className="text-sm text-gray-600 truncate">Configure property settings, branding, and amenities</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </Button>
                </CardContent>
              </Card>
            )}

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
               currentSection === 'property' ? 'Property Setup' :
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
