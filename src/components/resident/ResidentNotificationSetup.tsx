
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Bell, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface ResidentNotificationSetupProps {
  onBack: () => void;
}

const ResidentNotificationSetup: React.FC<ResidentNotificationSetupProps> = ({ onBack }) => {
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: {
      maintenanceUpdates: true,
      rentReminders: true,
      communityNews: false,
      emergencyAlerts: true,
      packageDeliveries: true,
      leaseRenewals: true
    },
    sms: {
      emergencyAlerts: true,
      maintenanceEntry: true,
      packageDeliveries: false,
      rentReminders: true
    },
    push: {
      maintenanceUpdates: true,
      messages: true,
      communityEvents: false,
      packageDeliveries: true
    }
  });

  const handleSave = () => {
    try {
      // Save to the shared localStorage key
      localStorage.setItem('residentPrivacy', JSON.stringify({
        ...JSON.parse(localStorage.getItem('residentPrivacy') || '{}'),
        ...notifications
      }));
      
      // Show success toast
      toast({
        title: "✅ Notifications Updated",
        description: "Your notification preferences have been saved successfully.",
        duration: 4000,
      });
      
      console.log('Resident notification settings saved successfully:', notifications);
    } catch (error) {
      console.error('Error saving resident notification settings:', error);
      toast({
        title: "❌ Save Failed",
        description: "Failed to save notification preferences. Please try again.",
        duration: 4000,
      });
    }
  };

  const handleEmailChange = (key: keyof typeof notifications.email, checked: boolean) => {
    const newNotifications = {
      ...notifications,
      email: { ...notifications.email, [key]: checked }
    };
    setNotifications(newNotifications);
    
    // Save immediately to the shared localStorage key
    try {
      const existingData = JSON.parse(localStorage.getItem('residentPrivacy') || '{}');
      localStorage.setItem('residentPrivacy', JSON.stringify({
        ...existingData,
        ...newNotifications
      }));
    } catch (error) {
      console.error('Error saving notification change:', error);
    }
  };

  const handleSmsChange = (key: keyof typeof notifications.sms, checked: boolean) => {
    const newNotifications = {
      ...notifications,
      sms: { ...notifications.sms, [key]: checked }
    };
    setNotifications(newNotifications);
    
    // Save immediately to the shared localStorage key
    try {
      const existingData = JSON.parse(localStorage.getItem('residentPrivacy') || '{}');
      localStorage.setItem('residentPrivacy', JSON.stringify({
        ...existingData,
        ...newNotifications
      }));
    } catch (error) {
      console.error('Error saving notification change:', error);
    }
  };

  const handlePushChange = (key: keyof typeof notifications.push, checked: boolean) => {
    const newNotifications = {
      ...notifications,
      push: { ...notifications.push, [key]: checked }
    };
    setNotifications(newNotifications);
    
    // Save immediately to the shared localStorage key
    try {
      const existingData = JSON.parse(localStorage.getItem('residentPrivacy') || '{}');
      localStorage.setItem('residentPrivacy', JSON.stringify({
        ...existingData,
        ...newNotifications
      }));
    } catch (error) {
      console.error('Error saving notification change:', error);
    }
  };

  // Load saved data on mount and listen for storage changes
  useEffect(() => {
    const loadNotificationData = () => {
      const saved = localStorage.getItem('residentPrivacy');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.email || data.sms || data.push) {
            setNotifications({
              email: data.email || notifications.email,
              sms: data.sms || notifications.sms,
              push: data.push || notifications.push
            });
          }
        } catch (error) {
          console.error('Error loading saved notification settings:', error);
        }
      }
    };

    loadNotificationData();

    // Listen for localStorage changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'residentPrivacy') {
        loadNotificationData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
            <p className="text-sm text-gray-600">Manage your notification preferences</p>
          </div>
        </div>

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Maintenance Updates</div>
                  <div className="text-sm text-gray-600">Work order status and completion notifications</div>
                </div>
                <Switch 
                  checked={notifications.email.maintenanceUpdates}
                  onCheckedChange={(checked) => handleEmailChange('maintenanceUpdates', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Rent Reminders</div>
                  <div className="text-sm text-gray-600">Monthly rent payment reminders</div>
                </div>
                <Switch 
                  checked={notifications.email.rentReminders}
                  onCheckedChange={(checked) => handleEmailChange('rentReminders', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Community News</div>
                  <div className="text-sm text-gray-600">Updates about community events and announcements</div>
                </div>
                <Switch 
                  checked={notifications.email.communityNews}
                  onCheckedChange={(checked) => handleEmailChange('communityNews', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Emergency Alerts</div>
                  <div className="text-sm text-gray-600">Critical emergency notifications</div>
                </div>
                <Switch 
                  checked={notifications.email.emergencyAlerts}
                  onCheckedChange={(checked) => handleEmailChange('emergencyAlerts', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Package Deliveries</div>
                  <div className="text-sm text-gray-600">Package arrival and pickup notifications</div>
                </div>
                <Switch 
                  checked={notifications.email.packageDeliveries}
                  onCheckedChange={(checked) => handleEmailChange('packageDeliveries', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Lease Renewals</div>
                  <div className="text-sm text-gray-600">Lease renewal reminders and updates</div>
                </div>
                <Switch 
                  checked={notifications.email.leaseRenewals}
                  onCheckedChange={(checked) => handleEmailChange('leaseRenewals', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMS Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              SMS Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Emergency Alerts</div>
                  <div className="text-sm text-gray-600">Critical emergency text messages</div>
                </div>
                <Switch 
                  checked={notifications.sms.emergencyAlerts}
                  onCheckedChange={(checked) => handleSmsChange('emergencyAlerts', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Maintenance Entry</div>
                  <div className="text-sm text-gray-600">Notifications when maintenance enters your unit</div>
                </div>
                <Switch 
                  checked={notifications.sms.maintenanceEntry}
                  onCheckedChange={(checked) => handleSmsChange('maintenanceEntry', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Package Deliveries</div>
                  <div className="text-sm text-gray-600">Package arrival notifications</div>
                </div>
                <Switch 
                  checked={notifications.sms.packageDeliveries}
                  onCheckedChange={(checked) => handleSmsChange('packageDeliveries', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Rent Reminders</div>
                  <div className="text-sm text-gray-600">Rent due date reminders</div>
                </div>
                <Switch 
                  checked={notifications.sms.rentReminders}
                  onCheckedChange={(checked) => handleSmsChange('rentReminders', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Push Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Maintenance Updates</div>
                  <div className="text-sm text-gray-600">Work order status updates</div>
                </div>
                <Switch 
                  checked={notifications.push.maintenanceUpdates}
                  onCheckedChange={(checked) => handlePushChange('maintenanceUpdates', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Messages</div>
                  <div className="text-sm text-gray-600">New message notifications</div>
                </div>
                <Switch 
                  checked={notifications.push.messages}
                  onCheckedChange={(checked) => handlePushChange('messages', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Community Events</div>
                  <div className="text-sm text-gray-600">Upcoming community event reminders</div>
                </div>
                <Switch 
                  checked={notifications.push.communityEvents}
                  onCheckedChange={(checked) => handlePushChange('communityEvents', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Package Deliveries</div>
                  <div className="text-sm text-gray-600">Package arrival notifications</div>
                </div>
                <Switch 
                  checked={notifications.push.packageDeliveries}
                  onCheckedChange={(checked) => handlePushChange('packageDeliveries', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default ResidentNotificationSetup;
