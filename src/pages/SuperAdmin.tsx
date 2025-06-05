import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
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
  Trash2,
  DollarSign,
  Calendar,
  FileText,
  Mail,
  BarChart3,
  UserPlus,
  CreditCard,
  MessageSquare,
  Activity
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load from localStorage
      const storedCompanies = localStorage.getItem('applaud_companies');
      const storedProperties = localStorage.getItem('applaud_properties');
      const storedOperators = localStorage.getItem('applaud_operators');

      setCompanies(storedCompanies ? JSON.parse(storedCompanies) : []);
      setProperties(storedProperties ? JSON.parse(storedProperties) : []);
      setOperators(storedOperators ? JSON.parse(storedOperators) : []);
      
      // Mock leads data
      setLeads([
        { id: '1', name: 'Meridian Properties', email: 'contact@meridianprops.com', status: 'contract_sent', units: 150, created_at: new Date() },
        { id: '2', name: 'Sunset Management', email: 'info@sunsetmgmt.com', status: 'call_scheduled', units: 75, created_at: new Date() },
        { id: '3', name: 'Urban Living Co', email: 'hello@urbanliving.com', status: 'interest', units: 200, created_at: new Date() },
      ]);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProperties = properties.filter(property =>
    property.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOperators = operators.filter(operator =>
    `${operator.first_name || ''} ${operator.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      interest: 'bg-blue-100 text-blue-800',
      call_scheduled: 'bg-purple-100 text-purple-800',
      contract_sent: 'bg-orange-100 text-orange-800',
      signed: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role: string) => {
    const colors = {
      operator: 'bg-blue-100 text-blue-800',
      senior_operator: 'bg-purple-100 text-purple-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleImpersonate = async (userId: string) => {
    try {
      toast({
        title: "Impersonation Feature",
        description: "This would allow you to view the dashboard as the selected user. Feature coming soon.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to impersonate user",
        variant: "destructive",
      });
    }
  };

  const handleAddClient = async () => {
    try {
      const registrationLink = `${window.location.origin}/owner-login`;
      await navigator.clipboard.writeText(registrationLink);
      
      toast({
        title: "Registration Link Generated",
        description: "Client registration link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Registration Link",
        description: `Share this link with new clients: ${window.location.origin}/owner-login`,
      });
    }
  };

  const handleAddOperator = async () => {
    try {
      const registrationLink = `${window.location.origin}/`;
      await navigator.clipboard.writeText(registrationLink);
      
      toast({
        title: "Operator Registration Link",
        description: "Operator registration link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Registration Link",
        description: `Share this link with new operators: ${window.location.origin}/`,
      });
    }
  };

  const handleSendContract = (leadId: string) => {
    toast({
      title: "Contract Sent",
      description: "Contract has been sent to the client for review and signature",
    });
  };

  const handleCreateInvoice = () => {
    toast({
      title: "Invoice Creation",
      description: "Invoice creation module coming soon",
    });
  };

  const handleCreateCampaign = () => {
    toast({
      title: "Campaign Creation",
      description: "Marketing campaign builder coming soon",
    });
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/owner-login');
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
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Applaud Super Admin</h1>
              <p className="text-sm text-gray-600">Global oversight & client management</p>
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
                    <p className="text-sm font-medium leading-none">Super Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@applaud.com</p>
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
                  onClick={handleSignOut}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollArea className="w-full">
            <nav className="flex space-x-8 min-w-max">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'clients', label: 'Client Management', icon: Building },
                { id: 'leads', label: 'CRM & Sales', icon: UserPlus },
                { id: 'billing', label: 'Billing', icon: CreditCard },
                { id: 'marketing', label: 'Marketing', icon: Mail },
                { id: 'calendar', label: 'Calendar', icon: Calendar },
                { id: 'operators', label: 'Operators', icon: Users }
              ].map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                      activeView === view.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {view.label}
                  </button>
                );
              })}
            </nav>
          </ScrollArea>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Building className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Clients</p>
                      <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Building className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Properties</p>
                      <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Units</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {properties.reduce((sum, prop) => sum + (prop.unit_count || 0), 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <UserPlus className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Leads</p>
                      <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">$47.2K</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Client Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {companies.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No clients found. Add some clients to see activity here.</p>
                    ) : (
                      companies.slice(0, 5).map((company) => (
                        <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Building className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{company.name}</p>
                              <p className="text-sm text-gray-500">
                                Created {new Date(company.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(company.status || 'active')}>
                            {company.status || 'active'}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Sales Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.units} units • {lead.email}</p>
                        </div>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === 'clients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
              <Button onClick={handleAddClient}>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredCompanies.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first client to the platform.</p>
                    <Button onClick={handleAddClient}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Client
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredCompanies.map((company) => (
                  <Card key={company.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{company.name}</h3>
                            <p className="text-gray-600">{company.contact_email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getStatusColor(company.status || 'active')}>
                                {company.status || 'active'}
                              </Badge>
                              <Badge variant="outline">{company.plan_type || 'standard'}</Badge>
                              <span className="text-sm text-gray-500">
                                {properties.filter(p => p.company_id === company.id).reduce((sum, p) => sum + (p.unit_count || 0), 0)} units
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleImpersonate(company.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Impersonate
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="w-4 h-4 mr-2" />
                                View Contract
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeView === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">CRM & Sales Pipeline</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </div>

            {/* Sales Stage Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">New Interest</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">2</div>
                  <div className="text-sm text-gray-600">Call Scheduled</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">1</div>
                  <div className="text-sm text-gray-600">Contract Sent</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-gray-600">Signed</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4">
              {filteredLeads.map((lead) => (
                <Card key={lead.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <UserPlus className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{lead.name}</h3>
                          <p className="text-gray-600">{lead.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm text-gray-500">{lead.units} units</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleSendContract(lead.id)}>
                          <FileText className="w-4 h-4 mr-2" />
                          Send Contract
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule Call
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeView === 'billing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Subscription & Billing</h2>
              <Button onClick={handleCreateInvoice}>
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </div>

            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">$47,250</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Outstanding Invoices</p>
                      <p className="text-2xl font-bold text-gray-900">$12,800</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Average Revenue Per Unit</p>
                      <p className="text-2xl font-bold text-gray-900">$45</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Client Billing Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companies.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No billing data available. Add clients to see their billing information.</p>
                  ) : (
                    companies.map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-gray-500">{company.plan_type || 'standard'} plan</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$2,850/month</p>
                          <Badge className="bg-green-100 text-green-800">Paid</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'marketing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Marketing & Campaigns</h2>
              <Button onClick={handleCreateCampaign}>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>

            {/* Campaign Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Onboarding Sequence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    7-day email sequence for new clients
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Active:</span> 12 clients
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Open Rate:</span> 78%
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4">
                    Edit Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Resident Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Monthly newsletter template
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Subscribers:</span> 1,247
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Engagement:</span> 65%
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4">
                    Edit Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Lead Nurturing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Follow-up sequence for prospects
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">In Sequence:</span> 23 leads
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Conversion:</span> 34%
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4">
                    Edit Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Shared Calendar</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events Across All Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Meridian Properties - Move-in Inspection</p>
                        <p className="text-sm text-gray-500">Unit 3B • Today at 2:00 PM</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Sunset Management - Property Tour</p>
                        <p className="text-sm text-gray-500">Building A • Tomorrow at 10:00 AM</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Applaud Team - Client Check-in Call</p>
                        <p className="text-sm text-gray-500">Weekly review • Friday at 3:00 PM</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Join</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'operators' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Operators</h2>
              <Button onClick={handleAddOperator}>
                <Plus className="w-4 h-4 mr-2" />
                Add Operator
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredOperators.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No operators yet</h3>
                    <p className="text-gray-500 mb-4">Add operators to help manage your properties and residents.</p>
                    <Button onClick={handleAddOperator}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Operator
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredOperators.map((operator) => (
                  <Card key={operator.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="font-semibold">
                              {operator.first_name?.[0]}{operator.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {operator.first_name} {operator.last_name}
                            </h3>
                            <p className="text-gray-600">{operator.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getRoleColor(operator.role)}>
                                {operator.role === 'senior_operator' ? 'Senior Operator' : 'Operator'}
                              </Badge>
                              <Badge className={getStatusColor(operator.status || 'active')}>
                                {operator.status || 'active'}
                              </Badge>
                              <span className="text-sm text-gray-500">{operator.property}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleImpersonate(operator.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Impersonate
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;
