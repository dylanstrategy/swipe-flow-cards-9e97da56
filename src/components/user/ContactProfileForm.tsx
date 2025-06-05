
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserProfile, ContactInfo } from '@/types/users';
import { User, Phone, Mail, AlertCircle, Save, X } from 'lucide-react';

interface ContactProfileFormProps {
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const ContactProfileForm: React.FC<ContactProfileFormProps> = ({
  userProfile,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    firstName: userProfile.first_name,
    lastName: userProfile.last_name,
    email: userProfile.email,
    phone: userProfile.phone,
    emergencyContactName: userProfile.contactInfo.emergencyContact?.name || '',
    emergencyContactPhone: userProfile.contactInfo.emergencyContact?.phone || '',
    emergencyContactRelationship: userProfile.contactInfo.emergencyContact?.relationship || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProfile: UserProfile = {
      ...userProfile,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      contactInfo: {
        ...userProfile.contactInfo,
        email: formData.email,
        phone: formData.phone,
        emergencyContact: formData.emergencyContactName ? {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship
        } : undefined
      }
    };

    onSave(updatedProfile);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      resident: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-orange-100 text-orange-800',
      operator: 'bg-purple-100 text-purple-800',
      leasing: 'bg-green-100 text-green-800',
      management: 'bg-red-100 text-red-800',
      prospect: 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const fullName = `${formData.firstName} ${formData.lastName}`;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg font-semibold">
                {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{isEditing ? 'Edit Contact Profile' : 'Contact Profile'}</CardTitle>
              <Badge className={getRoleColor(userProfile.role)}>
                {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
              </Badge>
            </div>
          </div>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Emergency Contact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Emergency contact name"
                />
              </div>
              
              <div>
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Emergency contact phone"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="emergencyRelationship">Relationship</Label>
              <Input
                id="emergencyRelationship"
                value={formData.emergencyContactRelationship}
                onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                disabled={!isEditing}
                placeholder="e.g., Spouse, Parent, Sibling"
              />
            </div>
          </div>

          {/* Contact Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Preferences</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Push Notifications Enabled</span>
              </div>
              <p className="text-sm text-gray-600">
                You'll receive notifications for work orders, messages, and important updates at {formData.email}
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="font-medium">SMS Notifications Enabled</span>
              </div>
              <p className="text-sm text-gray-600">
                You'll receive urgent notifications via SMS at {formData.phone}
              </p>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactProfileForm;
