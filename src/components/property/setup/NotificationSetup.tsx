
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Bell, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface NotificationSetupProps {
  onBack: () => void;
}

const NotificationSetup: React.FC<NotificationSetupProps> = ({ onBack }) => {
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: {
      workOrders: true,
      moveIns: true,
      moveOuts: true,
      emergencies: true,
      dailyReports: false,
      weeklyReports: true,
      maintenanceAlerts: true,
      leaseRenewals: true
    },
    sms: {
      emergencies: true,
      urgentWorkOrders: true,
      moveInReminders: true,
      importantUpdates: false
    },
    push: {
      newMessages: true,
      taskReminders: true,
      meetingAlerts: true,
      systemUpdates: false
    },
    desktop: {
      incomingCalls: true,
      newEmails: false,
      calendarReminders: true,
      systemAlerts: true
    }
  });

  const handleSave = () => {
    try {
      // Save to localStorage
      localStorage.setItem('notificationSettings', JSON.stringify(notifications));
      
      // Show success toast
      toast({
        title: "✅ Notifications Updated",
        description: "Your notification preferences have been saved successfully.",
        duration: 4000,
      });
      
      console.log('Notification settings saved successfully:', notifications);
    } catch (error) {
      console.error('Error saving notification settings:', error);
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
    
    // Save immediately
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(newNotifications));
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
    
    // Save immediately
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(newNotifications));
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
    
    // Save immediately
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(newNotifications));
    } catch (error) {
      console.error('Error saving notification change:', error);
    }
  };

  const handleDesktopChange = (key: keyof typeof notifications.desktop, checked: boolean) => {
    const newNotifications = {
      ...notifications,
      desktop: { ...notifications.desktop, [key]: checked }
    };
    setNotifications(newNotifications);
    
    // Save immediately
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(newNotifications));
    } catch (error) {
      console.error('Error saving notification change:', error);
    }
  };

  // Load saved data on mount and listen for storage changes
  useEffect(() => {
    const loadNotificationData = () => {
      const saved = localStorage.getItem('notificationSettings');
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading saved notification settings:', error);
        }
      }
    };

    loadNotificationData();

    // Listen for localStorage changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notificationSettings') {
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
                  <div className="font-medium">Work Orders</div>
                  <div className="text-sm text-gray-600">New work orders and updates</div>
                </div>
                <Switch 
                  checked={notifications.email.workOrders}
                  onCheckedChange={(checked) => handleEmailChange('workOrders', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Move-Ins</div>
                  <div className="text-sm text-gray-600">Move-in notifications and reminders</div>
                </div>
                <Switch 
                  checked={notifications.email.moveIns}
                  onCheckedChange={(checked) => handleEmailChange('moveIns', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Move-Outs</div>
                  <div className="text-sm text-gray-600">Move-out notifications and reminders</div>
                </div>
                <Switch 
                  checked={notifications.email.moveOuts}
                  onCheckedChange={(checked) => handleEmailChange('moveOuts', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Emergency Alerts</div>
                  <div className="text-sm text-gray-600">Critical emergency notifications</div>
                </div>
                <Switch 
                  checked={notifications.email.emergencies}
                  onCheckedChange={(checked) => handleEmailChange('emergencies', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Daily Reports</div>
                  <div className="text-sm text-gray-600">Daily summary reports</div>
                </div>
                <Switch 
                  checked={notifications.email.dailyReports}
                  onCheckedChange={(checked) => handleEmailChange('dailyReports', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Weekly Reports</div>
                  <div className="text-sm text-gray-600">Weekly summary reports</div>
                </div>
                <Switch 
                  checked={notifications.email.weeklyReports}
                  onCheckedChange={(checked) => handleEmailChange('weeklyReports', checked)}
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
                  checked={notifications.sms.emergencies}
                  onCheckedChange={(checked) => handleSmsChange('emergencies', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Urgent Work Orders</div>
                  <div className="text-sm text-gray-600">High-priority work order alerts</div>
                </div>
                <Switch 
                  checked={notifications.sms.urgentWorkOrders}
                  onCheckedChange={(checked) => handleSmsChange('urgentWorkOrders', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Move-In Reminders</div>
                  <div className="text-sm text-gray-600">Move-in appointment reminders</div>
                </div>
                <Switch 
                  checked={notifications.sms.moveInReminders}
                  onCheckedChange={(checked) => handleSmsChange('moveInReminders', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Important Updates</div>
                  <div className="text-sm text-gray-600">System updates and announcements</div>
                </div>
                <Switch 
                  checked={notifications.sms.importantUpdates}
                  onCheckedChange={(checked) => handleSmsChange('importantUpdates', checked)}
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
                  <div className="font-medium">New Messages</div>
                  <div className="text-sm text-gray-600">Instant message notifications</div>
                </div>
                <Switch 
                  checked={notifications.push.newMessages}
                  onCheckedChange={(checked) => handlePushChange('newMessages', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Task Reminders</div>
                  <div className="text-sm text-gray-600">Task and deadline reminders</div>
                </div>
                <Switch 
                  checked={notifications.push.taskReminders}
                  onCheckedChange={(checked) => handlePushChange('taskReminders', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Meeting Alerts</div>
                  <div className="text-sm text-gray-600">Meeting and appointment alerts</div>
                </div>
                <Switch 
                  checked={notifications.push.meetingAlerts}
                  onCheckedChange={(checked) => handlePushChange('meetingAlerts', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">System Updates</div>
                  <div className="text-sm text-gray-600">App updates and maintenance notices</div>
                </div>
                <Switch 
                  checked={notifications.push.systemUpdates}
                  onCheckedChange={(checked) => handlePushChange('systemUpdates', checked)}
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

export default NotificationSetup;
