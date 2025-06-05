
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Edit, User, Shield, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useResident } from '@/contexts/ResidentContext';

interface ResidentIdentitySetupProps {
  onBack: () => void;
}

const ResidentIdentitySetup: React.FC<ResidentIdentitySetupProps> = ({ onBack }) => {
  const { toast } = useToast();
  const { profile, updateProfile } = useResident();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    preferredName: profile.preferredName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    emergencyContactName: profile.emergencyContact?.name || '',
    emergencyContactPhone: profile.emergencyContact?.phone || '',
    emergencyContactRelationship: profile.emergencyContact?.relationship || 'Spouse',
    // Privacy preferences
    dataSharing: 'none',
    marketingEmails: false,
    analyticsTracking: true,
    locationTracking: false,
    // Notification preferences
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    maintenanceAlerts: true,
    rentReminders: true,
    communityUpdates: true
  });

  const handleSave = () => {
    try {
      setIsEditing(false);
      
      // Save to localStorage
      localStorage.setItem('residentIdentity', JSON.stringify(formData));
      
      // Update resident context with the correct structure
      updateProfile({
        fullName: formData.fullName,
        preferredName: formData.preferredName,
        email: formData.email,
        phone: formData.phone,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship
        }
      });
      
      // Show success toast
      toast({
        title: "✅ Profile Updated",
        description: "Your personal information and preferences have been saved successfully.",
        duration: 4000,
      });
      
      console.log('Resident identity saved successfully:', formData);
    } catch (error) {
      console.error('Error saving resident identity:', error);
      toast({
        title: "❌ Save Failed",
        description: "Failed to save your personal information. Please try again.",
        duration: 4000,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data from localStorage if available
    const saved = localStorage.getItem('residentIdentity');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  };

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('residentIdentity');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved resident identity:', error);
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
            <h2 className="text-xl font-bold text-gray-900">Identity & Profile Setup</h2>
            <p className="text-sm text-gray-600">Manage your personal information and preferences</p>
          </div>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 flex-shrink-0">
                <AvatarFallback className="text-xl font-bold bg-blue-600 text-white">
                  {formData.preferredName.charAt(0)}{formData.fullName.split(' ')[1]?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{formData.preferredName}</h2>
                <p className="text-gray-600 mb-2">Resident • Apt {profile.unitNumber}</p>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Full Legal Name
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? "bg-white" : "bg-gray-100"}
                />
              </div>
              
              <div>
                <Label htmlFor="preferredName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Preferred Name
                </Label>
                <Input
                  id="preferredName"
                  value={formData.preferredName}
                  onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? "bg-white" : "bg-gray-100"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? "bg-white" : "bg-gray-100"}
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? "bg-white" : "bg-gray-100"}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Contact Name
                </Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? "bg-white" : "bg-gray-100"}
                />
              </div>
              
              <div>
                <Label htmlFor="emergencyRelationship" className="text-sm font-medium text-gray-700 mb-2 block">
                  Relationship
                </Label>
                <Select 
                  value={formData.emergencyContactRelationship} 
                  onValueChange={(value) => setFormData({ ...formData, emergencyContactRelationship: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={isEditing ? "bg-white" : "bg-gray-100"}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Sibling">Sibling</SelectItem>
                    <SelectItem value="Child">Child</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="emergencyPhone" className="text-sm font-medium text-gray-700 mb-2 block">
                Contact Phone
              </Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                disabled={!isEditing}
                className={isEditing ? "bg-white" : "bg-gray-100"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Privacy & Data Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dataSharing" className="text-sm font-medium text-gray-700 mb-2 block">
                Data Sharing Preferences
              </Label>
              <Select 
                value={formData.dataSharing} 
                onValueChange={(value) => setFormData({ ...formData, dataSharing: value })}
                disabled={!isEditing}
              >
                <SelectTrigger className={isEditing ? "bg-white" : "bg-gray-100"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Data Sharing</SelectItem>
                  <SelectItem value="property">Property Management Only</SelectItem>
                  <SelectItem value="third-party">Allow Third-Party Partners</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Marketing Emails</div>
                  <div className="text-sm text-gray-600">Receive promotional and marketing communications</div>
                </div>
                <Switch 
                  checked={formData.marketingEmails}
                  onCheckedChange={(checked) => setFormData({ ...formData, marketingEmails: checked })}
                  disabled={!isEditing}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Analytics Tracking</div>
                  <div className="text-sm text-gray-600">Allow analytics to improve user experience</div>
                </div>
                <Switch 
                  checked={formData.analyticsTracking}
                  onCheckedChange={(checked) => setFormData({ ...formData, analyticsTracking: checked })}
                  disabled={!isEditing}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Location Tracking</div>
                  <div className="text-sm text-gray-600">Allow location services for enhanced features</div>
                </div>
                <Switch 
                  checked={formData.locationTracking}
                  onCheckedChange={(checked) => setFormData({ ...formData, locationTracking: checked })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-gray-600">Receive notifications via email</div>
                </div>
                <Switch 
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
                  disabled={!isEditing}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">SMS Notifications</div>
                  <div className="text-sm text-gray-600">Receive notifications via text message</div>
                </div>
                <Switch 
                  checked={formData.smsNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, smsNotifications: checked })}
                  disabled={!isEditing}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-gray-600">Receive push notifications on your device</div>
                </div>
                <Switch 
                  checked={formData.pushNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, pushNotifications: checked })}
                  disabled={!isEditing}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Maintenance Alerts</div>
                  <div className="text-sm text-gray-600">Notifications about maintenance and repairs</div>
                </div>
                <Switch 
                  checked={formData.maintenanceAlerts}
                  onCheckedChange={(checked) => setFormData({ ...formData, maintenanceAlerts: checked })}
                  disabled={!isEditing}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Rent Reminders</div>
                  <div className="text-sm text-gray-600">Monthly rent payment reminders</div>
                </div>
                <Switch 
                  checked={formData.rentReminders}
                  onCheckedChange={(checked) => setFormData({ ...formData, rentReminders: checked })}
                  disabled={!isEditing}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Community Updates</div>
                  <div className="text-sm text-gray-600">News and updates about your community</div>
                </div>
                <Switch 
                  checked={formData.communityUpdates}
                  onCheckedChange={(checked) => setFormData({ ...formData, communityUpdates: checked })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </>
  );
};

export default ResidentIdentitySetup;
