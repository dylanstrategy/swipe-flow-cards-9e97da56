
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Shield, Lock, Eye, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface PrivacySetupProps {
  onBack: () => void;
}

const PrivacySetup: React.FC<PrivacySetupProps> = ({ onBack }) => {
  const { toast } = useToast();
  
  const [privacySettings, setPrivacySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: '8',
    passwordExpiry: '90',
    dataSharing: false,
    analyticsTracking: true,
    activityLogging: true,
    autoLogout: true,
    deviceTrust: false,
    locationTracking: false,
    biometricAuth: false
  });

  const handleSave = () => {
    try {
      // Save to localStorage
      localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
      
      // Show success toast
      toast({
        title: "✅ Privacy Settings Updated",
        description: "Your security and privacy preferences have been saved successfully.",
        duration: 4000,
      });
      
      console.log('Privacy settings saved successfully:', privacySettings);
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast({
        title: "❌ Save Failed",
        description: "Failed to save privacy settings. Please try again.",
        duration: 4000,
      });
    }
  };

  const handleToggleChange = (key: keyof typeof privacySettings, checked: boolean) => {
    const newSettings = { ...privacySettings, [key]: checked };
    setPrivacySettings(newSettings);
    
    // Save immediately
    try {
      localStorage.setItem('privacySettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving privacy setting change:', error);
    }
  };

  const handleInputChange = (key: keyof typeof privacySettings, value: string) => {
    const newSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(newSettings);
    
    // Save immediately
    try {
      localStorage.setItem('privacySettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving privacy setting change:', error);
    }
  };

  // Load saved data on mount and listen for storage changes
  useEffect(() => {
    const loadPrivacyData = () => {
      const saved = localStorage.getItem('privacySettings');
      if (saved) {
        try {
          setPrivacySettings(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading saved privacy settings:', error);
        }
      }
    };

    loadPrivacyData();

    // Listen for localStorage changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'privacySettings') {
        loadPrivacyData();
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
            <h2 className="text-xl font-bold text-gray-900">Privacy & Security</h2>
            <p className="text-sm text-gray-600">Manage your security settings and data preferences</p>
          </div>
        </div>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
              </div>
              <Switch 
                checked={privacySettings.twoFactorAuth}
                onCheckedChange={(checked) => handleToggleChange('twoFactorAuth', checked)}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Biometric Authentication</div>
                <div className="text-sm text-gray-600">Use fingerprint or face recognition to login</div>
              </div>
              <Switch 
                checked={privacySettings.biometricAuth}
                onCheckedChange={(checked) => handleToggleChange('biometricAuth', checked)}
              />
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionTimeout" className="text-sm font-medium text-gray-700 mb-2 block">
                  Session Timeout (hours)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={privacySettings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                  placeholder="8"
                />
              </div>
              
              <div>
                <Label htmlFor="passwordExpiry" className="text-sm font-medium text-gray-700 mb-2 block">
                  Password Expiry (days)
                </Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={privacySettings.passwordExpiry}
                  onChange={(e) => handleInputChange('passwordExpiry', e.target.value)}
                  placeholder="90"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Session Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-Logout</div>
                <div className="text-sm text-gray-600">Automatically log out after inactivity</div>
              </div>
              <Switch 
                checked={privacySettings.autoLogout}
                onCheckedChange={(checked) => handleToggleChange('autoLogout', checked)}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Device Trust</div>
                <div className="text-sm text-gray-600">Remember trusted devices for faster login</div>
              </div>
              <Switch 
                checked={privacySettings.deviceTrust}
                onCheckedChange={(checked) => handleToggleChange('deviceTrust', checked)}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Activity Logging</div>
                <div className="text-sm text-gray-600">Log user activities for security monitoring</div>
              </div>
              <Switch 
                checked={privacySettings.activityLogging}
                onCheckedChange={(checked) => handleToggleChange('activityLogging', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Data Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Data Sharing</div>
                <div className="text-sm text-gray-600">Share anonymized data for product improvement</div>
              </div>
              <Switch 
                checked={privacySettings.dataSharing}
                onCheckedChange={(checked) => handleToggleChange('dataSharing', checked)}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Analytics Tracking</div>
                <div className="text-sm text-gray-600">Allow analytics to improve user experience</div>
              </div>
              <Switch 
                checked={privacySettings.analyticsTracking}
                onCheckedChange={(checked) => handleToggleChange('analyticsTracking', checked)}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Location Tracking</div>
                <div className="text-sm text-gray-600">Allow location services for enhanced features</div>
              </div>
              <Switch 
                checked={privacySettings.locationTracking}
                onCheckedChange={(checked) => handleToggleChange('locationTracking', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Password Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Password Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Download Security Report
            </Button>
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
              Revoke All Sessions
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default PrivacySetup;
