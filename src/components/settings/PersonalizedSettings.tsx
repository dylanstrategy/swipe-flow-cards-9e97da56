
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
      monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      saturday: { enabled: false, startTime: '10:00', endTime: '14:00' },
      sunday: { enabled: false, startTime: '10:00', endTime: '14:00' }
    },
    swipeGestures: {
      leftAction: 'snooze',
      rightAction: 'complete'
    },
    notifications: {
      push: true,
      email: true,
      inApp: true
    },
    payment: {
      method: 'ach', // 'ach' or 'card'
      achRouting: '',
      achAccount: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: ''
    },
    adPreferences: 'both' // 'both', 'building', 'none'
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
      description: 'Profile photo, payment details, preferences',
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

  const updateDayAvailability = (day: string, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day as keyof typeof prev.availability],
          [field]: value
        }
      }
    }));
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'calendar':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Calendar Preferences</h2>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Weekly Availability</h3>
                
                <div className="space-y-4">
                  {Object.entries(settings.availability).map(([day, daySettings]) => (
                    <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-20">
                        <Switch
                          checked={daySettings.enabled}
                          onCheckedChange={(checked) => updateDayAvailability(day, 'enabled', checked)}
                        />
                        <Label className="capitalize text-sm font-medium mt-1 block">{day}</Label>
                      </div>
                      
                      {daySettings.enabled && (
                        <>
                          <div className="flex-1">
                            <Label className="text-xs text-gray-500">Start Time</Label>
                            <Input
                              type="time"
                              value={daySettings.startTime}
                              onChange={(e) => updateDayAvailability(day, 'startTime', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs text-gray-500">End Time</Label>
                            <Input
                              type="time"
                              value={daySettings.endTime}
                              onChange={(e) => updateDayAvailability(day, 'endTime', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </>
                      )}
                      
                      {!daySettings.enabled && (
                        <div className="flex-1 text-gray-400 text-sm">
                          Not available
                        </div>
                      )}
                    </div>
                  ))}
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
                <div className="space-y-6">
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
                    <Label className="text-lg font-semibold">Payment Information</Label>
                    <p className="text-sm text-gray-500 mb-4">For payments and reimbursements</p>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Payment Method</Label>
                        <select
                          value={settings.payment.method}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            payment: { ...prev.payment, method: e.target.value as 'ach' | 'card' }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                        >
                          <option value="ach">ACH Bank Transfer</option>
                          <option value="card">Credit/Debit Card</option>
                        </select>
                      </div>
                      
                      {settings.payment.method === 'ach' ? (
                        <>
                          <div>
                            <Label>Routing Number</Label>
                            <Input
                              placeholder="9-digit routing number"
                              value={settings.payment.achRouting}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                payment: { ...prev.payment, achRouting: e.target.value }
                              }))}
                            />
                          </div>
                          <div>
                            <Label>Account Number</Label>
                            <Input
                              placeholder="Bank account number"
                              value={settings.payment.achAccount}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                payment: { ...prev.payment, achAccount: e.target.value }
                              }))}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <Label>Card Number</Label>
                            <Input
                              placeholder="1234 5678 9012 3456"
                              value={settings.payment.cardNumber}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                payment: { ...prev.payment, cardNumber: e.target.value }
                              }))}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Expiry Date</Label>
                              <Input
                                placeholder="MM/YY"
                                value={settings.payment.cardExpiry}
                                onChange={(e) => setSettings(prev => ({
                                  ...prev,
                                  payment: { ...prev.payment, cardExpiry: e.target.value }
                                }))}
                              />
                            </div>
                            <div>
                              <Label>CVC</Label>
                              <Input
                                placeholder="123"
                                value={settings.payment.cardCvc}
                                onChange={(e) => setSettings(prev => ({
                                  ...prev,
                                  payment: { ...prev.payment, cardCvc: e.target.value }
                                }))}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-lg font-semibold">Advertisement Preferences</Label>
                    <p className="text-sm text-gray-500 mb-4">Choose what type of ads you'd like to see</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="ads-both"
                          name="adPreferences"
                          value="both"
                          checked={settings.adPreferences === 'both'}
                          onChange={(e) => setSettings(prev => ({ ...prev, adPreferences: e.target.value as any }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <Label htmlFor="ads-both">Building & Third-party ads</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="ads-building"
                          name="adPreferences"
                          value="building"
                          checked={settings.adPreferences === 'building'}
                          onChange={(e) => setSettings(prev => ({ ...prev, adPreferences: e.target.value as any }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <Label htmlFor="ads-building">Building ads only</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="ads-none"
                          name="adPreferences"
                          value="none"
                          checked={settings.adPreferences === 'none'}
                          onChange={(e) => setSettings(prev => ({ ...prev, adPreferences: e.target.value as any }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <Label htmlFor="ads-none">No advertisements</Label>
                      </div>
                    </div>
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
