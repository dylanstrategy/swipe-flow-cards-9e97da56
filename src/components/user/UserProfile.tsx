
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { UserProfile as UserProfileType, UserRole, ROLE_PERMISSIONS, Permission } from '@/types/users';
import { ArrowLeft, Edit, Save, X, Trash2, User, Mail, Phone, Shield } from 'lucide-react';
import { getFullName } from '@/utils/nameUtils';

interface UserProfileProps {
  user: UserProfileType;
  onBack: () => void;
  onSave: (user: UserProfileType) => void;
  onDelete: (userId: string) => void;
  currentUserRole: UserRole;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onBack, onSave, onDelete, currentUserRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    permissions: user.permissions.map(p => p.id)
  });

  const handleSave = () => {
    const allPermissions = Object.values(ROLE_PERMISSIONS).flat()
      .filter((permission, index, array) =>
        array.findIndex(p => p.id === permission.id) === index
      );
    
    const selectedPermissions = allPermissions.filter(p => formData.permissions.includes(p.id));
    
    const updatedUser: UserProfileType = {
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      permissions: selectedPermissions
    };
    onSave(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      permissions: user.permissions.map(p => p.id)
    });
    setIsEditing(false);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permissionId]
      });
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(id => id !== permissionId)
      });
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      resident: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-orange-100 text-orange-800',
      operator: 'bg-purple-100 text-purple-800',
      senior_operator: 'bg-indigo-100 text-indigo-800',
      leasing: 'bg-green-100 text-green-800',
      management: 'bg-red-100 text-red-800',
      prospect: 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getPermissionLevelColor = (level: string) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-700',
      advanced: 'bg-blue-100 text-blue-700',
      admin: 'bg-red-100 text-red-700'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const availableRoles: UserRole[] = ['maintenance', 'leasing', 'operator', 'senior_operator'];

  const allPermissions = Object.values(ROLE_PERMISSIONS).flat()
    .filter((permission, index, array) =>
      array.findIndex(p => p.id === permission.id) === index
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <p className="text-sm text-gray-600">Manage user details and permissions</p>
            
            {/* Edit buttons moved under title */}
            <div className="flex gap-2 mt-3">
              {!isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => onDelete(user.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 flex-shrink-0">
                <AvatarFallback className="text-xl font-bold bg-blue-600 text-white">
                  {formData.firstName.charAt(0).toUpperCase()}{formData.lastName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{getFullName(formData.firstName, formData.lastName)}</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={`${getRoleColor(formData.role)}`}>
                    {formData.role === 'senior_operator' ? 'Senior Operator' : formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                  </Badge>
                  <Badge className={`${getStatusColor(formData.status)}`}>
                    {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{formData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{formData.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">Email Address</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Role & Status */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5" />
              Role & Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role" className="text-sm font-medium text-gray-700 mb-2 block">Role</Label>
                {isEditing ? (
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableRoles.map(role => (
                      <option key={role} value={role}>
                        {role === 'senior_operator' ? 'Senior Operator' : role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                    {formData.role === 'senior_operator' ? 'Senior Operator' : formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">Status</Label>
                {isEditing ? (
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                    {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions - Redesigned without ScrollArea */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                {allPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(permission.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Label htmlFor={permission.id} className="font-medium cursor-pointer">
                          {permission.name}
                        </Label>
                        <Badge className={`${getPermissionLevelColor(permission.level)} text-xs`}>
                          {permission.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {user.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{permission.name}</span>
                      <Badge className={`${getPermissionLevelColor(permission.level)} text-xs`}>
                        {permission.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Created</Label>
                <p className="text-gray-900">{user.createdAt.toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Last Login</Label>
                <p className="text-gray-900">{user.lastLogin?.toLocaleDateString() || 'Never'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
