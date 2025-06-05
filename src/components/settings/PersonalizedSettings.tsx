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
      workOrder: { leftAction: 'snooze', rightAction: 'reschedule' },
      management: { leftAction: 'reply', rightAction: 'archive' },
      lease: { leftAction: 'remind', rightAction: 'accept' },
      payment: { leftAction: 'remind', rightAction: 'pay' },
      community: { leftAction: 'maybe', rightAction: 'attend' },
      pointOfSale: { leftAction: 'ignore', rightAction: 'save' },
      petService: { leftAction: 'ignore', rightAction: 'book' }
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
      description: 'Customize swipe actions for different event types',
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

  const updateSwipeGesture = (eventType: string, direction: 'leftAction' | 'rightAction', action: string) => {
    setSettings(prev => ({
      ...prev,
      swipeGestures: {
        ...prev.swipeGestures,
        [eventType]: {
          ...prev.swipeGestures[eventType as keyof typeof prev.swipeGestures],
          [direction]: action
        }
      }
    }));
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'calendar':
        return (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="sticky top-0 bg-white z-10 pb-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Calendar Preferences</h2>
              <p className="text-sm text-gray-600">Set your availability and working hours</p>
            </div>
            
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3">Weekly Availability</h3>
                
                <div className="space-y-3">
                  {Object.entries(settings.availability).map(([day, daySettings]) => (
                    <div key={day} className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                      <div className="w-16 flex-shrink-0">
                        <Switch
                          checked={daySettings.enabled}
                          onCheckedChange={(checked) => updateDayAvailability(day, 'enabled', checked)}
                        />
                        <Label className="capitalize text-xs font-medium mt-1 block">{day.slice(0, 3)}</Label>
                      </div>
                      
                      {daySettings.enabled ? (
                        <div className="flex gap-2 flex-1">
                          <div className="flex-1">
                            <Label className="text-xs text-gray-500">Start</Label>
                            <Input
                              type="time"
                              value={daySettings.startTime}
                              onChange={(e) => updateDayAvailability(day, 'startTime', e.target.value)}
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs text-gray-500">End</Label>
                            <Input
                              type="time"
                              value={daySettings.endTime}
                              onChange={(e) => updateDayAvailability(day, 'endTime', e.target.value)}
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 text-gray-400 text-sm">
                          Not available
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="sticky bottom-0 bg-white pt-4 border-t">
              <Button onClick={() => setCurrentSection('overview')} variant="outline" className="w-full">
                Back to Overview
              </Button>
            </div>
          </div>
        );

      case 'swipes':
        return (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="sticky top-0 bg-white z-10 pb-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Swipe Gestures</h2>
              <p className="text-sm text-gray-600">Customize swipe actions for different event types</p>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'workOrder', label: 'Work Orders', leftOptions: ['snooze', 'cancel', 'reschedule'], rightOptions: ['reschedule', 'complete', 'assign'] },
                { key: 'management', label: 'Management Messages', leftOptions: ['reply', 'forward', 'snooze'], rightOptions: ['archive', 'mark-read', 'priority'] },
                { key: 'lease', label: 'Lease Items', leftOptions: ['remind', 'forward', 'snooze'], rightOptions: ['accept', 'review', 'schedule'] },
                { key: 'payment', label: 'Payments', leftOptions: ['remind', 'schedule', 'snooze'], rightOptions: ['pay', 'autopay', 'split'] },
                { key: 'community', label: 'Community Events', leftOptions: ['maybe', 'ignore', 'share'], rightOptions: ['attend', 'rsvp', 'calendar'] },
                { key: 'pointOfSale', label: 'Offers & Deals', leftOptions: ['ignore', 'later', 'share'], rightOptions: ['save', 'redeem', 'visit'] },
                { key: 'petService', label: 'Pet Services', leftOptions: ['ignore', 'later', 'share'], rightOptions: ['book', 'save', 'call'] }
              ].map((eventType) => (
                <Card key={eventType.key} className="shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{eventType.label}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Swipe Left Action</Label>
                        <select
                          value={settings.swipeGestures[eventType.key as keyof typeof settings.swipeGestures]?.leftAction || eventType.leftOptions[0]}
                          onChange={(e) => updateSwipeGesture(eventType.key, 'leftAction', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm"
                        >
                          {eventType.leftOptions.map(option => (
                            <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Swipe Right Action</Label>
                        <select
                          value={settings.swipeGestures[eventType.key as keyof typeof settings.swipeGestures]?.rightAction || eventType.rightOptions[0]}
                          onChange={(e) => updateSwipeGesture(eventType.key, 'rightAction', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm"
                        >
                          {eventType.rightOptions.map(option => (
                            <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white pt-4 border-t">
              <Button onClick={() => setCurrentSection('overview')} variant="outline" className="w-full">
                Back to Overview
              </Button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="sticky top-0 bg-white z-10 pb-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
              <p className="text-sm text-gray-600">Configure your alert preferences</p>
            </div>
            
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="text-sm font-medium">Push Notifications</Label>
                      <p className="text-xs text-gray-500">Receive alerts on your device</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="text-sm font-medium">Email Notifications</Label>
                      <p className="text-xs text-gray-500">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="text-sm font-medium">In-App Notifications</Label>
                      <p className="text-xs text-gray-500">Show notifications within the app</p>
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

            <div className="sticky bottom-0 bg-white pt-4 border-t">
              <Button onClick={() => setCurrentSection('overview')} variant="outline" className="w-full">
                Back to Overview
              </Button>
            </div>
          </div>
        );

      case 'identity':
        return (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="sticky top-0 bg-white z-10 pb-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Identity & Access</h2>
              <p className="text-sm text-gray-600">Profile and preferences</p>
            </div>
            
            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Profile Photo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                    <User className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-2">Upload a profile photo</p>
                    <Button variant="outline" size="sm" className="text-xs">
                      Choose File
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p className="text-xs text-gray-500 mb-2">For payments and reimbursements</p>
                  
                  <div className="space-y-3">
                    <select
                      value={settings.payment.method}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        payment: { ...prev.payment, method: e.target.value as 'ach' | 'card' }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="ach">ACH Bank Transfer</option>
                      <option value="card">Credit/Debit Card</option>
                    </select>
                    
                    {settings.payment.method === 'ach' ? (
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className="text-xs text-gray-600">Routing Number</Label>
                          <Input
                            placeholder="9-digit routing number"
                            value={settings.payment.achRouting}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              payment: { ...prev.payment, achRouting: e.target.value }
                            }))}
                            className="text-sm h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Account Number</Label>
                          <Input
                            placeholder="Bank account number"
                            value={settings.payment.achAccount}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              payment: { ...prev.payment, achAccount: e.target.value }
                            }))}
                            className="text-sm h-8"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-gray-600">Card Number</Label>
                          <Input
                            placeholder="1234 5678 9012 3456"
                            value={settings.payment.cardNumber}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              payment: { ...prev.payment, cardNumber: e.target.value }
                            }))}
                            className="text-sm h-8"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-gray-600">Expiry</Label>
                            <Input
                              placeholder="MM/YY"
                              value={settings.payment.cardExpiry}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                payment: { ...prev.payment, cardExpiry: e.target.value }
                              }))}
                              className="text-sm h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">CVC</Label>
                            <Input
                              placeholder="123"
                              value={settings.payment.cardCvc}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                payment: { ...prev.payment, cardCvc: e.target.value }
                              }))}
                              className="text-sm h-8"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Advertisement Preferences</Label>
                  <p className="text-xs text-gray-500 mb-3">Choose what type of ads you'd like to see</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="ads-both"
                        name="adPreferences"
                        value="both"
                        checked={settings.adPreferences === 'both'}
                        onChange={(e) => setSettings(prev => ({ ...prev, adPreferences: e.target.value as any }))}
                        className="w-3 h-3 text-blue-600"
                      />
                      <Label htmlFor="ads-both" className="text-xs">Building & Third-party ads</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="ads-building"
                        name="adPreferences"
                        value="building"
                        checked={settings.adPreferences === 'building'}
                        onChange={(e) => setSettings(prev => ({ ...prev, adPreferences: e.target.value as any }))}
                        className="w-3 h-3 text-blue-600"
                      />
                      <Label htmlFor="ads-building" className="text-xs">Building ads only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="ads-none"
                        name="adPreferences"
                        value="none"
                        checked={settings.adPreferences === 'none'}
                        onChange={(e) => setSettings(prev => ({ ...prev, adPreferences: e.target.value as any }))}
                        className="w-3 h-3 text-blue-600"
                      />
                      <Label htmlFor="ads-none" className="text-xs">No advertisements</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="sticky bottom-0 bg-white pt-4 border-t">
              <Button onClick={() => setCurrentSection('overview')} variant="outline" className="w-full">
                Back to Overview
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Personal Settings</h1>
              <p className="text-sm text-gray-600">Configure your profile and preferences</p>
            </div>

            <div className="grid gap-3">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                
                return (
                  <Card 
                    key={section.id}
                    className="cursor-pointer hover:shadow-md transition-shadow shadow-sm"
                    onClick={() => setCurrentSection(section.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">{section.title}</h3>
                              <Badge className={section.status === 'complete' ? 'bg-green-100 text-green-800 text-xs' : 'bg-orange-100 text-orange-800 text-xs'}>
                                {section.status === 'complete' ? 'Complete' : 'Incomplete'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{section.description}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs px-3 py-1 flex-shrink-0">
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
        <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={currentSection === 'overview' ? onClose : () => setCurrentSection('overview')}
            className="flex items-center gap-2 text-sm"
          >
            <ChevronLeft size={18} />
            {currentSection === 'overview' ? 'Back' : 'Back to Settings'}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {renderCurrentSection()}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedSettings;
