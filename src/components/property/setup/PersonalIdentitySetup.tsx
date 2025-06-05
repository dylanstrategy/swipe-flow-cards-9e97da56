
import React, { useState } from 'react';
import { ChevronLeft, Save, Edit, User, Mail, Phone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface PersonalIdentitySetupProps {
  onBack: () => void;
}

const PersonalIdentitySetup: React.FC<PersonalIdentitySetupProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: 'John Smith',
    preferredName: 'John',
    email: 'john.smith@meridian.com',
    phone: '(555) 123-4567',
    jobTitle: 'Senior Property Manager',
    department: 'Operations',
    emergencyContactName: 'Jane Smith',
    emergencyContactPhone: '(555) 987-6543',
    emergencyContactRelationship: 'Spouse'
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Identity Updated",
      description: "Your personal information has been saved successfully.",
    });
    console.log('Identity updated:', formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Identity & Profile Setup</h2>
          <p className="text-sm text-gray-600">Manage your personal information and contact details</p>
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
              <p className="text-gray-600 mb-2">{formData.jobTitle} • {formData.department}</p>
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

      {/* Contact Information */}
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
              <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700 mb-2 block">
                Job Title
              </Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                disabled={!isEditing}
                className={isEditing ? "bg-white" : "bg-gray-100"}
              />
            </div>
            
            <div>
              <Label htmlFor="department" className="text-sm font-medium text-gray-700 mb-2 block">
                Department
              </Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
              <Input
                id="emergencyRelationship"
                value={formData.emergencyContactRelationship}
                onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                disabled={!isEditing}
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
              className={isEditing ? "bg-white" : "bg-gray-100"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalIdentitySetup;
