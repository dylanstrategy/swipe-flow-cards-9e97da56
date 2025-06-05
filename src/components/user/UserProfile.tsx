
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { UserProfile as UserProfileType, UserRole, ROLE_PERMISSIONS, Permission } from '@/types/users';
import { ArrowLeft, Edit, Save, X, Trash2, User, Mail, Phone, Shield } from 'lucide-react';

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
    name: user.name,
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
      name: formData.name,
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
      name: user.name,
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
      <ScrollArea className="h-screen">
        <div className="p-4 pb-20">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="text-lg font-semibold bg-blue-600 text-white">
                      {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">User Profile</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${getRoleColor(formData.role)} text-xs`}>
                        {formData.role === 'senior_operator' ? 'Senior Operator' : formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                      </Badge>
                      <Badge className={`${getStatusColor(formData.status)} text-xs`}>
                        {formData.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!isEditing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => onDelete(user.id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Role & Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Role & Status
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                    {isEditing ? (
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {availableRoles.map(role => (
                          <option key={role} value={role}>
                            {role === 'senior_operator' ? 'Senior Operator' : role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {formData.role === 'senior_operator' ? 'Senior Operator' : formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                    {isEditing ? (
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Permissions</h3>
                {isEditing ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-3">
                    {allPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-start gap-3">
                        <Checkbox
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, checked as boolean)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                              {permission.name}
                            </Label>
                            <Badge className={`${getPermissionLevelColor(permission.level)} text-xs`}>
                              {permission.level}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      {user.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {permission.name}
                            </Badge>
                            <Badge className={`text-xs flex-shrink-0 ${getPermissionLevelColor(permission.level)}`}>
                              {permission.level}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-sm font-medium">Created</Label>
                    <p className="text-gray-600 mt-1">{user.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Login</Label>
                    <p className="text-gray-600 mt-1">{user.lastLogin?.toLocaleDateString() || 'Never'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserProfile;
