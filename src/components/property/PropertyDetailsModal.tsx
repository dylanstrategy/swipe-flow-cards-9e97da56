
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Building,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Home,
  TrendingUp,
  FileText,
  Settings,
  Eye,
  Edit,
  Plus,
  Download,
  Upload,
  BarChart3,
  UserPlus,
  Wrench,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PropertyDetailsModalProps {
  property: any;
  onClose: () => void;
}

const PropertyDetailsModal = ({ property, onClose }: PropertyDetailsModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [residents] = useState([
    { id: '1', name: 'John Smith', unit: '2A', status: 'active', moveInDate: '2024-01-15', rent: 2850 },
    { id: '2', name: 'Sarah Johnson', unit: '3B', status: 'active', moveInDate: '2023-11-01', rent: 3200 },
    { id: '3', name: 'Mike Rodriguez', unit: '1C', status: 'notice_given', moveInDate: '2023-08-15', rent: 2650 },
  ]);

  const handleViewAnalytics = () => {
    toast({
      title: "Property Analytics",
      description: "Opening detailed analytics dashboard for " + property.name,
    });
  };

  const handlePropertySettings = () => {
    toast({
      title: "Property Settings",
      description: "Opening property configuration panel",
    });
  };

  const handleManageResidents = () => {
    setActiveTab('residents');
  };

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Preparing property data export...",
    });
  };

  const handleBulkImport = () => {
    toast({
      title: "Bulk Import",
      description: "Opening bulk import interface for residents and units",
    });
  };

  const handleImpersonateOperator = () => {
    toast({
      title: "Operator Access",
      description: `Switching to operator view for ${property.name}`,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Home className="w-5 h-5" />
            {property.name}
            <Badge className="ml-2">
              {property.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-5 mb-4 flex-shrink-0">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="residents" className="text-xs sm:text-sm">Residents</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
            <TabsTrigger value="data" className="text-xs sm:text-sm">Data</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="overview" className="space-y-4 mt-0">
              {/* Property Overview Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Card>
                  <CardContent className="p-3 text-center">
                    <Building className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{property.units}</div>
                    <div className="text-xs text-gray-600">Total Units</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 text-center">
                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{property.occupancy_rate}%</div>
                    <div className="text-xs text-gray-600">Occupancy Rate</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 text-center">
                    <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">
                      ${((property.units * property.occupancy_rate / 100) * 1800).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Monthly Revenue</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 text-center">
                    <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">
                      {Math.round(property.units * property.occupancy_rate / 100)}
                    </div>
                    <div className="text-xs text-gray-600">Occupied Units</div>
                  </CardContent>
                </Card>
              </div>

              {/* Property Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="w-4 h-4" />
                      Property Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Address</label>
                      <p className="text-gray-900 text-sm break-words">{property.address}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Property Type</label>
                      <p className="text-gray-900 text-sm capitalize">{property.property_type || 'Apartment Complex'}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Year Built</label>
                      <p className="text-gray-900 text-sm">{property.year_built || '2018'}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Management Company</label>
                      <p className="text-gray-900 text-sm break-words">{property.client_name}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building className="w-4 h-4" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button size="sm" className="w-full" onClick={handleImpersonateOperator}>
                      <Eye className="w-4 h-4 mr-2" />
                      View as Operator
                    </Button>
                    <Button size="sm" variant="outline" className="w-full" onClick={handleViewAnalytics}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button size="sm" variant="outline" className="w-full" onClick={handlePropertySettings}>
                      <Settings className="w-4 h-4 mr-2" />
                      Property Settings
                    </Button>
                    <Button size="sm" variant="outline" className="w-full" onClick={handleManageResidents}>
                      <Users className="w-4 h-4 mr-2" />
                      Manage Residents
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="residents" className="space-y-4 mt-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-lg font-semibold">Property Residents</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleBulkImport}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Resident
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {residents.map((resident) => (
                  <Card key={resident.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm">{resident.name}</h4>
                            <p className="text-xs text-gray-600">Unit {resident.unit} • ${resident.rent}/month</p>
                            <p className="text-xs text-gray-500">Move-in: {resident.moveInDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={resident.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                            {resident.status.replace('_', ' ')}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Occupancy Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-green-600">92%</div>
                    <div className="text-xs text-gray-600">+2% from last month</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Average Rent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-blue-600">$2,900</div>
                    <div className="text-xs text-gray-600">+$50 from last month</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Maintenance Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-orange-600">23</div>
                    <div className="text-xs text-gray-600">12 pending, 11 completed</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Financial Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Gross Rental Income</span>
                      <span className="font-medium">$435,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Operating Expenses</span>
                      <span className="font-medium">$127,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Net Operating Income</span>
                      <span className="font-medium text-green-600">$307,500</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Property Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Property Name</label>
                      <Input defaultValue={property.name} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Management Company</label>
                      <Input defaultValue={property.client_name} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Property Type</label>
                      <select className="w-full px-3 py-2 border rounded-md mt-1 text-sm">
                        <option value="apartment">Apartment Complex</option>
                        <option value="condo">Condominium</option>
                        <option value="townhouse">Townhouse</option>
                      </select>
                    </div>
                    <Button size="sm" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Property
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Integrations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Property Management System</p>
                        <p className="text-xs text-gray-600">Connected to Yardi</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Maintenance Platform</p>
                        <p className="text-xs text-gray-600">Connected to AppFolio</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Payment Processing</p>
                        <p className="text-xs text-gray-600">Stripe integration</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Upload className="w-4 h-4" />
                      Bulk Import
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button size="sm" className="w-full" onClick={handleBulkImport}>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Residents
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Units
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Lease Data
                    </Button>
                    <div className="text-xs text-gray-600">
                      Upload CSV files to bulk import data. Template files available for download.
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Download className="w-4 h-4" />
                      Data Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button size="sm" className="w-full" onClick={handleExportData}>
                      <Download className="w-4 h-4 mr-2" />
                      Export All Data
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export Residents
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export Financial Data
                    </Button>
                    <div className="text-xs text-gray-600">
                      Export property data in CSV or Excel format for analysis.
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Data Sync Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Resident Data</p>
                        <p className="text-xs text-gray-600">Last synced: 2 minutes ago</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Synced</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Financial Data</p>
                        <p className="text-xs text-gray-600">Last synced: 1 hour ago</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Synced</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Maintenance Data</p>
                        <p className="text-xs text-gray-600">Last synced: 5 minutes ago</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Synced</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;
