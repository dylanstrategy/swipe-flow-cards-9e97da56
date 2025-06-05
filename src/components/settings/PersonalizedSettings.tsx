
import React, { useState } from 'react';
import { ChevronLeft, User, Calendar, Smartphone, Bell, CreditCard, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PropertySetupModule from '@/components/property/PropertySetupModule';

interface PersonalizedSettingsProps {
  onClose: () => void;
  userRole: 'operator' | 'resident' | 'maintenance' | 'prospect';
}

type SettingsSection = 'overview' | 'calendar' | 'swipes' | 'notifications' | 'identity' | 'property';

const PersonalizedSettings = ({ onClose, userRole }: PersonalizedSettingsProps) => {
  const [currentSection, setCurrentSection] = useState<SettingsSection>('overview');
  const [settings, setSettings] = useState({
    profilePhoto: '',
    availability: {
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '09:00',
      endTime: '17:00'
    },
    swipeGestures: {
      leftAction: 'snooze',
      rightAction: 'complete'
    },
    notifications: {
      push: true,
      email: true,
      inApp: true
    }
  });

  const settingsSections = [
    {
      id: 'calendar' as const,
      title: 'Calendar Preferences',
      description: 'Set your availability and working hours',
      icon: Calendar,
      status: 'incomplete'
    },
    {
      id: 'identity' as const,
      title: 'Identity & Access',
      description: 'Profile photo, banking details, permissions',
      icon: User,
      status: 'incomplete'
    },
    {
      id: 'swipes' as const,
      title: 'Swipe Gestures',
      description: 'Customize swipe actions for cards',
      icon: Smartphone,
      status: 'complete'
    },
    {
      id: 'notifications' as const,
      title: 'Notifications',
      description: 'Push, email, and in-app alert preferences',
      icon: Bell,
      status: 'complete'
    }
  ];

  // Add property setup for operators only
  if (userRole === 'operator') {
    settingsSections.push({
      id: 'property' as const,
      title: 'Property Setup',
      description: 'Configure property-level settings',
      icon: Settings,
      status: 'incomplete'
    });
  }

  if (currentSection === 'property' && userRole === 'operator') {
    return <PropertySetupModule onClose={() => setCurrentSection('overview')} />;
  }

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'calendar':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Calendar Preferences</h2>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Default Availability</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      type="time"
                      value={settings.availability.startTime}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        availability: { ...prev.availability, startTime: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      type="time"
                      value={settings.availability.endTime}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        availability: { ...prev.availability, endTime: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Working Days</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                      <div key={day} className="flex items-center space-x-2">
                        <Switch
                          checked={settings.availability.workDays.includes(day)}
                          onCheckedChange={(checked) => {
                            setSettings(prev => ({
                              ...prev,
                              availability: {
                                ...prev.availability,
                                workDays: checked 
                                  ? [...prev.availability.workDays, day]
                                  : prev.availability.workDays.filter(d => d !== day)
                              }
                            }));
                          }}
                        />
                        <Label className="capitalize">{day}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => setCurrentSection('overview')} variant="outline">
              Back to Overview
            </Button>
          </div>
        );

      case 'swipes':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Swipe Gestures</h2>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Customize Swipe Actions</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Swipe Left Action</Label>
                    <select
                      value={settings.swipeGestures.leftAction}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        swipeGestures: { ...prev.swipeGestures, leftAction: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                    >
                      <option value="snooze">Snooze</option>
                      <option value="delete">Delete</option>
                      <option value="archive">Archive</option>
                      <option value="assign">Assign</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label>Swipe Right Action</Label>
                    <select
                      value={settings.swipeGestures.rightAction}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        swipeGestures: { ...prev.swipeGestures, rightAction: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                    >
                      <option value="complete">Complete</option>
                      <option value="reply">Reply</option>
                      <option value="approve">Approve</option>
                      <option value="forward">Forward</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => setCurrentSection('overview')} variant="outline">
              Back to Overview
            </Button>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive alerts on your device</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>In-App Notifications</Label>
                      <p className="text-sm text-gray-500">Show notifications within the app</p>
                    </div>
                    <Switch
                      checked={settings.notifications.inApp}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, inApp: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => setCurrentSection('overview')} variant="outline">
              Back to Overview
            </Button>
          </div>
        );

      case 'identity':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Identity & Access</h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label>Profile Photo</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">Upload a profile photo</p>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Banking Details</Label>
                    <Input placeholder="Account information for payments/reimbursements" />
                  </div>
                  
                  <div>
                    <Label>Ad Personalization</Label>
                    <Textarea placeholder="Preferences for personalized content..." rows={3} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => setCurrentSection('overview')} variant="outline">
              Back to Overview
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Personal Settings</h1>
              <p className="text-gray-600">Configure your profile and preferences</p>
            </div>

            <div className="grid gap-4">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                
                return (
                  <Card 
                    key={section.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setCurrentSection(section.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                              <Badge className={section.status === 'complete' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                                {section.status === 'complete' ? 'Complete' : 'Incomplete'}
                              </Badge>
                            </div>
                            <p className="text-gray-600">{section.description}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={currentSection === 'overview' ? onClose : () => setCurrentSection('overview')}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            {currentSection === 'overview' ? 'Back' : 'Back to Settings'}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderCurrentSection()}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedSettings;
