
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Save, Edit, User, Mail, Phone, Home } from 'lucide-react';

interface ResidentProfile {
  id: string;
  fullName: string;
  preferredName: string;
  email: string;
  phone: string;
  unitNumber: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface ResidentIdentitySetupProps {
  onBack: () => void;
}

const ResidentIdentitySetup: React.FC<ResidentIdentitySetupProps> = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock resident data - in real app this would come from context/API
  const [profile, setProfile] = useState<ResidentProfile>({
    id: '1',
    fullName: 'John Doe',
    preferredName: 'John',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    unitNumber: '204',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    }
  });

  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    preferredName: profile.preferredName,
    email: profile.email,
    phone: profile.phone,
    emergencyContactName: profile.emergencyContact.name,
    emergencyContactPhone: profile.emergencyContact.phone,
    emergencyContactRelationship: profile.emergencyContact.relationship
  });

  const handleSave = () => {
    const updatedProfile: ResidentProfile = {
      ...profile,
      fullName: formData.fullName,
      preferredName: formData.preferredName,
      email: formData.email,
      phone: formData.phone,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelationship
      }
    };
    
    setProfile(updatedProfile);
    setIsEditing(false);
    console.log('Profile updated:', updatedProfile);
  };

  const handleCancel = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Identity Setup</h1>
            <p className="text-sm text-gray-600">Manage your personal information and preferences</p>
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
                  placeholder="Your full legal name"
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
                  placeholder="What you'd like to be called"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                placeholder="your.email@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for notifications and important updates
              </p>
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                Cell Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="(555) 123-4567"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for urgent notifications and two-factor authentication
              </p>
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
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Privacy Notice</h3>
            <p className="text-sm text-blue-800">
              Your personal information is securely stored and only used for property management, 
              emergency situations, and service delivery. We never share your information with 
              third parties without your consent.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResidentIdentitySetup;
