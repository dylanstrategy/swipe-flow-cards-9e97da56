import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, User, Phone, Mail, Home, Calendar, ChevronRight, ArrowLeft, Truck, FileText, Upload, Download, Eye, TruckIcon, RefreshCw, AlertTriangle } from 'lucide-react';
import MoveInTracker from '../MoveInTracker';
import MoveOutTracker from '../MoveOutTracker';
import RenewalForm from '../../forms/RenewalForm';
import NoticeToVacateForm from '../../forms/NoticeToVacateForm';
import { useResident } from '@/contexts/ResidentContext';

const OperatorResidentsTab = () => {
  const { allResidents } = useResident();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [showMoveInTracker, setShowMoveInTracker] = useState(false);
  const [showMoveOutTracker, setShowMoveOutTracker] = useState(false);
  const [moveInResidentId, setMoveInResidentId] = useState<string>('');
  const [moveOutResidentId, setMoveOutResidentId] = useState<string>('');
  const [showRenewalForm, setShowRenewalForm] = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-orange-100 text-orange-800';
      case 'delinquent': return 'bg-red-100 text-red-800';
      case 'move_in_progress': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResidentStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'future': return 'bg-blue-100 text-blue-800';
      case 'notice': return 'bg-orange-100 text-orange-800';
      case 'prospect': return 'bg-purple-100 text-purple-800';
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

  const filteredResidents = allResidents.filter(resident => {
    const matchesSearch = resident.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.unitNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || resident.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleMoveInTracker = (residentId: string) => {
    setMoveInResidentId(residentId);
    setShowMoveInTracker(true);
  };

  const handleMoveOutTracker = (residentId: string) => {
    setMoveOutResidentId(residentId);
    setShowMoveOutTracker(true);
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

  if (showMoveOutTracker) {
    return (
      <MoveOutTracker 
        onClose={() => setShowMoveOutTracker(false)}
        residentId={moveOutResidentId}
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
              <h1 className="text-2xl font-bold text-gray-900">{selectedResident.fullName}</h1>
              <p className="text-gray-600">Unit {selectedResident.unitNumber}</p>
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
                  <p className="font-medium">{selectedResident.moveInDate ? new Date(selectedResident.moveInDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Lease End Date</span>
                  <p className="font-medium">{selectedResident.leaseEndDate ? new Date(selectedResident.leaseEndDate).toLocaleDateString() : 'N/A'}</p>
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
                  <span className="text-sm text-gray-600">Resident Status</span>
                  <div className="mt-1">
                    <Badge className={getResidentStatusColor(selectedResident.status)}>
                      {selectedResident.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Current Rent</span>
                  <p className="font-medium">${selectedResident.currentRent?.toLocaleString() || '0'}</p>
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
                <div>
                  <span className="text-sm text-gray-600">Renewal Status</span>
                  <div className="mt-1">
                    <Badge className={getRenewalColor(selectedResident.renewalStatus)}>
                      {selectedResident.renewalStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lease Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Lease Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Dialog open={showRenewalForm} onOpenChange={setShowRenewalForm}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Submit Renewal Offer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Submit Lease Renewal Offer</DialogTitle>
                    </DialogHeader>
                    <RenewalForm 
                      residentName={selectedResident.name}
                      currentRent={selectedResident.currentRent}
                      isOperator={true}
                      onClose={() => setShowRenewalForm(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog open={showNoticeForm} onOpenChange={setShowNoticeForm}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Issue Notice to Vacate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Issue Notice to Vacate</DialogTitle>
                    </DialogHeader>
                    <NoticeToVacateForm 
                      residentName={selectedResident.name}
                      isOperator={true}
                      onClose={() => setShowNoticeForm(false)}
                    />
                  </DialogContent>
                </Dialog>
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

          {/* Move-Out Progress (if applicable) */}
          {selectedResident.hasMoveOutProgress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TruckIcon className="w-5 h-5" />
                  <span>Move-Out Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  This resident has a move-out in progress. Track their move-out tasks and completion status.
                </p>
                <Button 
                  onClick={() => handleMoveOutTracker(selectedResident.id.toString())}
                  className="w-full"
                  variant="outline"
                >
                  <TruckIcon className="w-4 h-4 mr-2" />
                  View Move-Out Tracker
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

  // Get summary stats by resident status
  const statusCounts = {
    total: allResidents.length,
    current: allResidents.filter(r => r.status === 'current').length,
    notice: allResidents.filter(r => r.status === 'notice').length,
    future: allResidents.filter(r => r.status === 'future').length,
    prospect: allResidents.filter(r => r.status === 'prospect').length,
    past: allResidents.filter(r => r.status === 'past').length
  };

  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Resident Directory</h1>
        <p className="text-gray-600">All residents across all statuses ({allResidents.length} total)</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-blue-600">{statusCounts.total}</div>
          <div className="text-xs text-blue-800">Total</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-green-600">{statusCounts.current}</div>
          <div className="text-xs text-green-800">Current</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-orange-600">{statusCounts.notice}</div>
          <div className="text-xs text-orange-800">Notice</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-blue-600">{statusCounts.future}</div>
          <div className="text-xs text-blue-800">Future</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-purple-600">{statusCounts.prospect}</div>
          <div className="text-xs text-purple-800">Prospect</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-gray-600">{statusCounts.past}</div>
          <div className="text-xs text-gray-800">Past</div>
        </div>
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
            <SelectItem value="current">Current</SelectItem>
            <SelectItem value="notice">Notice</SelectItem>
            <SelectItem value="future">Future</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
            <SelectItem value="past">Past</SelectItem>
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
                        <h3 className="font-semibold text-gray-900">{resident.fullName}</h3>
                        <p className="text-sm text-gray-600">Unit {resident.unitNumber}</p>
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
                      <span>${resident.currentRent.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Home className="w-4 h-4" />
                      <span>{resident.workOrders} open work orders</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getResidentStatusColor(resident.status)}>
                        {resident.status}
                      </Badge>
                      {resident.leaseStatus === 'delinquent' && (
                        <Badge className="bg-red-100 text-red-800">
                          Delinquent
                        </Badge>
                      )}
                      {resident.status === 'future' && (
                        <Badge className="bg-blue-100 text-blue-800">
                          Move-in: {new Date(resident.moveInDate).toLocaleDateString()}
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
