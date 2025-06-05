
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  Users, 
  Search, 
  MoreVertical, 
  UserCog, 
  LogOut,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SuperAdmin = () => {
  const { userProfile, signOut } = useAuth();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (companiesError) throw companiesError;

      // Load properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*, companies(name)')
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // Load operators
      const { data: operatorsData, error: operatorsError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('role', ['operator', 'senior_operator'])
        .order('created_at', { ascending: false });

      if (operatorsError) throw operatorsError;

      setCompanies(companiesData || []);
      setProperties(propertiesData || []);
      setOperators(operatorsData || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOperators = operators.filter(operator =>
    `${operator.first_name} ${operator.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role: string) => {
    const colors = {
      operator: 'bg-blue-100 text-blue-800',
      senior_operator: 'bg-purple-100 text-purple-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full max-w-none px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Applaud Super Admin</h1>
              <p className="text-sm text-gray-600">Global oversight dashboard</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none flex-shrink-0">
                  <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all">
                    <AvatarFallback className="bg-red-600 text-white font-semibold">
                      SA
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProfile?.first_name} {userProfile?.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Super Administrator
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="cursor-pointer">
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600"
                  onClick={signOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="w-full max-w-none px-4 sm:px-6">
          <ScrollArea orientation="horizontal" className="w-full">
            <nav className="flex space-x-8 min-w-max">
              {['overview', 'companies', 'properties', 'operators'].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeView === view
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-none p-4 sm:p-6">
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <Building className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-600">Companies</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{companies.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <Building className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-600">Properties</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{properties.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-600">Operators</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{operators.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 flex-shrink-0" />
                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-600">Total Units</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {properties.reduce((sum, prop) => sum + (prop.unit_count || 0), 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companies.slice(0, 5).map((company) => (
                    <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Building className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{company.name}</p>
                          <p className="text-sm text-gray-500">
                            Created {new Date(company.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(company.status)} flex-shrink-0 ml-2`}>
                        {company.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'companies' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredCompanies.map((company) => (
                <Card key={company.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-lg truncate">{company.name}</h3>
                          <p className="text-gray-600 truncate">{company.contact_email}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge className={getStatusColor(company.status)}>
                              {company.status}
                            </Badge>
                            <Badge variant="outline">{company.plan_type}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="flex-shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeView === 'properties' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredProperties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-lg truncate">{property.name}</h3>
                          <p className="text-gray-600 truncate">{property.address}</p>
                          <p className="text-sm text-gray-500">
                            {property.unit_count} units • {property.companies?.name || 'No Company'}
                          </p>
                          <Badge className={`mt-2 ${getStatusColor(property.status)}`}>
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="flex-shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeView === 'operators' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Operators</h2>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Operator
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredOperators.map((operator) => (
                <Card key={operator.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarFallback className="font-semibold">
                            {operator.first_name?.[0]}{operator.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-lg truncate">
                            {operator.first_name} {operator.last_name}
                          </h3>
                          <p className="text-gray-600 truncate">{operator.email}</p>
                          <p className="text-sm text-gray-500 truncate">{operator.phone}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge className={getRoleColor(operator.role)}>
                              {operator.role === 'senior_operator' ? 'Senior Operator' : 'Operator'}
                            </Badge>
                            <Badge className={getStatusColor(operator.status)}>
                              {operator.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="flex-shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;
