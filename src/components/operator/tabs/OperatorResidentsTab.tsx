import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, Phone, Mail, Home, Calendar, ChevronRight, ArrowLeft, Truck, FileText, Upload, Download, Eye } from 'lucide-react';
import MoveInTracker from '../MoveInTracker';

const OperatorResidentsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [showMoveInTracker, setShowMoveInTracker] = useState(false);
  const [moveInResidentId, setMoveInResidentId] = useState<string>('');

  const residents = [
    {
      id: 1,
      name: 'Sarah Johnson',
      unit: 'A204',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@email.com',
      birthdate: '1985-03-15',
      leaseStatus: 'active',
      moveInDate: '2023-06-15',
      balance: 0,
      workOrders: 2,
      renewalStatus: 'pending',
      hasMoveInProgress: false,
      documents: [
        { id: 1, name: 'Lease Agreement.pdf', type: 'lease', uploadDate: '2023-06-10', size: '2.3 MB' },
        { id: 2, name: 'Driver License.jpg', type: 'id', uploadDate: '2023-06-10', size: '1.1 MB' },
        { id: 3, name: 'Application.pdf', type: 'application', uploadDate: '2023-06-08', size: '850 KB' }
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      unit: 'B156',
      phone: '(555) 234-5678',
      email: 'michael.chen@email.com',
      birthdate: '1990-11-22',
      leaseStatus: 'expiring',
      moveInDate: '2022-08-20',
      balance: 150.00,
      workOrders: 0,
      renewalStatus: 'offered',
      hasMoveInProgress: false,
      documents: [
        { id: 4, name: 'Lease Agreement.pdf', type: 'lease', uploadDate: '2022-08-15', size: '2.1 MB' },
        { id: 5, name: 'Background Check.pdf', type: 'application', uploadDate: '2022-08-10', size: '450 KB' }
      ]
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      unit: 'C302',
      phone: '(555) 345-6789',
      email: 'emily.rodriguez@email.com',
      birthdate: '1988-07-08',
      leaseStatus: 'active',
      moveInDate: '2023-11-10',
      balance: 0,
      workOrders: 1,
      renewalStatus: 'not_due',
      hasMoveInProgress: false,
      documents: [
        { id: 6, name: 'Lease Agreement.pdf', type: 'lease', uploadDate: '2023-11-05', size: '2.2 MB' },
        { id: 7, name: 'Emergency Contact Form.pdf', type: 'legal', uploadDate: '2023-11-05', size: '320 KB' }
      ]
    },
    {
      id: 4,
      name: 'David Thompson',
      unit: 'A108',
      phone: '(555) 456-7890',
      email: 'david.thompson@email.com',
      birthdate: '1982-12-03',
      leaseStatus: 'delinquent',
      moveInDate: '2023-03-05',
      balance: 850.00,
      workOrders: 3,
      renewalStatus: 'not_due',
      hasMoveInProgress: false,
      documents: [
        { id: 8, name: 'Lease Agreement.pdf', type: 'lease', uploadDate: '2023-03-01', size: '2.4 MB' },
        { id: 9, name: 'Late Notice.pdf', type: 'legal', uploadDate: '2024-01-15', size: '180 KB' },
        { id: 10, name: 'Payment Plan Agreement.pdf', type: 'legal', uploadDate: '2024-02-01', size: '220 KB' }
      ]
    },
    {
      id: 5,
      name: 'April Chen',
      unit: '424-3',
      phone: '(555) 567-8901',
      email: 'aprilchen@email.com',
      birthdate: '1995-04-12',
      leaseStatus: 'move_in_progress',
      moveInDate: '2025-03-21',
      balance: 0,
      workOrders: 0,
      renewalStatus: 'not_due',
      hasMoveInProgress: true,
      documents: [
        { id: 11, name: 'Application.pdf', type: 'application', uploadDate: '2025-02-15', size: '1.2 MB' },
        { id: 12, name: 'ID Copy.jpg', type: 'id', uploadDate: '2025-02-15', size: '980 KB' }
      ]
    },
    {
      id: 6,
      name: 'Zhihan He',
      unit: '518',
      phone: '(555) 678-9012',
      email: 'zhihan@email.com',
      birthdate: '1992-09-28',
      leaseStatus: 'move_in_progress',
      moveInDate: '2025-03-10',
      balance: 0,
      workOrders: 0,
      renewalStatus: 'not_due',
      hasMoveInProgress: true,
      documents: [
        { id: 13, name: 'Application.pdf', type: 'application', uploadDate: '2025-02-20', size: '1.1 MB' },
        { id: 14, name: 'Passport Copy.jpg', type: 'id', uploadDate: '2025-02-20', size: '1.5 MB' },
        { id: 15, name: 'Employment Letter.pdf', type: 'application', uploadDate: '2025-02-22', size: '650 KB' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-orange-100 text-orange-800';
      case 'delinquent': return 'bg-red-100 text-red-800';
      case 'move_in_progress': return 'bg-blue-100 text-blue-800';
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

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'lease': return 'bg-blue-100 text-blue-800';
      case 'id': return 'bg-green-100 text-green-800';
      case 'application': return 'bg-purple-100 text-purple-800';
      case 'legal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || resident.leaseStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleMoveInTracker = (residentId: string) => {
    setMoveInResidentId(residentId);
    setShowMoveInTracker(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Uploading files:', Array.from(files).map(f => f.name));
      // In a real app, this would upload to a server
    }
  };

  if (showMoveInTracker) {
    return (
      <MoveInTracker 
        onClose={() => setShowMoveInTracker(false)}
        residentId={moveInResidentId}
      />
    );
  }

  if (selectedResident) {
    return (
      <div className="px-4 py-6 pb-24">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedResident(null)}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedResident.name}</h1>
              <p className="text-gray-600">Unit {selectedResident.unit}</p>
            </div>
          </div>
        </div>

        {/* Resident Profile Content */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{selectedResident.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{selectedResident.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Born: {new Date(selectedResident.birthdate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lease Information */}
          <Card>
            <CardHeader>
              <CardTitle>Lease Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Move-in Date</span>
                  <p className="font-medium">{new Date(selectedResident.moveInDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Lease Status</span>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedResident.leaseStatus)}>
                      {selectedResident.leaseStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Balance</span>
                  <p className={`font-medium ${selectedResident.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${selectedResident.balance.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Open Work Orders</span>
                  <p className="font-medium">{selectedResident.workOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Documents</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id={`file-upload-${selectedResident.id}`}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById(`file-upload-${selectedResident.id}`)?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedResident.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Badge variant="outline" className={getDocumentTypeColor(doc.type)}>
                            {doc.type}
                          </Badge>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {selectedResident.documents.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p>No documents uploaded yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Move-In Progress (if applicable) */}
          {selectedResident.hasMoveInProgress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-5 h-5" />
                  <span>Move-In Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  This resident has a move-in in progress. Track their move-in tasks and completion status.
                </p>
                <Button 
                  onClick={() => handleMoveInTracker(selectedResident.id.toString())}
                  className="w-full"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  View Move-In Tracker
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Home className="w-4 h-4 mr-2" />
                Create Work Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <SelectItem value="move_in_progress">Move-In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Residents List */}
      <div className="space-y-4">
        {filteredResidents.map((resident) => (
          <Card 
            key={resident.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedResident(resident)}
          >
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
                      {resident.hasMoveInProgress && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Truck className="w-3 h-3 mr-1" />
                          Move-In
                        </Badge>
                      )}
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
