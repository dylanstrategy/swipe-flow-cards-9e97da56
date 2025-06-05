
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserProfile as UserProfileType, UserRole, ROLE_PERMISSIONS } from '@/types/users';
import { ArrowLeft, Edit, Save, X, Trash2, User, Mail, Phone, Shield, AlertTriangle } from 'lucide-react';

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
    status: user.status
  });

  const handleSave = () => {
    const updatedUser: UserProfileType = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      permissions: ROLE_PERMISSIONS[formData.role]
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
      status: user.status
    });
    setIsEditing(false);
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

  const availableRoles: UserRole[] = ['maintenance', 'leasing', 'operator', 'senior_operator'];

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-lg font-semibold">
                      {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">User Profile</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge className={getRoleColor(formData.role)}>
                        {formData.role === 'senior_operator' ? 'Senior Operator' : formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(formData.status)}>
                        {formData.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => onDelete(user.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Role & Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Role & Status
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    {isEditing ? (
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {availableRoles.map(role => (
                          <option key={role} value={role}>
                            {role === 'senior_operator' ? 'Senior Operator' : role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        value={formData.role === 'senior_operator' ? 'Senior Operator' : formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                        disabled
                      />
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    {isEditing ? (
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <Input
                        value={formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                        disabled
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Permissions</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    {ROLE_PERMISSIONS[formData.role].map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {permission.name}
                          </Badge>
                          <Badge className={`text-xs ${
                            permission.level === 'admin' ? 'bg-red-100 text-red-700' :
                            permission.level === 'advanced' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {permission.level}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Created</Label>
                    <p className="text-gray-600">{user.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Last Login</Label>
                    <p className="text-gray-600">{user.lastLogin?.toLocaleDateString() || 'Never'}</p>
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
