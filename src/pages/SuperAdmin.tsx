
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Building,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Search,
  Upload,
  BarChart3,
  Calendar,
  MessageSquare,
  FileText,
  Mail,
  Phone,
  CreditCard,
  UserCheck,
  Briefcase,
  Menu,
  X,
  Send,
  Target,
  Activity
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import BulkImportModal from '@/components/admin/BulkImportModal';
import PropertyDetailsModal from '@/components/property/PropertyDetailsModal';
import UserManagement from '@/components/user/UserManagement';
import AddUserModal from '@/components/admin/AddUserModal';
import LeadDetailsModal from '@/components/admin/LeadDetailsModal';
import CreateInvoiceModal from '@/components/admin/CreateInvoiceModal';
import CreateEventModal from '@/components/admin/CreateEventModal';
import CreateCampaignModal from '@/components/admin/CreateCampaignModal';
import { useToast } from '@/hooks/use-toast';

const SuperAdmin = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('overview');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data
  const [properties] = useState([
    {
      id: '1',
      name: 'Sunset Apartments',
      address: '123 Main St, New York, NY 10001',
      units: 150,
      occupancy_rate: 92,
      client_name: 'ABC Property Management',
      status: 'active'
    },
    {
      id: '2',
      name: 'Ocean View Towers',
      address: '456 Ocean Ave, Miami, FL 33101',
      units: 200,
      occupancy_rate: 88,
      client_name: 'Coastal Properties LLC',
      status: 'active'
    }
  ]);

  const [leads, setLeads] = useState([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      status: 'new',
      source: 'Website',
      budget: 2500,
      moveInDate: '2025-02-01',
      propertyType: 'Apartment',
      bedrooms: '2BR',
      date: '2025-01-15T10:00:00Z',
      notes: 'Interested in pet-friendly apartments'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 987-6543',
      status: 'contacted',
      source: 'Referral',
      budget: 3000,
      moveInDate: '2025-03-15',
      propertyType: 'Condo',
      bedrooms: '1BR',
      date: '2025-01-14T14:30:00Z',
      notes: 'Looking for luxury amenities'
    }
  ]);

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [campaigns, setCampaigns] = useState([
    {
      id: '1',
      name: 'Spring Move-In Special',
      type: 'email',
      status: 'active',
      targetAudience: 'prospects',
      sentCount: 1250,
      openRate: 32.5,
      clickRate: 8.7,
      conversions: 23,
      createdDate: '2025-01-10',
      budget: 500,
      description: 'Promote spring move-in discounts and incentives'
    },
    {
      id: '2',
      name: 'Renewal Campaign',
      type: 'sms',
      status: 'scheduled',
      targetAudience: 'current_residents',
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      conversions: 0,
      createdDate: '2025-01-12',
      budget: 200,
      description: 'Encourage lease renewals with special offers'
    }
  ]);

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
  };

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleUserAdded = (user: any) => {
    setUsers([...users, user]);
    toast({
      title: "Success",
      description: "User added successfully",
    });
  };

  const handleEventCreated = (event: any) => {
    setEvents([...events, event]);
    toast({
      title: "Success", 
      description: "Event created successfully",
    });
  };

  const handleInvoiceCreated = (invoice: any) => {
    setInvoices([...invoices, invoice]);
    toast({
      title: "Success",
      description: "Invoice created successfully", 
    });
  };

  const handleCampaignCreated = (campaign: any) => {
    setCampaigns([...campaigns, campaign]);
    toast({
      title: "Success",
      description: "Marketing campaign created successfully",
    });
  };

  // Add missing handler functions
  const handleAddProperty = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Property creation feature will be available soon",
    });
  };

  const handleAddLead = () => {
    toast({
      title: "Feature Coming Soon", 
      description: "Lead creation feature will be available soon",
    });
  };

  const handleAddClient = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Client creation feature will be available soon", 
    });
  };

  const handleCreateCampaign = () => {
    setShowCreateCampaign(true);
  };

  const handleLaunchCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: 'active' }
        : campaign
    ));
    toast({
      title: "Campaign Launched",
      description: "Marketing campaign has been launched successfully",
    });
  };

  const handlePauseCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: 'paused' }
        : campaign
    ));
    toast({
      title: "Campaign Paused",
      description: "Marketing campaign has been paused",
    });
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      paused: 'bg-orange-100 text-orange-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'properties', label: 'Properties', icon: Building },
    { id: 'clients', label: 'Clients', icon: Briefcase },
    { id: 'crm', label: 'CRM & Sales', icon: Users },
    { id: 'users', label: 'User Management', icon: UserCheck },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'marketing', label: 'Marketing', icon: Mail },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'operators', label: 'Operators', icon: Users },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
            SA
          </div>
          <span className="font-semibold text-lg">Super Admin</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">Revenue</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">$125K</div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6 max-w-full">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{properties.length}</div>
                  <div className="text-sm text-gray-600">Total Properties</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
                  <div className="text-sm text-gray-600">Active Leads</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">$125K</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {properties.slice(0, 3).map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                           onClick={() => handlePropertyClick(property)}>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium truncate">{property.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{property.units} units</p>
                        </div>
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leads.slice(0, 3).map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                           onClick={() => handleLeadClick(lead)}>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium truncate">{lead.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{lead.email}</p>
                        </div>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'properties':
        return (
          <div className="space-y-4 max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold">Properties Management</h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setShowBulkImport(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Import
                </Button>
                <Button onClick={handleAddProperty}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {properties.map((property) => (
                <Card key={property.id} className="hover:shadow-md transition-shadow cursor-pointer" 
                      onClick={() => handlePropertyClick(property)}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold truncate">{property.name}</h3>
                          <p className="text-sm text-gray-600 truncate">{property.address}</p>
                          <p className="text-sm text-gray-500 truncate">{property.client_name}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-semibold">{property.units} units</div>
                        <div className="text-sm text-gray-600">{property.occupancy_rate}% occupied</div>
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'users':
        return <UserManagement />;

      case 'crm':
        return (
          <div className="space-y-4 max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold">Leads Management</h2>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button onClick={handleAddLead}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lead
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <Card key={lead.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleLeadClick(lead)}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold truncate">{lead.name}</h3>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span className="truncate">{lead.phone}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Budget: ${lead.budget?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(lead.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'clients':
        return (
          <div className="space-y-4 max-w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Client Management</h2>
              <Button onClick={handleAddClient}>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No clients yet</h3>
                <p className="text-gray-600 mb-4">Add your first client to get started</p>
                <Button onClick={handleAddClient}>Add Client</Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'marketing':
        return (
          <div className="space-y-6 max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold">Marketing Campaigns</h2>
                <p className="text-sm text-gray-600 mt-1">Create and manage marketing campaigns to reach prospects and residents</p>
              </div>
              <Button onClick={handleCreateCampaign}>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>

            {/* Campaign Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Send className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {campaigns.reduce((sum, campaign) => sum + campaign.sentCount, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Sent</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Conversions</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {campaigns.filter(c => c.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Campaigns</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    ${campaigns.reduce((sum, campaign) => sum + campaign.budget, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </CardContent>
              </Card>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg truncate">{campaign.name}</h3>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {campaign.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Target:</span>
                            <div className="font-medium">{campaign.targetAudience.replace('_', ' ')}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Sent:</span>
                            <div className="font-medium">{campaign.sentCount.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Open Rate:</span>
                            <div className="font-medium">{campaign.openRate}%</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Conversions:</span>
                            <div className="font-medium">{campaign.conversions}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                        {campaign.status === 'scheduled' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleLaunchCampaign(campaign.id)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Launch
                          </Button>
                        )}
                        {campaign.status === 'active' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePauseCampaign(campaign.id)}
                          >
                            Pause
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Activity className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {campaigns.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
                  <p className="text-gray-600 mb-4">Create your first marketing campaign to reach potential residents</p>
                  <Button onClick={handleCreateCampaign}>Create Campaign</Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-4 max-w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Events Management</h2>
              <Button onClick={() => setShowCreateEvent(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
            
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold truncate">{event.title}</h3>
                          <p className="text-sm text-gray-600 truncate">{event.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            <span>{event.date}</span>
                            <span>{event.startTime}</span>
                            {event.location && <span className="truncate">{event.location}</span>}
                          </div>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No events scheduled</h3>
                  <p className="text-gray-600 mb-4">Create your first event to engage with residents</p>
                  <Button onClick={() => setShowCreateEvent(true)}>Create Event</Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-4 max-w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Billing & Invoices</h2>
              <Button onClick={() => setShowCreateInvoice(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </div>

            {invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold truncate">{invoice.invoiceNumber}</h3>
                          <p className="text-sm text-gray-600 truncate">{invoice.clientName}</p>
                          <p className="text-sm text-gray-500">Due: {invoice.dueDate}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-semibold">${invoice.total.toFixed(2)}</div>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No invoices created</h3>
                  <p className="text-gray-600 mb-4">Create your first invoice to bill clients</p>
                  <Button onClick={() => setShowCreateInvoice(true)}>Create Invoice</Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'operators':
        return (
          <div className="space-y-4 max-w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Operators Management</h2>
              <Button onClick={() => setShowAddUser(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Operator
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No operators yet</h3>
                <p className="text-gray-600 mb-4">Add your first operator to get started</p>
                <Button onClick={() => setShowAddUser(true)}>Add Operator</Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white border-r flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80 lg:hidden">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b bg-white px-4 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage properties, users, and business operations</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-full">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BulkImportModal
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
      />

      <AddUserModal
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
        onUserAdded={handleUserAdded}
      />

      <LeadDetailsModal
        lead={selectedLead}
        isOpen={showLeadDetails}
        onClose={() => {
          setShowLeadDetails(false);
          setSelectedLead(null);
        }}
      />

      <CreateInvoiceModal
        isOpen={showCreateInvoice}
        onClose={() => setShowCreateInvoice(false)}
        onInvoiceCreated={handleInvoiceCreated}
      />

      <CreateEventModal
        isOpen={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
        onEventCreated={handleEventCreated}
      />

      <CreateCampaignModal
        isOpen={showCreateCampaign}
        onClose={() => setShowCreateCampaign(false)}
        onCampaignCreated={handleCampaignCreated}
      />

      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default SuperAdmin;
