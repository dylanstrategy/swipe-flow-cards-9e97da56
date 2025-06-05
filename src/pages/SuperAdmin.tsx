
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  Building2, 
  Home, 
  Plus, 
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';
import { useUsers, useProperties } from '@/hooks/useSupabaseData';
import CreateUserModal from '@/components/admin/CreateUserModal';
import CreatePropertyModal from '@/components/admin/CreatePropertyModal';
import PropertyDetailModal from '@/components/admin/PropertyDetailModal';
import RoleImpersonation from '@/components/RoleImpersonation';
import type { Property } from '@/types/supabase';

const SuperAdmin = () => {
  const { userProfile } = useAuth();
  const { users, loading: usersLoading, refetch: refetchUsers } = useUsers();
  const { properties, loading: propertiesLoading, refetch: refetchProperties } = useProperties();
  
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreatePropertyModalOpen, setIsCreatePropertyModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPropertyDetailModalOpen, setIsPropertyDetailModalOpen] = useState(false);

  // Calculate stats from real data
  const totalUsers = users.length;
  const totalProperties = properties.length;
  const activeResidents = users.filter(user => user.role === 'resident').length;
  const operatorStaff = users.filter(user => 
    ['senior_operator', 'operator', 'maintenance', 'leasing'].includes(user.role)
  ).length;

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsPropertyDetailModalOpen(true);
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'senior_operator':
        return 'bg-purple-100 text-purple-800';
      case 'operator':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'leasing':
        return 'bg-green-100 text-green-800';
      case 'resident':
        return 'bg-emerald-100 text-emerald-800';
      case 'prospect':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!userProfile || userProfile.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header with Role Impersonation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, properties, and system configuration</p>
        </div>
        <RoleImpersonation />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <div className="text-3xl font-bold text-gray-900">{totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Building2 className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <div className="text-3xl font-bold text-gray-900">{totalProperties}</div>
            <div className="text-sm text-gray-600">Properties</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Home className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <div className="text-3xl font-bold text-gray-900">{activeResidents}</div>
            <div className="text-sm text-gray-600">Active Residents</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Settings className="w-8 h-8 mx-auto mb-3 text-orange-600" />
            <div className="text-3xl font-bold text-gray-900">{operatorStaff}</div>
            <div className="text-sm text-gray-600">Staff Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users Management</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Users ({totalUsers})
              </CardTitle>
              <Button 
                onClick={() => setIsCreateUserModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No users found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h3 className="font-medium">{user.first_name} {user.last_name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.phone && (
                            <p className="text-sm text-gray-500">{user.phone}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {formatRole(user.role)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Properties ({totalProperties})
              </CardTitle>
              <Button 
                onClick={() => setIsCreatePropertyModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Property
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {propertiesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No properties found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {properties.map((property) => (
                      <Card key={property.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-lg">{property.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePropertyClick(property)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{property.address}</p>
                          {property.website && (
                            <p className="text-sm text-blue-600 mb-2">{property.website}</p>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Timezone: {property.timezone}</span>
                            <span>{new Date(property.created_at).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  User Role Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    users.reduce((acc, user) => {
                      acc[user.role] = (acc[user.role] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{formatRole(role)}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / totalUsers) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5)
                    .map((user) => (
                      <div key={user.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{user.first_name} {user.last_name}</span>
                          <span className="text-gray-500"> joined as </span>
                          <span className="font-medium">{formatRole(user.role)}</span>
                        </div>
                        <span className="text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onUserCreated={refetchUsers}
      />
      
      <CreatePropertyModal
        isOpen={isCreatePropertyModalOpen}
        onClose={() => setIsCreatePropertyModalOpen(false)}
        onPropertyCreated={refetchProperties}
      />
      
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isPropertyDetailModalOpen}
        onClose={() => {
          setIsPropertyDetailModalOpen(false);
          setSelectedProperty(null);
        }}
        onPropertyUpdated={refetchProperties}
      />
    </div>
  );
};

export default SuperAdmin;
