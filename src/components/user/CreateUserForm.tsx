
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserRole, Permission, ROLE_PERMISSIONS, CreateUserRequest } from '@/types/users';
import { ArrowLeft, User, Mail, Phone, Shield, Send } from 'lucide-react';

interface CreateUserFormProps {
  onSubmit: (userData: CreateUserRequest) => void;
  onCancel: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'maintenance' as UserRole,
    customPermissions: [] as string[],
    sendWelcomeEmail: true
  });

  const handleRoleChange = (role: UserRole) => {
    setFormData({
      ...formData,
      role,
      customPermissions: [] // Reset custom permissions when role changes
    });
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        customPermissions: [...formData.customPermissions, permissionId]
      });
    } else {
      setFormData({
        ...formData,
        customPermissions: formData.customPermissions.filter(id => id !== permissionId)
      });
    }
  };

  const getSelectedPermissions = (): Permission[] => {
    const rolePermissions = ROLE_PERMISSIONS[formData.role] || [];
    const customPermissions = Object.values(ROLE_PERMISSIONS)
      .flat()
      .filter(p => formData.customPermissions.includes(p.id));
    
    // Combine and deduplicate
    const allPermissions = [...rolePermissions, ...customPermissions];
    return allPermissions.filter((permission, index, array) =>
      array.findIndex(p => p.id === permission.id) === index
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalPermissions = formData.customPermissions.length > 0 
      ? formData.customPermissions 
      : ROLE_PERMISSIONS[formData.role].map(p => p.id);

    const userData: CreateUserRequest = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      permissions: finalPermissions,
      sendWelcomeEmail: formData.sendWelcomeEmail
    };

    onSubmit(userData);
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      resident: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-orange-100 text-orange-800',
      operator: 'bg-purple-100 text-purple-800',
      leasing: 'bg-green-100 text-green-800',
      management: 'bg-red-100 text-red-800',
      prospect: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const allAvailablePermissions = Object.values(ROLE_PERMISSIONS).flat()
    .filter((permission, index, array) =>
      array.findIndex(p => p.id === permission.id) === index
    );

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={onCancel}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <CardTitle className="text-xl">Create New User</CardTitle>
                  <p className="text-sm text-gray-600">Add a new team member to the system</p>
                </div>
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
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@meridian.com"
                      required
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Role & Permissions
                  </h3>
                  
                  <div>
                    <Label>Select Role</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {(Object.keys(ROLE_PERMISSIONS) as UserRole[]).filter(role => role !== 'resident' && role !== 'prospect').map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleRoleChange(role)}
                          className={`p-3 border rounded-lg text-left transition-colors ${
                            formData.role === role
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Badge className={getRoleColor(role)} size="sm">
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </Badge>
                          <div className="text-xs text-gray-600 mt-1">
                            {ROLE_PERMISSIONS[role].length} permissions
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Default Permissions */}
                  <div>
                    <Label>Default Permissions for {formData.role}</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {ROLE_PERMISSIONS[formData.role].map((permission) => (
                          <Badge key={permission.id} variant="outline" className="text-xs">
                            {permission.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Custom Permissions */}
                  <div>
                    <Label>Additional Permissions (Optional)</Label>
                    <div className="mt-2 space-y-3 max-h-48 overflow-y-auto">
                      {allAvailablePermissions
                        .filter(p => !ROLE_PERMISSIONS[formData.role].some(rp => rp.id === p.id))
                        .map((permission) => (
                        <div key={permission.id} className="flex items-start gap-3">
                          <Checkbox
                            id={permission.id}
                            checked={formData.customPermissions.includes(permission.id)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.id, checked as boolean)
                            }
                          />
                          <div className="flex-1">
                            <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                              {permission.name}
                            </Label>
                            <p className="text-xs text-gray-600">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Welcome Email */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Notification Settings
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="welcomeEmail"
                      checked={formData.sendWelcomeEmail}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, sendWelcomeEmail: checked as boolean })
                      }
                    />
                    <Label htmlFor="welcomeEmail">Send welcome email with login instructions</Label>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Name:</strong> {formData.name || 'Not specified'}</p>
                    <p><strong>Email:</strong> {formData.email || 'Not specified'}</p>
                    <p><strong>Role:</strong> {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}</p>
                    <p><strong>Total Permissions:</strong> {getSelectedPermissions().length}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!formData.name || !formData.email || !formData.phone}>
                    <Send className="w-4 h-4 mr-2" />
                    Create User
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CreateUserForm;
