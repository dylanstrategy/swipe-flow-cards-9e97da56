
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Edit, User, Mail, Phone, Home, CheckCircle, CreditCard, Building2, Bell, Eye, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useResident } from '@/contexts/ResidentContext';

interface ResidentIdentitySetupProps {
  onBack: () => void;
}

const ResidentIdentitySetup: React.FC<ResidentIdentitySetupProps> = ({ onBack }) => {
  const { toast } = useToast();
  const { profile, updateProfile } = useResident();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    preferredName: profile.preferredName,
    email: profile.email,
    phone: profile.phone,
    emergencyContactName: profile.emergencyContact.name,
    emergencyContactPhone: profile.emergencyContact.phone,
    emergencyContactRelationship: profile.emergencyContact.relationship
  });

  // Payment and preferences state
  const [paymentPreferences, setPaymentPreferences] = useState({
    preferredMethod: 'ach',
    achAccountNumber: '****1234',
    achRoutingNumber: '021000021',
    creditCardLast4: '4567'
  });

  const [adPreferences, setAdPreferences] = useState({
    emailMarketing: true,
    smsMarketing: false,
    personalizedAds: true,
    communityUpdates: true
  });

  const handleSave = () => {
    // Update the profile in context
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
    
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your information has been saved successfully.",
      duration: 3000,
    });
    
    console.log('Profile updated with new data:', {
      fullName: formData.fullName,
      preferredName: formData.preferredName,
      email: formData.email,
      phone: formData.phone
    });
  };

  const handleCancel = () => {
    // Reset form data to current profile values
    setFormData({
      fullName: profile.fullName,
      preferredName: profile.preferredName,
      email: profile.email,
      phone: profile.phone,
      emergencyContactName: profile.emergencyContact.name,
      emergencyContactPhone: profile.emergencyContact.phone,
      emergencyContactRelationship: profile.emergencyContact.relationship
    });
    setIsEditing(false);
  };

  // Update form data when profile changes (in case it's updated elsewhere)
  React.useEffect(() => {
    setFormData({
      fullName: profile.fullName,
      preferredName: profile.preferredName,
      email: profile.email,
      phone: profile.phone,
      emergencyContactName: profile.emergencyContact.name,
      emergencyContactPhone: profile.emergencyContact.phone,
      emergencyContactRelationship: profile.emergencyContact.relationship
    });
  }, [profile]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Identity & Access</h1>
            <p className="text-sm text-gray-600">Manage your personal information, payment methods, and preferences</p>
          </div>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 flex-shrink-0">
                <AvatarFallback className="text-2xl font-bold bg-blue-600 text-white">
                  {formData.preferredName.charAt(0)}{formData.fullName.split(' ')[1]?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{formData.preferredName}</h2>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Home className="w-4 h-4" />
                  <span>The Meridian • Apt {profile.unitNumber}</span>
                </div>
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

        {/* Contact Information - Primary Section */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Phone className="w-5 h-5" />
              Primary Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="preferredName" className="text-sm font-medium text-gray-700 mb-2 block">
                Preferred Name *
              </Label>
              <Input
                id="preferredName"
                value={formData.preferredName}
                onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                disabled={!isEditing}
                placeholder="What you'd like to be called"
                className={isEditing ? "bg-white" : "bg-gray-100"}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                placeholder="your.email@example.com"
                className={isEditing ? "bg-white" : "bg-gray-100"}
              />
              <p className="text-xs text-gray-600 mt-1">
                Used for notifications and important updates
              </p>
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                Cell Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="(555) 123-4567"
                className={isEditing ? "bg-white" : "bg-gray-100"}
              />
              <p className="text-xs text-gray-600 mt-1">
                Used for urgent notifications and two-factor authentication
              </p>
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
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 block">
                Full Legal Name
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!isEditing}
                placeholder="Your full legal name"
                className={isEditing ? "bg-white" : "bg-gray-100"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
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
                  placeholder="Emergency contact name"
                  className={isEditing ? "bg-white" : "bg-gray-100"}
                />
              </div>
              
              <div>
                <Label htmlFor="emergencyRelationship" className="text-sm font-medium text-gray-700 mb-2 block">
                  Relationship
                </Label>
                <Input
                  id="emergencyRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                  disabled={!isEditing}
                  placeholder="e.g., Spouse, Parent, Sibling"
                  className={isEditing ? "bg-white" : "bg-gray-100"}
                />
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
                placeholder="(555) 987-6543"
                className={isEditing ? "bg-white" : "bg-gray-100"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ACH Bank Transfer */}
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">ACH Bank Transfer</div>
                    <div className="text-sm text-green-700">Account ending in {paymentPreferences.achAccountNumber.slice(-4)}</div>
                  </div>
                </div>
                <div className="bg-green-600 text-white text-xs px-2 py-1 rounded">Primary</div>
              </div>
              <div className="text-sm text-green-800">
                Routing: {paymentPreferences.achRoutingNumber} • No fees • Auto-pay enabled
              </div>
            </div>

            {/* Credit Card */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Credit Card</div>
                    <div className="text-sm text-gray-600">Visa ending in {paymentPreferences.creditCardLast4}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="text-sm text-gray-600">
                Backup payment method • 2.9% processing fee
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Advertisement Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Advertisement Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">Email Marketing</div>
                <div className="text-sm text-gray-600">Receive promotional emails and updates</div>
              </div>
              <Switch 
                checked={adPreferences.emailMarketing}
                onCheckedChange={(checked) => setAdPreferences({ ...adPreferences, emailMarketing: checked })}
              />
            </div>
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">SMS Marketing</div>
                <div className="text-sm text-gray-600">Receive promotional text messages</div>
              </div>
              <Switch 
                checked={adPreferences.smsMarketing}
                onCheckedChange={(checked) => setAdPreferences({ ...adPreferences, smsMarketing: checked })}
              />
            </div>
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">Personalized Ads</div>
                <div className="text-sm text-gray-600">Show ads based on your preferences</div>
              </div>
              <Switch 
                checked={adPreferences.personalizedAds}
                onCheckedChange={(checked) => setAdPreferences({ ...adPreferences, personalizedAds: checked })}
              />
            </div>
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">Community Updates</div>
                <div className="text-sm text-gray-600">Receive updates about community events and news</div>
              </div>
              <Switch 
                checked={adPreferences.communityUpdates}
                onCheckedChange={(checked) => setAdPreferences({ ...adPreferences, communityUpdates: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Privacy & Security</h3>
                <p className="text-sm text-blue-800">
                  Your personal information is securely stored and only used for property management, 
                  emergency situations, and service delivery. We never share your information with 
                  third parties without your consent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResidentIdentitySetup;
