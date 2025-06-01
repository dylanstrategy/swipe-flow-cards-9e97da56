
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, User, Phone, Mail, Home, Calendar, ChevronRight } from 'lucide-react';

const OperatorResidentsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const residents = [
    {
      id: 1,
      name: 'Sarah Johnson',
      unit: 'A204',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@email.com',
      leaseStatus: 'active',
      moveInDate: '2023-06-15',
      balance: 0,
      workOrders: 2,
      renewalStatus: 'pending'
    },
    {
      id: 2,
      name: 'Michael Chen',
      unit: 'B156',
      phone: '(555) 234-5678',
      email: 'michael.chen@email.com',
      leaseStatus: 'expiring',
      moveInDate: '2022-08-20',
      balance: 150.00,
      workOrders: 0,
      renewalStatus: 'offered'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      unit: 'C302',
      phone: '(555) 345-6789',
      email: 'emily.rodriguez@email.com',
      leaseStatus: 'active',
      moveInDate: '2023-11-10',
      balance: 0,
      workOrders: 1,
      renewalStatus: 'not_due'
    },
    {
      id: 4,
      name: 'David Thompson',
      unit: 'A108',
      phone: '(555) 456-7890',
      email: 'david.thompson@email.com',
      leaseStatus: 'delinquent',
      moveInDate: '2023-03-05',
      balance: 850.00,
      workOrders: 3,
      renewalStatus: 'not_due'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-orange-100 text-orange-800';
      case 'delinquent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRenewalColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'offered': return 'bg-blue-100 text-blue-800';
      case 'not_due': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || resident.leaseStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Residents</h1>
        <p className="text-gray-600">Manage resident profiles and information</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search residents or units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring">Expiring</SelectItem>
            <SelectItem value="delinquent">Delinquent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Residents List */}
      <div className="space-y-4">
        {filteredResidents.map((resident) => (
          <Card key={resident.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{resident.name}</h3>
                        <p className="text-sm text-gray-600">Unit {resident.unit}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{resident.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{resident.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Moved in {new Date(resident.moveInDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Home className="w-4 h-4" />
                      <span>{resident.workOrders} open work orders</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(resident.leaseStatus)}>
                        {resident.leaseStatus.replace('_', ' ')}
                      </Badge>
                      <Badge className={getRenewalColor(resident.renewalStatus)}>
                        {resident.renewalStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                    {resident.balance > 0 && (
                      <div className="text-sm font-medium text-red-600">
                        Balance: ${resident.balance.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResidents.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No residents found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OperatorResidentsTab;
