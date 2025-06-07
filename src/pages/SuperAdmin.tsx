
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
  FolderOpen
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import BulkImportModal from '@/components/admin/BulkImportModal';
import PropertyDetailsModal from '@/components/property/PropertyDetailsModal';
import UserManagement from '@/components/user/UserManagement';
import AddUserModal from '@/components/admin/AddUserModal';
import LeadDetailsModal from '@/components/admin/LeadDetailsModal';
import CreateInvoiceModal from '@/components/admin/CreateInvoiceModal';
import CreateEventModal from '@/components/admin/CreateEventModal';
import { useToast } from '@/hooks/use-toast';

const SuperAdmin = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('overview');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Event handlers
  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
  };

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleUserAdded = (user: any) => {
    setUsers([...users, user]);
  };

  const handleEventCreated = (event: any) => {
    setEvents([...events, event]);
  };

  const handleInvoiceCreated = (invoice: any) => {
    setInvoices([...invoices, invoice]);
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
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
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
                      <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{property.name}</h4>
                          <p className="text-sm text-gray-600">{property.units} units</p>
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
                  <CardTitle>Recent Client Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">New client onboarded</h4>
                        <p className="text-sm text-gray-600">ABC Property Management</p>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Contract signed</h4>
                        <p className="text-sm text-gray-600">Ocean View Towers</p>
                      </div>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'clients':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Client Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No clients yet</h3>
                <p className="text-gray-600 mb-4">Add your first client to get started</p>
                <Button>Add Client</Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'crm':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">CRM & Sales</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{lead.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {lead.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {lead.phone}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Budget: ${lead.budget?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
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

      case 'users':
        return <UserManagement />;

      case 'billing':
        return (
          <div className="space-y-4">
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
                        <div>
                          <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                          <p className="text-sm text-gray-600">{invoice.clientName}</p>
                          <p className="text-sm text-gray-500">Due: {invoice.dueDate}</p>
                        </div>
                        <div className="text-right">
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

      case 'marketing':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Marketing Campaigns</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-4">Create your first marketing campaign to reach potential residents</p>
                <Button>Create Campaign</Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Calendar & Events</h2>
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
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            <span>{event.date}</span>
                            <span>{event.startTime}</span>
                            {event.location && <span>{event.location}</span>}
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

      case 'operators':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Operators Management</h2>
              <Button onClick={() => setShowAddUser(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Operator
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No operators yet</h3>
                <p className="text-gray-600 mb-4">Add operators to manage your properties</p>
                <Button onClick={() => setShowAddUser(true)}>Add Operator</Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-64">
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SA</span>
              </div>
              <span className="font-semibold">Super Admin</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('overview')}
                      isActive={activeSection === 'overview'}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('clients')}
                      isActive={activeSection === 'clients'}
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Clients</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('crm')}
                      isActive={activeSection === 'crm'}
                    >
                      <Users className="w-4 h-4" />
                      <span>CRM & Sales</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('users')}
                      isActive={activeSection === 'users'}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>User Management</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('billing')}
                      isActive={activeSection === 'billing'}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Billing</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('marketing')}
                      isActive={activeSection === 'marketing'}
                    >
                      <Mail className="w-4 h-4" />
                      <span>Marketing</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('calendar')}
                      isActive={activeSection === 'calendar'}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Calendar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('operators')}
                      isActive={activeSection === 'operators'}
                    >
                      <Users className="w-4 h-4" />
                      <span>Operators</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Revenue</div>
                <div>$0</div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="mx-2 h-4 w-px bg-sidebar-border" />
            <h1 className="text-lg font-semibold">Applaud Super Admin</h1>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            {renderContent()}
          </div>
        </SidebarInset>
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

      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </SidebarProvider>
  );
};

export default SuperAdmin;
