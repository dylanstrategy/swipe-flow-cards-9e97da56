
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Key,
  Gift,
  FileText,
  Shield,
  Home,
  ChevronRight
} from 'lucide-react';

interface MoveInTrackerProps {
  onClose: () => void;
  initialFilter?: 'unapproved' | 'incomplete' | 'all';
  residentId?: string;
}

const MoveInTracker = ({ onClose, initialFilter = 'all', residentId }: MoveInTrackerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(initialFilter);
  const [selectedResident, setSelectedResident] = useState<any>(null);

  // Mock data based on the spreadsheet structure
  const moveInResidents = [
    {
      id: '1',
      unit: '424-3',
      name: 'April Chen',
      email: 'aprilchen@email.com',
      phone: '(555) 123-4567',
      moveInDate: '2025-03-21',
      leaseStart: '2025-03-21',
      leaseEnd: '2026-03-20',
      // Resident tasks (approval letter through inspection)
      approvalLetter: true,
      leaseSign: true,
      insurance: false,
      psegCheck: false,
      rentalCheck: false,
      inspection: false,
      // Operator tasks
      keys: false,
      gift: false,
      cannonA: false,
      smartPM: false,
      moved: false,
      welcomeCall: false,
      status: 'unapproved'
    },
    {
      id: '2',
      unit: '518',
      name: 'Zhihan He',
      email: 'zhihan@email.com',
      phone: '(555) 234-5678',
      moveInDate: '2025-03-10',
      leaseStart: '2025-03-10',
      leaseEnd: '2026-03-09',
      approvalLetter: true,
      leaseSign: true,
      insurance: true,
      psegCheck: true,
      rentalCheck: true,
      inspection: true,
      keys: false,
      gift: false,
      cannonA: false,
      smartPM: false,
      moved: false,
      welcomeCall: false,
      status: 'incomplete'
    },
    {
      id: '3',
      unit: '322-1',
      name: 'Samuel Yang',
      email: 'samuel@email.com',
      phone: '(555) 345-6789',
      moveInDate: '2025-03-11',
      leaseStart: '2025-03-11',
      leaseEnd: '2026-03-10',
      approvalLetter: true,
      leaseSign: true,
      insurance: false,
      psegCheck: true,
      rentalCheck: false,
      inspection: false,
      keys: true,
      gift: false,
      cannonA: false,
      smartPM: false,
      moved: false,
      welcomeCall: false,
      status: 'unapproved'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unapproved': return 'bg-red-100 text-red-800';
      case 'incomplete': return 'bg-orange-100 text-orange-800';
      case 'complete': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResidents = moveInResidents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.unit.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    // Determine resident status based on completed tasks
    const residentTasksComplete = resident.approvalLetter && resident.leaseSign && 
                                resident.insurance && resident.psegCheck && 
                                resident.rentalCheck && resident.inspection;
    
    const operatorTasksComplete = resident.keys && resident.gift && 
                                resident.cannonA && resident.smartPM && 
                                resident.moved && resident.welcomeCall;
    
    let actualStatus;
    if (!residentTasksComplete) {
      actualStatus = 'unapproved';
    } else if (!operatorTasksComplete) {
      actualStatus = 'incomplete';
    } else {
      actualStatus = 'complete';
    }
    
    return matchesSearch && actualStatus === filterStatus;
  });

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'approvalLetter': return <FileText className="w-4 h-4" />;
      case 'leaseSign': return <FileText className="w-4 h-4" />;
      case 'insurance': return <Shield className="w-4 h-4" />;
      case 'psegCheck': return <CheckCircle className="w-4 h-4" />;
      case 'rentalCheck': return <CheckCircle className="w-4 h-4" />;
      case 'inspection': return <Home className="w-4 h-4" />;
      case 'keys': return <Key className="w-4 h-4" />;
      case 'gift': return <Gift className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (selectedResident) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <div className="h-full flex flex-col">
          <div className="bg-white shadow-sm px-4 py-6 border-b">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedResident(null)}
                className="p-2"
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Move-In Progress - Unit {selectedResident.unit}
                </h1>
                <p className="text-sm text-gray-600">{selectedResident.name}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
            {/* Resident Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Resident Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Move-in Date:</span>
                    <p className="font-medium">{new Date(selectedResident.moveInDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Lease Term:</span>
                    <p className="font-medium">
                      {new Date(selectedResident.leaseStart).toLocaleDateString()} - {new Date(selectedResident.leaseEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{selectedResident.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{selectedResident.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resident Tasks */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-blue-700">Resident Required Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: 'approvalLetter', label: 'Approval Letter', desc: 'Submit required approval documentation' },
                  { key: 'leaseSign', label: 'Lease Signing', desc: 'Complete and sign lease agreement' },
                  { key: 'insurance', label: 'Insurance', desc: 'Provide proof of renters insurance' },
                  { key: 'psegCheck', label: 'PSEG Check', desc: 'Set up electricity service' },
                  { key: 'rentalCheck', label: 'Rental Check', desc: 'Complete rental verification' },
                  { key: 'inspection', label: 'Inspection', desc: 'Schedule and complete move-in inspection' }
                ].map(task => (
                  <div key={task.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTaskIcon(task.key)}
                      <div>
                        <p className="font-medium text-sm">{task.label}</p>
                        <p className="text-xs text-gray-600">{task.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedResident[task.key] ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <Button 
                        size="sm" 
                        variant={selectedResident[task.key] ? "outline" : "default"}
                        onClick={() => {
                          // Toggle task completion
                          setSelectedResident(prev => ({
                            ...prev,
                            [task.key]: !prev[task.key]
                          }));
                        }}
                      >
                        {selectedResident[task.key] ? 'Mark Incomplete' : 'Mark Complete'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Operator Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-700">Operator Required Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: 'keys', label: 'Keys', desc: 'Prepare and distribute apartment keys' },
                  { key: 'gift', label: 'Welcome Gift', desc: 'Prepare move-in welcome package' },
                  { key: 'cannonA', label: 'Cannon A', desc: 'Complete Cannon A documentation' },
                  { key: 'smartPM', label: 'Smart PM', desc: 'Set up Smart PM system access' },
                  { key: 'moved', label: 'Moved Status', desc: 'Confirm resident has moved in' },
                  { key: 'welcomeCall', label: 'Welcome Call', desc: 'Complete welcome call to resident' }
                ].map(task => (
                  <div key={task.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTaskIcon(task.key)}
                      <div>
                        <p className="font-medium text-sm">{task.label}</p>
                        <p className="text-xs text-gray-600">{task.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedResident[task.key] ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-600" />
                      )}
                      <Button 
                        size="sm" 
                        variant={selectedResident[task.key] ? "outline" : "default"}
                        onClick={() => {
                          // Toggle task completion
                          setSelectedResident(prev => ({
                            ...prev,
                            [task.key]: !prev[task.key]
                          }));
                        }}
                      >
                        {selectedResident[task.key] ? 'Mark Pending' : 'Mark Complete'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="h-full flex flex-col">
        <div className="bg-white shadow-sm px-4 py-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="p-2"
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Move-In Tracker</h1>
                <p className="text-sm text-gray-600">Manage resident move-in progress</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
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
                <SelectItem value="all">All Move-Ins</SelectItem>
                <SelectItem value="unapproved">Unapproved</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Residents List */}
          <div className="space-y-4">
            {filteredResidents.map((resident) => {
              const residentTasksComplete = resident.approvalLetter && resident.leaseSign && 
                                          resident.insurance && resident.psegCheck && 
                                          resident.rentalCheck && resident.inspection;
              
              const operatorTasksComplete = resident.keys && resident.gift && 
                                          resident.cannonA && resident.smartPM && 
                                          resident.moved && resident.welcomeCall;

              const residentTasksCount = [resident.approvalLetter, resident.leaseSign, resident.insurance, 
                                        resident.psegCheck, resident.rentalCheck, resident.inspection]
                                        .filter(Boolean).length;
              
              const operatorTasksCount = [resident.keys, resident.gift, resident.cannonA, 
                                        resident.smartPM, resident.moved, resident.welcomeCall]
                                        .filter(Boolean).length;

              return (
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
                            <Calendar className="w-4 h-4" />
                            <span>Move-in: {new Date(resident.moveInDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>Resident Tasks: {residentTasksCount}/6</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              Operator Tasks: {operatorTasksCount}/6
                            </Badge>
                            {!residentTasksComplete && (
                              <Badge className="bg-red-100 text-red-800">
                                Unapproved
                              </Badge>
                            )}
                            {residentTasksComplete && !operatorTasksComplete && (
                              <Badge className="bg-orange-100 text-orange-800">
                                Incomplete
                              </Badge>
                            )}
                            {residentTasksComplete && operatorTasksComplete && (
                              <Badge className="bg-green-100 text-green-800">
                                Complete
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredResidents.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No move-ins found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoveInTracker;
