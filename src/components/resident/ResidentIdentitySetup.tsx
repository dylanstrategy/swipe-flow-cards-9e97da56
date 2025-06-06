
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, User, Phone, Mail, MapPin, Calendar, Heart, Clock, Globe } from 'lucide-react';
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

interface SchedulingPreferences {
  workStartTime: string;
  workEndTime: string;
  timeZone: string;
  lunchBreakStart: string;
  lunchBreakEnd: string;
  enableLunchBreak: boolean;
  workDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  autoScheduling: boolean;
  bufferTime: string;
  maxDailyAppointments: string;
  defaultMeetingDuration: string;
  allowExternalCalendars: boolean;
  externalCalendarConnections: {
    google: boolean;
    outlook: boolean;
    apple: boolean;
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

  const [scheduleData, setScheduleData] = useState<SchedulingPreferences>({
    workStartTime: '09:00',
    workEndTime: '17:00',
    timeZone: 'America/New_York',
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
    enableLunchBreak: true,
    workDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    autoScheduling: true,
    bufferTime: '10',
    maxDailyAppointments: '8',
    defaultMeetingDuration: '30',
    allowExternalCalendars: true,
    externalCalendarConnections: {
      google: false,
      outlook: false,
      apple: false
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

  // Load saved data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('residentProfile');
    if (savedProfile) {
      try {
        const savedData = JSON.parse(savedProfile);
        setFormData(savedData);
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }

    const savedSchedule = localStorage.getItem('residentSchedulingPreferences');
    if (savedSchedule) {
      try {
        setScheduleData(JSON.parse(savedSchedule));
      } catch (error) {
        console.error('Error loading saved scheduling preferences:', error);
      }
    }
  }, []);

  const handleSave = () => {
    try {
      // Update resident profile
      updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        preferredName: formData.preferredName,
        email: formData.email,
        phone: formData.phone,
        unitNumber: formData.unitNumber,
        emergencyContact: formData.emergencyContact
      });

      // Save extended profile data
      localStorage.setItem('residentProfile', JSON.stringify(formData));
      
      // Save scheduling preferences
      localStorage.setItem('residentSchedulingPreferences', JSON.stringify(scheduleData));
      
      // Show success toast
      toast({
        title: "✅ Profile Updated",
        description: "Your personal information and preferences have been saved successfully.",
        duration: 4000,
      });
      
      console.log('Resident profile and scheduling preferences saved successfully:', { formData, scheduleData });
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

  const handleWorkDayChange = (day: keyof typeof scheduleData.workDays, checked: boolean) => {
    setScheduleData({
      ...scheduleData,
      workDays: {
        ...scheduleData.workDays,
        [day]: checked
      }
    });
  };

  const handleExternalCalendarToggle = (calendar: keyof typeof scheduleData.externalCalendarConnections, checked: boolean) => {
    setScheduleData({
      ...scheduleData,
      externalCalendarConnections: {
        ...scheduleData.externalCalendarConnections,
        [calendar]: checked
      }
    });
  };

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

        {/* Scheduling Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Scheduling Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Available Hours */}
            <div>
              <h4 className="font-medium mb-3">Available Hours</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workStart" className="text-sm font-medium text-gray-700 mb-2 block">
                    Start Time
                  </Label>
                  <Input
                    id="workStart"
                    type="time"
                    value={scheduleData.workStartTime}
                    onChange={(e) => setScheduleData({ ...scheduleData, workStartTime: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="workEnd" className="text-sm font-medium text-gray-700 mb-2 block">
                    End Time
                  </Label>
                  <Input
                    id="workEnd"
                    type="time"
                    value={scheduleData.workEndTime}
                    onChange={(e) => setScheduleData({ ...scheduleData, workEndTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="timeZone" className="text-sm font-medium text-gray-700 mb-2 block">
                  Time Zone
                </Label>
                <select 
                  id="timeZone"
                  value={scheduleData.timeZone}
                  onChange={(e) => setScheduleData({ ...scheduleData, timeZone: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>
            </div>

            <Separator />

            {/* Available Days */}
            <div>
              <h4 className="font-medium mb-3">Available Days</h4>
              <div className="space-y-3">
                {Object.entries(scheduleData.workDays).map(([day, isEnabled]) => (
                  <div key={day}>
                    <div className="flex items-center justify-between">
                      <div className="font-medium capitalize">{day}</div>
                      <Switch 
                        checked={isEnabled}
                        onCheckedChange={(checked) => handleWorkDayChange(day as keyof typeof scheduleData.workDays, checked)}
                      />
                    </div>
                    {day !== 'sunday' && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Meeting Settings */}
            <div>
              <h4 className="font-medium mb-3">Meeting Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultMeetingDuration" className="text-sm font-medium text-gray-700 mb-2 block">
                    Default Meeting Duration (minutes)
                  </Label>
                  <Input
                    id="defaultMeetingDuration"
                    type="number"
                    value={scheduleData.defaultMeetingDuration}
                    onChange={(e) => setScheduleData({ ...scheduleData, defaultMeetingDuration: e.target.value })}
                    placeholder="30"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bufferTime" className="text-sm font-medium text-gray-700 mb-2 block">
                    Buffer Time Between Meetings (minutes)
                  </Label>
                  <Input
                    id="bufferTime"
                    type="number"
                    value={scheduleData.bufferTime}
                    onChange={(e) => setScheduleData({ ...scheduleData, bufferTime: e.target.value })}
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="maxAppointments" className="text-sm font-medium text-gray-700 mb-2 block">
                  Max Daily Appointments
                </Label>
                <Input
                  id="maxAppointments"
                  type="number"
                  value={scheduleData.maxDailyAppointments}
                  onChange={(e) => setScheduleData({ ...scheduleData, maxDailyAppointments: e.target.value })}
                  placeholder="8"
                />
              </div>
            </div>

            <Separator />

            {/* External Calendar Integration */}
            <div>
              <h4 className="font-medium mb-3">External Calendar Integration</h4>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-medium">Allow External Calendar Connections</div>
                  <div className="text-sm text-gray-600">Enable integration with external calendar services</div>
                </div>
                <Switch 
                  checked={scheduleData.allowExternalCalendars}
                  onCheckedChange={(checked) => setScheduleData({ ...scheduleData, allowExternalCalendars: checked })}
                />
              </div>

              {scheduleData.allowExternalCalendars && (
                <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Google Calendar</span>
                    </div>
                    <Switch 
                      checked={scheduleData.externalCalendarConnections.google}
                      onCheckedChange={(checked) => handleExternalCalendarToggle('google', checked)}
                    />
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Outlook Calendar</span>
                    </div>
                    <Switch 
                      checked={scheduleData.externalCalendarConnections.outlook}
                      onCheckedChange={(checked) => handleExternalCalendarToggle('outlook', checked)}
                    />
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Apple Calendar</span>
                    </div>
                    <Switch 
                      checked={scheduleData.externalCalendarConnections.apple}
                      onCheckedChange={(checked) => handleExternalCalendarToggle('apple', checked)}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Auto-Scheduling */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-Scheduling</div>
                <div className="text-sm text-gray-600">Automatically suggest optimal time slots for appointments</div>
              </div>
              <Switch 
                checked={scheduleData.autoScheduling}
                onCheckedChange={(checked) => setScheduleData({ ...scheduleData, autoScheduling: checked })}
              />
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
