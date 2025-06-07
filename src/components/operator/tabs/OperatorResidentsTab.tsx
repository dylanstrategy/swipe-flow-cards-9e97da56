import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, User, Phone, Mail, Home, Calendar, ChevronRight, ArrowLeft, Truck, FileText, Upload, Download, Eye, TruckIcon, RefreshCw, AlertTriangle, CheckCircle, XCircle, ArrowUpDown } from 'lucide-react';
import MoveInTracker from '../MoveInTracker';
import MoveOutTracker from '../MoveOutTracker';
import RenewalForm from '../../forms/RenewalForm';
import NoticeToVacateForm from '../../forms/NoticeToVacateForm';
import { useResident } from '@/contexts/ResidentContext';
import { useToast } from '@/hooks/use-toast';
import ResidentTimelineModal from '../ResidentTimelineModal';

const OperatorResidentsTab = () => {
  const { allResidents, updateResidentStatus } = useResident();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUnitType, setFilterUnitType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [showMoveInTracker, setShowMoveInTracker] = useState(false);
  const [showMoveOutTracker, setShowMoveOutTracker] = useState(false);
  const [moveInResidentId, setMoveInResidentId] = useState<string>('');
  const [moveOutResidentId, setMoveOutResidentId] = useState<string>('');
  const [showRenewalForm, setShowRenewalForm] = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineResidentId, setTimelineResidentId] = useState<string>('');

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

  // Get unique unit types for filter
  const unitTypes = Array.from(new Set(allResidents.map(r => r.unitType || 'Unknown'))).sort();

  const filteredAndSortedResidents = allResidents
    .filter(resident => {
      const matchesSearch = resident.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resident.unitNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || resident.status === filterStatus;
      const matchesUnitType = filterUnitType === 'all' || (resident.unitType || 'Unknown') === filterUnitType;
      return matchesSearch && matchesStatus && matchesUnitType;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.fullName.localeCompare(b.fullName);
          break;
        case 'unit':
          // Sort units chronologically (numerically)
          const unitA = parseInt(a.unitNumber) || 0;
          const unitB = parseInt(b.unitNumber) || 0;
          comparison = unitA - unitB;
          break;
        case 'unitType':
          comparison = (a.unitType || '').localeCompare(b.unitType || '');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'rent':
          comparison = (a.currentRent || 0) - (b.currentRent || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

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

  const getTaskCompletion = (residentId: string, status: string) => {
    // Simulate different completion levels
    const completionLevels = {
      'future': Math.random() > 0.3 ? 100 : Math.floor(Math.random() * 90) + 60, // Most future residents are ready
      'current': 100, // Current residents are always complete
      'notice': Math.random() > 0.4 ? 100 : Math.floor(Math.random() * 90) + 70, // Most notice residents have some tasks done
      'prospect': Math.floor(Math.random() * 40) + 10 // Prospects have minimal completion
    };
    
    return completionLevels[status as keyof typeof completionLevels] || 0;
  };

  const handleMoveInResident = (resident: any) => {
    const completion = getTaskCompletion(resident.id, resident.status);
    if (completion < 100) {
      toast({
        title: "Cannot Move In",
        description: `${resident.fullName} has incomplete tasks (${completion}% complete). Please complete all tasks first.`,
        variant: "destructive"
      });
      return;
    }

    // Update resident status to current
    updateResidentStatus(resident.id, 'current');
    toast({
      title: "Resident Moved In",
      description: `${resident.fullName} has been successfully moved in to Unit ${resident.unitNumber}.`
    });
  };

  const handleMoveOutResident = (resident: any) => {
    const completion = getTaskCompletion(resident.id, resident.status);
    if (completion < 100) {
      toast({
        title: "Cannot Move Out",
        description: `${resident.fullName} has incomplete tasks (${completion}% complete). Please complete all tasks first.`,
        variant: "destructive"
      });
      return;
    }

    // Update resident status to past
    updateResidentStatus(resident.id, 'past');
    toast({
      title: "Resident Moved Out",
      description: `${resident.fullName} has been successfully moved out from Unit ${resident.unitNumber}.`
    });
  };

  const handleResidentTimeline = (residentId: string) => {
    setTimelineResidentId(residentId);
    setShowTimelineModal(true);
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
    const taskCompletion = getTaskCompletion(selectedResident.id, selectedResident.status);
    const canMoveIn = selectedResident.status === 'future' && taskCompletion === 100;
    const canMoveOut = selectedResident.status === 'notice' && taskCompletion === 100;

    return (
      <div className="px-4 py-6 pb-24">
        {/* Timeline Modal */}
        <ResidentTimelineModal
          open={showTimelineModal}
          onClose={() => setShowTimelineModal(false)}
          residentName={selectedResident.fullName}
          residentStatus={selectedResident.status}
        />

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

        {/* Task Completion Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Task Completion</span>
              <div className="flex items-center space-x-2">
                {taskCompletion === 100 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-bold ${taskCompletion === 100 ? 'text-green-600' : 'text-red-600'}`}>
                  {taskCompletion}%
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  taskCompletion === 100 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${taskCompletion}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {taskCompletion === 100 
                ? 'All tasks completed. Ready for move-in/move-out actions.'
                : `${100 - taskCompletion}% of tasks remaining before move-in/move-out actions are available.`
              }
            </p>
          </CardContent>
        </Card>

        {/* Move-In/Move-Out Actions */}
        {(selectedResident.status === 'future' || selectedResident.status === 'notice') && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <span>Move Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedResident.status === 'future' && (
                <Button 
                  onClick={() => handleMoveInResident(selectedResident)}
                  disabled={!canMoveIn}
                  className={`w-full ${canMoveIn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300'}`}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  {canMoveIn ? 'Move In Resident' : `Cannot Move In (${taskCompletion}% Complete)`}
                </Button>
              )}
              
              {selectedResident.status === 'notice' && (
                <Button 
                  onClick={() => handleMoveOutResident(selectedResident)}
                  disabled={!canMoveOut}
                  variant={canMoveOut ? "destructive" : "secondary"}
                  className="w-full"
                >
                  <TruckIcon className="w-4 h-4 mr-2" />
                  {canMoveOut ? 'Move Out Resident' : `Cannot Move Out (${taskCompletion}% Complete)`}
                </Button>
              )}
              
              <div className="text-xs text-gray-500 text-center">
                {taskCompletion < 100 && 'Complete all tasks to enable move actions'}
              </div>
            </CardContent>
          </Card>
        )}

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
                  <span>Resident Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Track this resident's complete journey from application to move-out.
                </p>
                <Button 
                  onClick={() => handleResidentTimeline(selectedResident.id.toString())}
                  className="w-full"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  View Resident Timeline
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
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search residents or units..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
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

          <Select value={filterUnitType} onValueChange={setFilterUnitType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by unit type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Unit Types</SelectItem>
              {unitTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="unit">Unit (Chronological)</SelectItem>
              <SelectItem value="unitType">Unit Type</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort(sortBy)}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortOrder === 'asc' ? 'A→Z' : 'Z→A'}
          </Button>
        </div>
      </div>

      {/* Residents List - Cards View */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          {filteredAndSortedResidents.map((resident) => (
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
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{resident.fullName}</h3>
                          <p className="text-sm text-gray-600">Unit {resident.unitNumber} • {resident.unitType || 'Unknown'}</p>
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
      )}

      {/* Residents List - Table View */}
      {viewMode === 'table' && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('unit')}
                >
                  <div className="flex items-center gap-2">
                    Unit
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('unitType')}
                >
                  <div className="flex items-center gap-2">
                    Type
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('rent')}
                >
                  <div className="flex items-center gap-2">
                    Rent
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedResidents.map((resident) => (
                <TableRow 
                  key={resident.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedResident(resident)}
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{resident.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{resident.unitNumber}</TableCell>
                  <TableCell>{resident.unitType || 'Unknown'}</TableCell>
                  <TableCell>
                    <Badge className={getResidentStatusColor(resident.status)}>
                      {resident.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${resident.currentRent.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{resident.phone}</div>
                      <div className="text-gray-500 truncate max-w-32">{resident.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {filteredAndSortedResidents.length === 0 && (
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
