import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers, useProperties, useUnits } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleImpersonation from '@/components/RoleImpersonation';
import CreateUserModal from '@/components/admin/CreateUserModal';
import CreatePropertyModal from '@/components/admin/CreatePropertyModal';
import CreateUnitModal from '@/components/admin/CreateUnitModal';
import { Users, Building, Home, Calendar, Settings, LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SuperAdmin = () => {
  const { userProfile, signOut } = useAuth();
  const { users, loading: usersLoading, refetch: refetchUsers } = useUsers();
  const { properties, loading: propertiesLoading, refetch: refetchProperties } = useProperties();
  const { units, loading: unitsLoading, refetch: refetchUnits } = useUnits();
  const { toast } = useToast();

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateProperty, setShowCreateProperty] = useState(false);
  const [showCreateUnit, setShowCreateUnit] = useState(false);

  const getRoleColor = (role: string) => {
    const colors = {
      super_admin: 'bg-red-100 text-red-800',
      senior_operator: 'bg-purple-100 text-purple-800',
      operator: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-orange-100 text-orange-800',
      leasing: 'bg-green-100 text-green-800',
      resident: 'bg-indigo-100 text-indigo-800',
      prospect: 'bg-gray-100 text-gray-800',
      former_resident: 'bg-yellow-100 text-yellow-800',
      vendor: 'bg-cyan-100 text-cyan-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatRoleName = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast({
        title: "User Deleted",
        description: `${userName} has been deleted successfully.`,
      });
      refetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async (propertyId: string, propertyName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${propertyName}? This will also delete all associated units.`)) {
      return;
    }

    try {
      // First delete all units in the property
      const { error: unitsError } = await supabase
        .from('units')
        .delete()
        .eq('property_id', propertyId);

      if (unitsError) throw unitsError;

      // Then delete the property
      const { error: propertyError } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (propertyError) throw propertyError;

      toast({
        title: "Property Deleted",
        description: `${propertyName} has been deleted successfully.`,
      });
      refetchProperties();
      refetchUnits();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUnit = async (unitId: string, unitNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete Unit ${unitNumber}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', unitId);

      if (error) throw error;

      toast({
        title: "Unit Deleted",
        description: `Unit ${unitNumber} has been deleted successfully.`,
      });
      refetchUnits();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete unit",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Applaud Super Admin</h1>
              <p className="text-sm text-gray-600">Complete system overview and control</p>
            </div>
            
            <div className="flex items-center gap-4">
              <RoleImpersonation />
              
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Super Admin</Badge>
                <span className="text-sm text-gray-600">
                  {userProfile?.first_name} {userProfile?.last_name}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="units">Units</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {users.filter(u => u.role === 'resident').length} residents
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Properties</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{properties.length}</div>
                  <p className="text-xs text-muted-foreground">Active properties</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{units.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {units.filter(u => u.status === 'occupied').length} occupied
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {units.length > 0 ? Math.round((units.filter(u => u.status === 'occupied').length / units.length) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Current occupancy</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database Connection</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Authentication System</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Google OAuth</span>
                    <Badge className="bg-green-100 text-green-800">Configured</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all system users and their roles</CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateUser(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{user.first_name} {user.last_name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">Created: {new Date(user.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getRoleColor(user.role)}>
                              {formatRoleName(user.role)}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteUser(user.id, `${user.first_name} ${user.last_name}`)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Property Management</CardTitle>
                    <CardDescription>Overview of all properties in the system</CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateProperty(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Property
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {propertiesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No properties configured yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{property.name}</h3>
                          <p className="text-sm text-gray-600">{property.address}</p>
                          <p className="text-xs text-gray-500">Created: {new Date(property.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCreateUnit(true)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Unit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteProperty(property.id, property.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="units" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Unit Management</CardTitle>
                    <CardDescription>Overview of all units across properties</CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateUnit(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Unit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {unitsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : units.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No units configured yet
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {units.map((unit) => (
                        <div key={unit.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Unit {unit.unit_number}</h3>
                            <div className="flex items-center gap-1">
                              <Badge className={
                                unit.status === 'occupied' ? 'bg-green-100 text-green-800' :
                                unit.status === 'available' ? 'bg-blue-100 text-blue-800' :
                                unit.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {unit.status}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 ml-1"
                                onClick={() => handleDeleteUnit(unit.id, unit.unit_number)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {unit.bedroom_type || 'N/A'} bed, {unit.bath_type || 'N/A'} bath
                          </p>
                          {unit.sq_ft && (
                            <p className="text-xs text-gray-500">{unit.sq_ft} sq ft</p>
                          )}
                          {unit.lease_start && unit.lease_end && (
                            <p className="text-xs text-gray-500">
                              Lease: {new Date(unit.lease_start).toLocaleDateString()} - {new Date(unit.lease_end).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Authentication</h3>
                    <p className="text-sm text-gray-600 mb-2">Google OAuth is configured and active</p>
                    <Button variant="outline" size="sm">Configure OAuth</Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Database</h3>
                    <p className="text-sm text-gray-600 mb-2">All tables and relationships are configured</p>
                    <Button variant="outline" size="sm">View Schema</Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Role Impersonation</h3>
                    <p className="text-sm text-gray-600 mb-2">Dev Mode allows testing all user roles</p>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreateUserModal 
        isOpen={showCreateUser} 
        onClose={() => setShowCreateUser(false)}
        onUserCreated={refetchUsers}
      />
      <CreatePropertyModal 
        isOpen={showCreateProperty} 
        onClose={() => setShowCreateProperty(false)}
        onPropertyCreated={refetchProperties}
      />
      <CreateUnitModal 
        isOpen={showCreateUnit} 
        onClose={() => setShowCreateUnit(false)}
        onUnitCreated={refetchUnits}
      />
    </div>
  );
};

export default SuperAdmin;
