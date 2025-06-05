import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, User, Phone, Mail, MapPin, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useResident } from '@/contexts/ResidentContext';
import { getFullName } from '@/utils/nameUtils';

interface ResidentIdentitySetupProps {
  onBack: () => void;
}

interface ExtendedResidentProfile {
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;
  unitNumber: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  dateOfBirth: string;
  occupation: string;
  moveInDate: string;
  preferences: {
    notifications: boolean;
    newsletters: boolean;
    events: boolean;
  };
}

const ResidentIdentitySetup: React.FC<ResidentIdentitySetupProps> = ({ onBack }) => {
  const { profile, updateProfile } = useResident();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ExtendedResidentProfile>({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    preferredName: profile.preferredName,
    email: profile.email,
    phone: profile.phone,
    unitNumber: profile.unitNumber,
    emergencyContact: {
      name: profile.emergencyContact?.name || '',
      phone: profile.emergencyContact?.phone || '',
      relationship: profile.emergencyContact?.relationship || ''
    },
    dateOfBirth: '',
    occupation: '',
    moveInDate: '',
    preferences: {
      notifications: true,
      newsletters: false,
      events: true
    }
  });

  // Privacy settings state (synced with ResidentPrivacySetup)
  const [privacySettings, setPrivacySettings] = useState({
    analyticsTracking: true,
    marketingEmails: false,
    locationTracking: false
  });

  // Load privacy settings and sync with other components
  useEffect(() => {
    const loadPrivacySettings = () => {
      const saved = localStorage.getItem('residentPrivacy');
      console.log('Loading privacy settings in IdentitySetup:', saved);
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          setPrivacySettings({
            analyticsTracking: parsedData.analyticsTracking ?? true,
            marketingEmails: parsedData.marketingEmails ?? false,
            locationTracking: parsedData.locationTracking ?? false
          });
        } catch (error) {
          console.error('Error loading privacy settings:', error);
        }
      }
    };

    loadPrivacySettings();

    // Listen for privacy settings changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'residentPrivacy' && e.newValue) {
        try {
          const parsedData = JSON.parse(e.newValue);
          setPrivacySettings({
            analyticsTracking: parsedData.analyticsTracking ?? true,
            marketingEmails: parsedData.marketingEmails ?? false,
            locationTracking: parsedData.locationTracking ?? false
          });
        } catch (error) {
          console.error('Error parsing privacy settings change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSave = () => {
    try {
      // Update resident profile
      updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: getFullName(formData.firstName, formData.lastName),
        preferredName: formData.preferredName,
        email: formData.email,
        phone: formData.phone,
        unitNumber: formData.unitNumber,
        emergencyContact: formData.emergencyContact
      });

      // Save extended profile data
      localStorage.setItem('residentProfile', JSON.stringify(formData));
      
      // Show success toast
      toast({
        title: "✅ Profile Updated",
        description: "Your personal information has been saved successfully.",
        duration: 4000,
      });
      
      console.log('Resident profile saved successfully:', formData);
    } catch (error) {
      console.error('Error saving resident profile:', error);
      toast({
        title: "❌ Save Failed",
        description: "Failed to save profile. Please try again.",
        duration: 4000,
      });
    }
  };

  const handlePrivacyToggle = (key: keyof typeof privacySettings, value: boolean) => {
    console.log(`Identity Setup: Toggling ${key} to ${value}`);
    
    // Update local state
    const newPrivacySettings = { ...privacySettings, [key]: value };
    setPrivacySettings(newPrivacySettings);
    
    // Update the full privacy data in localStorage
    const existingPrivacyData = localStorage.getItem('residentPrivacy');
    let fullPrivacyData = {
      dataSharing: 'none',
      marketingEmails: false,
      analyticsTracking: true,
      locationTracking: false,
      profileVisibility: 'private',
      shareContactInfo: false,
      allowDirectMessages: true
    };
    
    if (existingPrivacyData) {
      try {
        fullPrivacyData = JSON.parse(existingPrivacyData);
      } catch (error) {
        console.error('Error parsing existing privacy data:', error);
      }
    }
    
    // Update the specific privacy setting
    fullPrivacyData[key] = value;
    
    // Save to localStorage
    localStorage.setItem('residentPrivacy', JSON.stringify(fullPrivacyData));
    console.log('Privacy data updated from Identity Setup:', fullPrivacyData);
    
    // Trigger storage event for other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'residentPrivacy',
      newValue: JSON.stringify(fullPrivacyData),
      oldValue: existingPrivacyData
    }));
  };

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('residentProfile');
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        setFormData(savedData);
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  }, []);

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Identity Setup</h2>
            <p className="text-sm text-gray-600">Manage your personal information and preferences</p>
          </div>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="preferredName">Preferred Name</Label>
              <Input
                id="preferredName"
                value={formData.preferredName}
                onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unitNumber">Unit Number</Label>
                <Input
                  id="unitNumber"
                  value={formData.unitNumber}
                  onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyContact.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                  })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="emergencyRelationship">Relationship</Label>
              <Select 
                value={formData.emergencyContact.relationship}
                onValueChange={(value) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, relationship: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Personalized Ads / Analytics</div>
                <div className="text-sm text-gray-600">Allow personalized advertising and analytics tracking</div>
              </div>
              <Switch 
                checked={privacySettings.analyticsTracking}
                onCheckedChange={(checked) => handlePrivacyToggle('analyticsTracking', checked)}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Marketing Emails</div>
                <div className="text-sm text-gray-600">Receive promotional emails and newsletters</div>
              </div>
              <Switch 
                checked={privacySettings.marketingEmails}
                onCheckedChange={(checked) => handlePrivacyToggle('marketingEmails', checked)}
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
                onCheckedChange={(checked) => handlePrivacyToggle('locationTracking', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default ResidentIdentitySetup;
