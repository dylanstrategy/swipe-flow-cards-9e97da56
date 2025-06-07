
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResident } from '@/contexts/ResidentContext';
import ResidentTimeline from '@/components/ResidentTimeline';
import MoveInTracker from '@/components/operator/MoveInTracker';
import MoveOutTracker from '@/components/operator/MoveOutTracker';
import MoveProgressTracker from '@/components/operator/MoveProgressTracker';
import { 
  Search, 
  Filter, 
  Users, 
  Home, 
  Calendar, 
  Phone, 
  Mail, 
  ChevronRight,
  UserCheck,
  UserClock,
  UserX,
  TrendingUp,
  Truck,
  ClipboardList
} from 'lucide-react';

const OperatorResidentsTab = () => {
  const { 
    allResidents, 
    updateResidentStatus, 
    getCurrentResidents, 
    getFutureResidents, 
    getNoticeResidents,
    getOccupancyRate 
  } = useResident();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showMoveInTracker, setShowMoveInTracker] = useState(false);
  const [showMoveOutTracker, setShowMoveOutTracker] = useState(false);
  const [showMoveProgressTracker, setShowMoveProgressTracker] = useState(false);

  const currentResidents = getCurrentResidents();
  const futureResidents = getFutureResidents();
  const noticeResidents = getNoticeResidents();
  const occupancyRate = getOccupancyRate();

  const getFilteredResidents = () => {
    let filtered = allResidents;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(resident => resident.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(resident => 
        resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleStatusChange = (residentId: string, newStatus: any) => {
    updateResidentStatus(residentId, newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'future': return 'bg-blue-100 text-blue-800';
      case 'notice': return 'bg-orange-100 text-orange-800';
      case 'past': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResidents = getFilteredResidents();

  if (showTimeline) {
    return <ResidentTimeline onClose={() => setShowTimeline(false)} />;
  }

  if (showMoveInTracker) {
    return <MoveInTracker onClose={() => setShowMoveInTracker(false)} />;
  }

  if (showMoveOutTracker) {
    return <MoveOutTracker onClose={() => setShowMoveOutTracker(false)} />;
  }

  if (showMoveProgressTracker) {
    return <MoveProgressTracker onClose={() => setShowMoveProgressTracker(false)} />;
  }

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resident Management</h1>
        <p className="text-gray-600">Manage all residents and their lifecycle</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current</p>
                <p className="text-2xl font-bold text-gray-900">{currentResidents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserClock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Future</p>
                <p className="text-2xl font-bold text-gray-900">{futureResidents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <UserX className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Notice</p>
                <p className="text-2xl font-bold text-gray-900">{noticeResidents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Occupancy</p>
                <p className="text-2xl font-bold text-gray-900">{occupancyRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Button 
          onClick={() => setShowMoveInTracker(true)}
          className="h-auto p-4 flex flex-col items-center space-y-2"
          variant="outline"
        >
          <Truck className="w-6 h-6 text-blue-600" />
          <span className="text-sm font-medium">Move-In Tracker</span>
        </Button>

        <Button 
          onClick={() => setShowMoveOutTracker(true)}
          className="h-auto p-4 flex flex-col items-center space-y-2"
          variant="outline"
        >
          <Truck className="w-6 h-6 text-red-600" />
          <span className="text-sm font-medium">Move-Out Tracker</span>
        </Button>

        <Button 
          onClick={() => setShowMoveProgressTracker(true)}
          className="h-auto p-4 flex flex-col items-center space-y-2"
          variant="outline"
        >
          <ClipboardList className="w-6 h-6 text-green-600" />
          <span className="text-sm font-medium">Progress Tracker</span>
        </Button>

        <Button 
          onClick={() => setShowTimeline(true)}
          className="h-auto p-4 flex flex-col items-center space-y-2"
          variant="outline"
        >
          <Calendar className="w-6 h-6 text-purple-600" />
          <span className="text-sm font-medium">Activity Timeline</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search residents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Residents</SelectItem>
            <SelectItem value="current">Current</SelectItem>
            <SelectItem value="future">Future</SelectItem>
            <SelectItem value="notice">Notice</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Residents List */}
      <div className="space-y-4">
        {filteredResidents.map((resident) => (
          <Card key={resident.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{resident.name}</h3>
                      <Badge className={getStatusColor(resident.status)}>
                        {resident.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Home className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Unit {resident.unitNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{resident.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{resident.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Select 
                    value={resident.status} 
                    onValueChange={(value) => handleStatusChange(resident.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="future">Future</SelectItem>
                      <SelectItem value="notice">Notice</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedResident(resident);
                      setShowMoveProgressTracker(true);
                    }}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResidents.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
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
