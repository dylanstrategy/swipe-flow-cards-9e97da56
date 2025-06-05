import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone, Mail, MapPin, Star, Clock, DollarSign, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const MaintenanceVendorsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const vendors = [
    {
      id: 1,
      name: 'ABC Plumbing Services',
      category: 'Plumbing',
      rating: 4.8,
      phone: '(555) 123-4567',
      email: 'contact@abcplumbing.com',
      address: '123 Main St, City, ST 12345',
      status: 'Active',
      responseTime: '2-4 hours',
      avgCost: '$85/hour',
      lastUsed: '2025-05-28',
      totalJobs: 45,
      specialties: ['Emergency Repairs', 'Pipe Installation', 'Drain Cleaning']
    },
    {
      id: 2,
      name: 'Reliable Electric Co',
      category: 'Electrical',
      rating: 4.6,
      phone: '(555) 234-5678',
      email: 'info@reliableelectric.com',
      address: '456 Oak Ave, City, ST 12345',
      status: 'Active',
      responseTime: '1-3 hours',
      avgCost: '$95/hour',
      lastUsed: '2025-05-30',
      totalJobs: 32,
      specialties: ['Outlet Installation', 'Panel Upgrades', 'Emergency Service']
    },
    {
      id: 3,
      name: 'Premier HVAC Solutions',
      category: 'HVAC',
      rating: 4.9,
      phone: '(555) 345-6789',
      email: 'service@premierhvac.com',
      address: '789 Pine St, City, ST 12345',
      status: 'Active',
      responseTime: '4-6 hours',
      avgCost: '$110/hour',
      lastUsed: '2025-05-25',
      totalJobs: 28,
      specialties: ['AC Repair', 'Heating Systems', 'Maintenance']
    },
    {
      id: 4,
      name: 'Express Locksmith',
      category: 'Security',
      rating: 4.4,
      phone: '(555) 456-7890',
      email: 'help@expresslocks.com',
      address: '321 Elm St, City, ST 12345',
      status: 'Active',
      responseTime: '30-60 minutes',
      avgCost: '$75/hour',
      lastUsed: '2025-06-01',
      totalJobs: 18,
      specialties: ['Lock Changes', 'Emergency Lockouts', 'Key Duplication']
    },
    {
      id: 5,
      name: 'Modern Appliance Repair',
      category: 'Appliances',
      rating: 4.2,
      phone: '(555) 567-8901',
      email: 'repairs@modernappliance.com',
      address: '654 Maple Dr, City, ST 12345',
      status: 'Inactive',
      responseTime: '24-48 hours',
      avgCost: '$90/hour',
      lastUsed: '2025-04-15',
      totalJobs: 12,
      specialties: ['Washer/Dryer', 'Refrigerators', 'Dishwashers']
    }
  ];

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Header Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Vendor
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{vendors.length}</div>
                <div className="text-sm text-gray-600">Total Vendors</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {vendors.filter(v => v.status === 'Active').length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {vendors.reduce((acc, v) => acc + v.totalJobs, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {(vendors.reduce((acc, v) => acc + v.rating, 0) / vendors.length).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </CardContent>
            </Card>
          </div>

          {/* Vendors List */}
          <div className="space-y-4 pb-24">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                        <p className="text-sm text-gray-600">{vendor.category}</p>
                      </div>
                      <Badge className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 ${getRatingColor(vendor.rating)}`} fill="currentColor" />
                      <span className={`text-sm font-medium ${getRatingColor(vendor.rating)}`}>
                        {vendor.rating}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {vendor.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {vendor.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {vendor.address}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        Response: {vendor.responseTime}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        {vendor.avgCost}
                      </div>
                      <div className="text-sm text-gray-600">
                        {vendor.totalJobs} jobs completed
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Specialties:</div>
                    <div className="flex flex-wrap gap-2">
                      {vendor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      Last used: {vendor.lastUsed}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">
                        Contact
                      </Button>
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

export default MaintenanceVendorsTab;
