import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, User, Phone, Mail, Home, Calendar, ChevronRight, ArrowLeft, CheckCircle, XCircle, Clock, Truck } from 'lucide-react';

interface MoveInTrackerProps {
  onClose: () => void;
  initialFilter?: 'unapproved' | 'incomplete' | 'all';
  residentId?: string;
}

const MoveInTracker: React.FC<MoveInTrackerProps> = ({ 
  onClose, 
  initialFilter = 'all',
  residentId 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'unapproved' | 'incomplete' | 'all'>(initialFilter);
  const [taskFilter, setTaskFilter] = useState<'all' | 'resident' | 'operator'>('all');
  const [selectedResident, setSelectedResident] = useState<any>(null);

  // Sample move-in data based on the spreadsheet
  const [moveInResidents, setMoveInResidents] = useState([
    {
      id: '5',
      name: 'April Chen',
      unit: '424-3',
      moveInDate: '2025-03-21',
      status: 'unapproved',
      residentTasks: {
        approvalLetter: false,
        leasePacket: true,
        depositCheck: false,
        backgroundCheck: true,
        insurance: false,
        utilitySetup: false,
        inspection: false
      },
      operatorTasks: {
        keys: false,
        gift: false,
        propertyTour: false,
        documentation: true,
        unitPrep: false
      }
    },
    {
      id: '6',
      name: 'Zhihan He',
      unit: '518',
      moveInDate: '2025-03-10',
      status: 'incomplete',
      residentTasks: {
        approvalLetter: true,
        leasePacket: true,
        depositCheck: true,
        backgroundCheck: true,
        insurance: true,
        utilitySetup: true,
        inspection: true
      },
      operatorTasks: {
        keys: false,
        gift: false,
        propertyTour: true,
        documentation: true,
        unitPrep: false
      }
    },
    {
      id: '7',
      name: 'John Smith',
      unit: 'B201',
      moveInDate: '2025-03-15',
      status: 'unapproved',
      residentTasks: {
        approvalLetter: false,
        leasePacket: false,
        depositCheck: true,
        backgroundCheck: true,
        insurance: false,
        utilitySetup: false,
        inspection: false
      },
      operatorTasks: {
        keys: true,
        gift: true,
        propertyTour: true,
        documentation: true,
        unitPrep: true
      }
    }
  ]);

  const getFilteredResidents = () => {
    let filtered = moveInResidents;

    // If a specific resident ID is provided, show only that resident
    if (residentId) {
      filtered = filtered.filter(resident => resident.id === residentId);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(resident => 
        resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.unit.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(resident => resident.status === filterStatus);
    }

    return filtered;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unapproved': return 'bg-orange-100 text-orange-800';
      case 'incomplete': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskCompletionStatus = (tasks: any) => {
    const taskValues = Object.values(tasks);
    const completed = taskValues.filter(task => task === true).length;
    const total = taskValues.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const handleTaskToggle = (residentId: string, taskType: 'residentTasks' | 'operatorTasks', taskKey: string) => {
    console.log(`Toggling ${taskType}.${taskKey} for resident ${residentId}`);
    
    setMoveInResidents(prevResidents => 
      prevResidents.map(resident => {
        if (resident.id === residentId) {
          return {
            ...resident,
            [taskType]: {
              ...resident[taskType],
              [taskKey]: !resident[taskType][taskKey]
            }
          };
        }
        return resident;
      })
    );

    // Update selectedResident if it's the one being modified
    if (selectedResident && selectedResident.id === residentId) {
      setSelectedResident(prev => ({
        ...prev,
        [taskType]: {
          ...prev[taskType],
          [taskKey]: !prev[taskType][taskKey]
        }
      }));
    }
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value as 'unapproved' | 'incomplete' | 'all');
  };

  const handleTaskFilterChange = (value: string) => {
    setTaskFilter(value as 'all' | 'resident' | 'operator');
  };

  const filteredResidents = getFilteredResidents();

  // If viewing a specific resident's details
  if (selectedResident) {
    const residentTaskStatus = getTaskCompletionStatus(selectedResident.residentTasks);
    const operatorTaskStatus = getTaskCompletionStatus(selectedResident.operatorTasks);

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
              <h1 className="text-2xl font-bold text-gray-900">Move-In Tracker</h1>
              <p className="text-gray-600">{selectedResident.name} - Unit {selectedResident.unit}</p>
            </div>
          </div>
        </div>

        {/* Task Filter for Detail View */}
        <div className="mb-6">
          <Select value={taskFilter} onValueChange={handleTaskFilterChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="resident">Resident Tasks</SelectItem>
              <SelectItem value="operator">Management Tasks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Move-In Overview</CardTitle>
                <Badge className={getStatusColor(selectedResident.status)}>
                  {selectedResident.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Move-In Date</span>
                  <p className="font-medium">{new Date(selectedResident.moveInDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  <p className="font-medium">
                    {Math.round(((residentTaskStatus.completed + operatorTaskStatus.completed) / 
                      (residentTaskStatus.total + operatorTaskStatus.total)) * 100)}% Complete
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resident Tasks */}
          {(taskFilter === 'all' || taskFilter === 'resident') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Resident Tasks</span>
                  <Badge variant="outline">
                    {residentTaskStatus.completed}/{residentTaskStatus.total} Complete
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(selectedResident.residentTasks).map(([key, completed]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                    <Checkbox
                      checked={completed as boolean}
                      onCheckedChange={() => handleTaskToggle(selectedResident.id, 'residentTasks', key)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Operator Tasks */}
          {(taskFilter === 'all' || taskFilter === 'operator') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Management Tasks</span>
                  <Badge variant="outline">
                    {operatorTaskStatus.completed}/{operatorTaskStatus.total} Complete
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(selectedResident.operatorTasks).map(([key, completed]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-500" />
                      )}
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                    <Checkbox
                      checked={completed as boolean}
                      onCheckedChange={() => handleTaskToggle(selectedResident.id, 'operatorTasks', key)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Main list view
  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Move-In Tracker</h1>
            <p className="text-gray-600">Track resident move-in progress and tasks</p>
          </div>
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
        <Select value={filterStatus} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Residents</SelectItem>
            <SelectItem value="unapproved">Unapproved</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
          </SelectContent>
        </Select>
        <Select value={taskFilter} onValueChange={handleTaskFilterChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="resident">Resident Tasks</SelectItem>
            <SelectItem value="operator">Management Tasks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Residents List */}
      <div className="space-y-4">
        {filteredResidents.map((resident) => {
          const residentTaskStatus = getTaskCompletionStatus(resident.residentTasks);
          const operatorTaskStatus = getTaskCompletionStatus(resident.operatorTasks);
          
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
                          <Truck className="w-5 h-5 text-blue-600" />
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
                        <span>Resident: {residentTaskStatus.completed}/{residentTaskStatus.total}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Home className="w-4 h-4" />
                        <span>Management: {operatorTaskStatus.completed}/{operatorTaskStatus.total}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(resident.status)}>
                        {resident.status.replace('_', ' ')}
                      </Badge>
                      <div className="text-sm font-medium text-gray-600">
                        {Math.round(((residentTaskStatus.completed + operatorTaskStatus.completed) / 
                          (residentTaskStatus.total + operatorTaskStatus.total)) * 100)}% Complete
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
            <Truck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No move-ins found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoveInTracker;
