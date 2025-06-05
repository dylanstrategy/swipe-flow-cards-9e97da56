import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserProfile, ROLE_PERMISSIONS } from '@/types/users';
import { Plus, Search, Users, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import CreateUserForm from './CreateUserForm';

const UserManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // Mock current user role - in real app this would come from auth context
  const currentUserRole: UserRole = 'senior_operator';

  // Mock data - in real app this would come from backend
  const [users] = useState<UserProfile[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@meridian.com',
      phone: '(555) 123-4567',
      role: 'operator',
      permissions: ROLE_PERMISSIONS.operator,
      contactInfo: {
        email: 'john.smith@meridian.com',
        phone: '(555) 123-4567',
        emergencyContact: {
          name: 'Jane Smith',
          phone: '(555) 987-6543',
          relationship: 'Spouse'
        }
      },
      status: 'active',
      createdAt: new Date('2025-01-01'),
      lastLogin: new Date('2025-06-05')
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@meridian.com',
      phone: '(555) 234-5678',
      role: 'maintenance',
      permissions: ROLE_PERMISSIONS.maintenance,
      contactInfo: {
        email: 'mike.rodriguez@meridian.com',
        phone: '(555) 234-5678'
      },
      status: 'active',
      createdAt: new Date('2025-02-15'),
      lastLogin: new Date('2025-06-05'),
      createdBy: '1'
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@meridian.com',
      phone: '(555) 345-6789',
      role: 'leasing',
      permissions: ROLE_PERMISSIONS.leasing,
      contactInfo: {
        email: 'sarah.johnson@meridian.com',
        phone: '(555) 345-6789'
      },
      status: 'active',
      createdAt: new Date('2025-03-01'),
      lastLogin: new Date('2025-06-04'),
      createdBy: '1'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

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

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const handleCreateUser = (userData: any) => {
    console.log('Creating user:', userData);
    // In real app, this would call API to create user
    setShowCreateForm(false);
  };

  const handleBackToManagement = () => {
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <CreateUserForm
        onSubmit={handleCreateUser}
        onCancel={handleBackToManagement}
        currentUserRole={currentUserRole}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-sm text-gray-600">Manage team members and their permissions</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="all">All Roles</option>
              <option value="operator">Operators</option>
              <option value="maintenance">Maintenance</option>
              <option value="leasing">Leasing</option>
              <option value="management">Management</option>
              <option value="resident">Residents</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {users.filter(u => u.role === 'maintenance').length}
                </div>
                <div className="text-sm text-gray-600">Maintenance</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.role === 'operator').length}
                </div>
                <div className="text-sm text-gray-600">Operators</div>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <div className="space-y-4 pb-24">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          Created: {user.createdAt.toLocaleDateString()} • 
                          Last login: {user.lastLogin?.toLocaleDateString() || 'Never'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">Permissions:</div>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission.id} variant="outline" className="text-xs">
                          {permission.name}
                        </Badge>
                      ))}
                      {user.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserManagement;
