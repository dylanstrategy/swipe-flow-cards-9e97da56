
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Eye, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface ResidentPrivacySetupProps {
  onBack: () => void;
}

const ResidentPrivacySetup: React.FC<ResidentPrivacySetupProps> = ({ onBack }) => {
  const { toast } = useToast();
  
  const [privacyData, setPrivacyData] = useState({
    dataSharing: 'none',
    marketingEmails: false,
    analyticsTracking: true,
    locationTracking: false,
    profileVisibility: 'private',
    shareContactInfo: false,
    allowDirectMessages: true
  });

  // Function to save data immediately and trigger storage event
  const savePrivacyData = (newData: typeof privacyData) => {
    try {
      localStorage.setItem('residentPrivacy', JSON.stringify(newData));
      console.log('Privacy data saved:', newData);
      // Trigger storage event for other components to sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'residentPrivacy',
        newValue: JSON.stringify(newData),
        oldValue: localStorage.getItem('residentPrivacy')
      }));
    } catch (error) {
      console.error('Error saving privacy data:', error);
    }
  };

  const handleToggleChange = (key: keyof typeof privacyData, value: boolean) => {
    console.log(`Toggling ${key} to ${value}`);
    const newData = { ...privacyData, [key]: value };
    setPrivacyData(newData);
    savePrivacyData(newData);
  };

  const handleSelectChange = (key: keyof typeof privacyData, value: string) => {
    console.log(`Changing ${key} to ${value}`);
    const newData = { ...privacyData, [key]: value };
    setPrivacyData(newData);
    savePrivacyData(newData);
  };

  const handleSave = () => {
    try {
      savePrivacyData(privacyData);
      
      // Show success toast
      toast({
        title: "✅ Privacy Settings Updated",
        description: "Your privacy preferences have been saved successfully.",
        duration: 4000,
      });
      
      console.log('Resident privacy settings saved successfully:', privacyData);
    } catch (error) {
      console.error('Error saving resident privacy settings:', error);
      toast({
        title: "❌ Save Failed",
        description: "Failed to save privacy settings. Please try again.",
        duration: 4000,
      });
    }
  };

  // Load saved data on mount and listen for storage changes
  useEffect(() => {
    const loadPrivacyData = () => {
      const saved = localStorage.getItem('residentPrivacy');
      console.log('Loading privacy data:', saved);
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          console.log('Parsed privacy data:', parsedData);
          setPrivacyData(parsedData);
        } catch (error) {
          console.error('Error loading saved resident privacy settings:', error);
        }
      }
    };

    loadPrivacyData();

    // Listen for localStorage changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      console.log('Storage change detected:', e.key, e.newValue);
      if (e.key === 'residentPrivacy' && e.newValue) {
        try {
          const parsedData = JSON.parse(e.newValue);
          setPrivacyData(parsedData);
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
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
            <p className="text-sm text-gray-600">Manage your privacy settings and data preferences</p>
          </div>
        </div>

        {/* Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Data Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Data Sharing Preferences
              </label>
              <Select 
                value={privacyData.dataSharing} 
                onValueChange={(value) => handleSelectChange('dataSharing', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Data Sharing</SelectItem>
                  <SelectItem value="property">Property Management Only</SelectItem>
                  <SelectItem value="third-party">Allow Third-Party Partners</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Choose how your data can be shared with external services
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Marketing Emails</div>
                  <div className="text-sm text-gray-600">Receive promotional and marketing communications</div>
                </div>
                <Switch 
                  checked={privacyData.marketingEmails}
                  onCheckedChange={(checked) => handleToggleChange('marketingEmails', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Personalized Ads / Analytics Tracking</div>
                  <div className="text-sm text-gray-600">Allow analytics and personalized advertising</div>
                </div>
                <Switch 
                  checked={privacyData.analyticsTracking}
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
                  checked={privacyData.locationTracking}
                  onCheckedChange={(checked) => handleToggleChange('locationTracking', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Profile Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Profile Visibility
              </label>
              <Select 
                value={privacyData.profileVisibility} 
                onValueChange={(value) => handleSelectChange('profileVisibility', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="residents">Residents Only</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Share Contact Information</div>
                  <div className="text-sm text-gray-600">Allow other residents to see your contact info</div>
                </div>
                <Switch 
                  checked={privacyData.shareContactInfo}
                  onCheckedChange={(checked) => handleToggleChange('shareContactInfo', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Allow Direct Messages</div>
                  <div className="text-sm text-gray-600">Let other residents send you direct messages</div>
                </div>
                <Switch 
                  checked={privacyData.allowDirectMessages}
                  onCheckedChange={(checked) => handleToggleChange('allowDirectMessages', checked)}
                />
              </div>
            </div>
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

export default ResidentPrivacySetup;
