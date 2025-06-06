
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Eye, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useSettings } from '@/hooks/useSettings';

interface ResidentPrivacySetupProps {
  onBack: () => void;
}

const ResidentPrivacySetup: React.FC<ResidentPrivacySetupProps> = ({ onBack }) => {
  const { toast } = useToast();
  const { settings: privacyData, saveSettings, loading } = useSettings('privacy');
  
  // Default privacy settings
  const defaultSettings = {
    dataSharing: 'none',
    marketingEmails: false,
    analyticsTracking: true,
    locationTracking: false,
    profileVisibility: 'private',
    shareContactInfo: false,
    allowDirectMessages: true,
    // Advertisement preferences
    personalizedAds: false,
    localBusinessAds: false,
    propertyServicesAds: true,
    // Security preferences
    twoFactorAuth: false,
    loginNotifications: true
  };

  const [currentSettings, setCurrentSettings] = useState(defaultSettings);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  // Update local state when settings load
  useEffect(() => {
    if (!loading) {
      setCurrentSettings({ ...defaultSettings, ...privacyData });
    }
  }, [privacyData, loading]);

  const handleToggleChange = async (key: keyof typeof currentSettings, value: boolean) => {
    console.log(`Toggling ${key} to ${value}`);
    const newData = { ...currentSettings, [key]: value };
    
    // Update local state immediately for instant UI feedback
    setCurrentSettings(newData);
    
    // Save to storage/database
    try {
      await saveSettings(newData);
      console.log(`Successfully saved ${key} setting:`, value);
    } catch (error) {
      console.error(`Error saving ${key} setting:`, error);
      // Revert the local state if save failed
      setCurrentSettings(currentSettings);
      toast({
        title: "Save Failed",
        description: `Failed to save ${key} setting. Please try again.`,
        duration: 3000,
      });
    }
  };

  const handleSelectChange = async (key: keyof typeof currentSettings, value: string) => {
    console.log(`Changing ${key} to ${value}`);
    const newData = { ...currentSettings, [key]: value };
    
    // Update local state immediately
    setCurrentSettings(newData);
    
    // Save to storage/database
    try {
      await saveSettings(newData);
      console.log(`Successfully saved ${key} setting:`, value);
    } catch (error) {
      console.error(`Error saving ${key} setting:`, error);
      // Revert the local state if save failed
      setCurrentSettings(currentSettings);
      toast({
        title: "Save Failed",
        description: `Failed to save ${key} setting. Please try again.`,
        duration: 3000,
      });
    }
  };

  const handleSave = async () => {
    try {
      await saveSettings(currentSettings);
      
      toast({
        title: "✅ Privacy Settings Updated",
        description: "Your privacy preferences have been saved successfully.",
        duration: 4000,
      });
      
      console.log('Resident privacy settings saved successfully:', currentSettings);
    } catch (error) {
      console.error('Error saving resident privacy settings:', error);
      toast({
        title: "❌ Save Failed",
        description: "Failed to save privacy settings. Please try again.",
        duration: 4000,
      });
    }
  };

  const handleSetupTwoFactor = () => {
    toast({
      title: "Two-Factor Authentication",
      description: "Two-factor authentication setup will be available soon.",
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading privacy settings...</div>
      </div>
    );
  }

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

        {/* Privacy Notice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Privacy Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Your Privacy Matters</h4>
              <p className="text-sm text-blue-800 mb-3">
                We are committed to protecting your privacy and being transparent about how we use your data. 
                Your personal information is used to provide property management services and improve your living experience.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPrivacyNotice(!showPrivacyNotice)}
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                {showPrivacyNotice ? 'Hide' : 'View'} Full Privacy Policy
              </Button>
              
              {showPrivacyNotice && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="text-sm text-blue-800 space-y-2">
                    <p><strong>Data Collection:</strong> We collect information necessary for property management, maintenance, and communication.</p>
                    <p><strong>Data Usage:</strong> Your data is used to provide services, process payments, and maintain property security.</p>
                    <p><strong>Data Sharing:</strong> We do not sell your personal information. Data is only shared with service providers as necessary.</p>
                    <p><strong>Your Rights:</strong> You can request access, correction, or deletion of your personal data at any time.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Advertisement Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Advertisement Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Personalized Ads</div>
                  <div className="text-sm text-gray-600">Show ads tailored to your interests and preferences</div>
                </div>
                <Switch 
                  checked={currentSettings.personalizedAds}
                  onCheckedChange={(checked) => handleToggleChange('personalizedAds', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Local Business Ads</div>
                  <div className="text-sm text-gray-600">Receive advertisements from local businesses and services</div>
                </div>
                <Switch 
                  checked={currentSettings.localBusinessAds}
                  onCheckedChange={(checked) => handleToggleChange('localBusinessAds', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Property Services Ads</div>
                  <div className="text-sm text-gray-600">Show ads for property amenities and preferred service providers</div>
                </div>
                <Switch 
                  checked={currentSettings.propertyServicesAds}
                  onCheckedChange={(checked) => handleToggleChange('propertyServicesAds', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={currentSettings.twoFactorAuth}
                    onCheckedChange={(checked) => handleToggleChange('twoFactorAuth', checked)}
                  />
                  {!currentSettings.twoFactorAuth && (
                    <Button variant="outline" size="sm" onClick={handleSetupTwoFactor}>
                      <Lock className="w-4 h-4 mr-1" />
                      Setup
                    </Button>
                  )}
                </div>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Login Notifications</div>
                  <div className="text-sm text-gray-600">Get notified when someone signs into your account</div>
                </div>
                <Switch 
                  checked={currentSettings.loginNotifications}
                  onCheckedChange={(checked) => handleToggleChange('loginNotifications', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
                value={currentSettings.dataSharing} 
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
                  checked={currentSettings.marketingEmails}
                  onCheckedChange={(checked) => handleToggleChange('marketingEmails', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Analytics Tracking</div>
                  <div className="text-sm text-gray-600">Allow analytics to improve user experience</div>
                </div>
                <Switch 
                  checked={currentSettings.analyticsTracking}
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
                  checked={currentSettings.locationTracking}
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
                value={currentSettings.profileVisibility} 
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
                  checked={currentSettings.shareContactInfo}
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
                  checked={currentSettings.allowDirectMessages}
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
