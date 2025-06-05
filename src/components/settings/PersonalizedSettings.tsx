import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, User, Bell, Shield, Palette, ChevronRight, Calendar, CreditCard, Globe, HelpCircle } from 'lucide-react';

type SettingsSection = 'data' | 'notifications' | 'privacy' | 'theme' | 'language' | 'help' | 'identity' | 'calendar' | 'property';

interface PersonalizedSettingsProps {
  onClose: () => void;
  userRole: 'prospect' | 'resident' | 'operator' | 'maintenance' | 'leasing' | 'management';
}

const PersonalizedSettings: React.FC<PersonalizedSettingsProps> = ({ onClose, userRole }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '10:00', end: '14:00' },
    sunday: { enabled: false, start: '10:00', end: '14:00' }
  });

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
        id: 'calendar' as SettingsSection,
        title: 'Calendar Integration',
        description: 'Sync with external calendars and manage scheduling preferences',
        icon: Calendar,
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
          icon: Globe,
          category: 'appearance'
        },
        {
          id: 'help' as SettingsSection,
          title: 'Advanced Settings',
          description: 'Configure advanced system preferences and integrations',
          icon: HelpCircle,
          category: 'appearance'
        },
        {
          id: 'property' as SettingsSection,
          title: 'Property Management',
          description: 'Configure property-specific settings and integrations',
          icon: CreditCard,
          category: 'appearance'
        }
      );
    } else if (userRole === 'maintenance') {
      roleSpecificSettings.push(
        {
          id: 'language' as SettingsSection,
          title: 'Work Preferences',
          description: 'Set your work schedule and maintenance preferences',
          icon: Globe,
          category: 'appearance'
        }
      );
    } else if (userRole === 'leasing') {
      roleSpecificSettings.push(
        {
          id: 'language' as SettingsSection,
          title: 'Communication',
          description: 'Configure prospect communication and follow-up settings',
          icon: Globe,
          category: 'appearance'
        }
      );
    }

    return [...baseSettings, ...roleSpecificSettings];
  };

  const settings = getSettingsForRole();
  const personalSettings = settings.filter(s => s.category === 'personal');
  const appearanceSettings = settings.filter(s => s.category === 'appearance');

  const handleScheduleChange = (day: string, field: string, value: string | boolean) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

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

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Primary Card</div>
                    <div className="text-sm text-gray-600">Visa ending in 4567</div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Bank Account</div>
                    <div className="text-sm text-gray-600">Account ending in 1234</div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
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

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Timing</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Quiet Hours</span>
                  <span className="text-gray-600">10 PM - 8 AM</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Maintenance Alerts</span>
                  <span className="text-gray-600">Immediate</span>
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
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Location Services</div>
                    <div className="text-sm text-gray-600">Allow location-based features</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Data Management</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Download My Data</span>
                  <Button variant="outline" size="sm">Export</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Delete Account</span>
                  <Button variant="outline" size="sm">Request</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6 max-w-full overflow-hidden">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Calendar Integration</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">Google Calendar</div>
                    <div className="text-sm text-gray-600">Sync with your Google Calendar</div>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0">Connect</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">Outlook Calendar</div>
                    <div className="text-sm text-gray-600">Sync with Microsoft Outlook</div>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0">Connect</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">Apple Calendar</div>
                    <div className="text-sm text-gray-600">Sync with iCloud Calendar</div>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0">Connect</Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Weekly Schedule Setup</h3>
              <p className="text-sm text-gray-600 mb-4">Configure your available hours for each day of the week</p>
              <div className="space-y-3">
                {Object.entries(weeklySchedule).map(([day, schedule]) => (
                  <div key={day} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={schedule.enabled}
                          onCheckedChange={(checked) => handleScheduleChange(day, 'enabled', checked)}
                        />
                        <span className="font-medium capitalize">{day}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.enabled ? `${schedule.start} - ${schedule.end}` : 'Unavailable'}
                      </div>
                    </div>
                    
                    {schedule.enabled && (
                      <div className="flex flex-col sm:flex-row gap-3 ml-7">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 whitespace-nowrap">Start:</label>
                          <input
                            type="time"
                            value={schedule.start}
                            onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                            className="px-2 py-1 border rounded text-sm w-full sm:w-auto"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 whitespace-nowrap">End:</label>
                          <input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                            className="px-2 py-1 border rounded text-sm w-full sm:w-auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Scheduling Preferences</h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border rounded-lg">
                  <span className="font-medium">Default Meeting Duration</span>
                  <select className="px-2 py-1 border rounded text-sm w-full sm:w-auto">
                    <option value="15">15 minutes</option>
                    <option value="30" defaultValue="">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border rounded-lg">
                  <span className="font-medium">Buffer Time Between Appointments</span>
                  <select className="px-2 py-1 border rounded text-sm w-full sm:w-auto">
                    <option value="0">No buffer</option>
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15" defaultValue="">15 minutes</option>
                    <option value="30">30 minutes</option>
                  </select>
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
                <div className="p-3 border rounded-lg">
                  <div className="font-medium mb-2">Color Scheme</div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">Blue</Button>
                    <Button variant="outline" size="sm">Green</Button>
                    <Button variant="outline" size="sm">Purple</Button>
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
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Date Format</span>
                  <span className="text-gray-600">MM/DD/YYYY</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Currency</span>
                  <span className="text-gray-600">USD ($)</span>
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
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Beta Features</div>
                    <div className="text-sm text-gray-600">Access experimental features</div>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Integration Settings</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>API Access</span>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span>Webhooks</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'property':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Management</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Property Management System</div>
                    <div className="text-sm text-gray-600">Connect to your PMS</div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Accounting Integration</div>
                    <div className="text-sm text-gray-600">Sync with accounting software</div>
                  </div>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Maintenance Platform</div>
                    <div className="text-sm text-gray-600">Connect maintenance tools</div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
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
