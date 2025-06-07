
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  MessageSquare, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Home,
  PenTool,
  Key,
  Truck,
  RefreshCw,
  X,
  Download,
  Send,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface MoveProgressTrackerProps {
  onClose: () => void;
  residentId?: string;
}

const MoveProgressTracker: React.FC<MoveProgressTrackerProps> = ({ onClose, residentId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Mock resident data with complete lifecycle tracking
  const residents = [
    {
      id: '1',
      name: 'Sarah Chen',
      unit: '402',
      phone: '(555) 123-4567',
      email: 'sarah.chen@email.com',
      currentStatus: 'current',
      leaseStartDate: '2024-01-15',
      leaseEndDate: '2025-01-14',
      moveInDate: '2024-01-15',
      renewalDue: '2024-10-15',
      milestones: [
        {
          id: 'lease-signed',
          title: 'Lease Agreement Signed',
          type: 'lease',
          status: 'completed',
          date: '2023-12-20',
          completedDate: '2023-12-20',
          description: '12-month lease agreement executed',
          documents: ['lease-agreement.pdf', 'addendums.pdf'],
          actions: ['Download Lease', 'View Addendums'],
          messages: 2,
          icon: PenTool,
          color: 'bg-blue-500'
        },
        {
          id: 'move-in-prep',
          title: 'Move-In Preparation',
          type: 'preparation',
          status: 'completed',
          date: '2024-01-10',
          completedDate: '2024-01-14',
          description: 'Unit preparation and key handover',
          documents: ['move-in-checklist.pdf', 'keys-inventory.pdf'],
          actions: ['View Checklist', 'Key History'],
          messages: 5,
          icon: Key,
          color: 'bg-purple-500'
        },
        {
          id: 'move-in',
          title: 'Move-In Complete',
          type: 'move-in',
          status: 'completed',
          date: '2024-01-15',
          completedDate: '2024-01-15',
          description: 'Resident successfully moved in',
          documents: ['move-in-inspection.pdf', 'welcome-package.pdf'],
          actions: ['View Inspection', 'Welcome Materials'],
          messages: 3,
          icon: Truck,
          color: 'bg-green-500'
        },
        {
          id: 'first-month',
          title: 'First Month Check-in',
          type: 'check-in',
          status: 'completed',
          date: '2024-02-15',
          completedDate: '2024-02-12',
          description: 'Initial satisfaction survey and adjustments',
          documents: ['satisfaction-survey.pdf'],
          actions: ['View Survey Results'],
          messages: 1,
          icon: CheckCircle2,
          color: 'bg-teal-500'
        },
        {
          id: 'renewal-notice',
          title: 'Renewal Notice Sent',
          type: 'renewal',
          status: 'completed',
          date: '2024-10-15',
          completedDate: '2024-10-10',
          description: 'Lease renewal options presented',
          documents: ['renewal-notice.pdf', 'rate-options.pdf'],
          actions: ['View Renewal Terms', 'Rate Analysis'],
          messages: 4,
          icon: RefreshCw,
          color: 'bg-orange-500'
        },
        {
          id: 'renewal-signed',
          title: 'Renewal Executed',
          type: 'renewal',
          status: 'completed',
          date: '2024-11-01',
          completedDate: '2024-10-28',
          description: '12-month lease renewal signed',
          documents: ['renewal-lease.pdf'],
          actions: ['Download Renewal'],
          messages: 2,
          icon: PenTool,
          color: 'bg-blue-500'
        }
      ]
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      unit: '318',
      phone: '(555) 234-5678',
      email: 'michael.r@email.com',
      currentStatus: 'notice',
      leaseStartDate: '2023-06-01',
      leaseEndDate: '2024-05-31',
      moveInDate: '2023-06-01',
      moveOutDate: '2024-06-15',
      milestones: [
        {
          id: 'lease-signed',
          title: 'Lease Agreement Signed',
          type: 'lease',
          status: 'completed',
          date: '2023-05-15',
          completedDate: '2023-05-15',
          description: '12-month lease agreement executed',
          documents: ['lease-agreement.pdf'],
          actions: ['Download Lease'],
          messages: 1,
          icon: PenTool,
          color: 'bg-blue-500'
        },
        {
          id: 'move-in',
          title: 'Move-In Complete',
          type: 'move-in',
          status: 'completed',
          date: '2023-06-01',
          completedDate: '2023-06-01',
          description: 'Resident successfully moved in',
          documents: ['move-in-inspection.pdf'],
          actions: ['View Inspection'],
          messages: 2,
          icon: Truck,
          color: 'bg-green-500'
        },
        {
          id: 'notice-given',
          title: 'Notice to Vacate',
          type: 'move-out',
          status: 'completed',
          date: '2024-04-15',
          completedDate: '2024-04-15',
          description: '60-day notice submitted',
          documents: ['notice-to-vacate.pdf'],
          actions: ['View Notice'],
          messages: 3,
          icon: AlertCircle,
          color: 'bg-red-500'
        },
        {
          id: 'move-out-prep',
          title: 'Move-Out Preparation',
          type: 'move-out',
          status: 'in-progress',
          date: '2024-06-10',
          description: 'Preparing for move-out inspection',
          documents: ['move-out-checklist.pdf'],
          actions: ['Schedule Inspection', 'Checklist Review'],
          messages: 1,
          icon: Clock,
          color: 'bg-yellow-500'
        },
        {
          id: 'move-out',
          title: 'Move-Out Complete',
          type: 'move-out',
          status: 'pending',
          date: '2024-06-15',
          description: 'Final move-out and unit handover',
          documents: [],
          actions: ['Schedule Final Inspection'],
          messages: 0,
          icon: Truck,
          color: 'bg-gray-400'
        }
      ]
    }
  ];

  const getFilteredResidents = () => {
    if (residentId) {
      return residents.filter(resident => resident.id === residentId);
    }
    
    if (searchTerm) {
      return residents.filter(resident => 
        resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.unit.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return residents;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResidentStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'notice': return 'bg-orange-100 text-orange-800';
      case 'future': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = () => {
    console.log('Sending message for milestone:', selectedMilestone?.title);
    console.log('Message:', messageText);
    setMessageText('');
    setShowMessageDialog(false);
  };

  const filteredResidents = getFilteredResidents();

  // Detail view for specific resident
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
              <h1 className="text-2xl font-bold text-gray-900">Move Progress Tracker</h1>
              <p className="text-gray-600">{selectedResident.name} - Unit {selectedResident.unit}</p>
            </div>
          </div>
        </div>

        {/* Resident Info Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedResident.name}</h3>
                  <p className="text-sm text-gray-600">Unit {selectedResident.unit}</p>
                </div>
              </div>
              <Badge className={getResidentStatusColor(selectedResident.currentStatus)}>
                {selectedResident.currentStatus}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{selectedResident.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{selectedResident.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Lease: {new Date(selectedResident.leaseStartDate).toLocaleDateString()} - {new Date(selectedResident.leaseEndDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
            {selectedResident.milestones.map((milestone: any, index: number) => {
              const IconComponent = milestone.icon;
              
              return (
                <div key={milestone.id} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-12 h-12 ${milestone.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <IconComponent className="text-white" size={20} />
                  </div>
                  
                  {/* Milestone content */}
                  <div className="ml-4 flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                      <Badge className={getStatusColor(milestone.status)}>
                        {milestone.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{milestone.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Target Date:</span>
                        <p className="font-medium">{new Date(milestone.date).toLocaleDateString()}</p>
                      </div>
                      {milestone.completedDate && (
                        <div>
                          <span className="text-gray-500">Completed:</span>
                          <p className="font-medium text-green-600">{new Date(milestone.completedDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {milestone.documents.map((doc: string, i: number) => (
                        <Button key={i} variant="outline" size="sm" className="text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          {doc.replace('.pdf', '')}
                        </Button>
                      ))}
                      {milestone.actions.map((action: string, i: number) => (
                        <Button key={i} variant="outline" size="sm" className="text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          {action}
                        </Button>
                      ))}
                    </div>

                    {/* Messages */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        <span>{milestone.messages} messages</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedMilestone(milestone);
                          setShowMessageDialog(true);
                        }}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Dialog */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message - {selectedMilestone?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage}>
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
            <h1 className="text-2xl font-bold text-gray-900">Move Progress Tracker</h1>
            <p className="text-gray-600">Track resident lifecycle milestones</p>
          </div>
        </div>
      </div>

      {/* Search */}
      {!residentId && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search residents or units..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Residents List */}
      <div className="space-y-4">
        {filteredResidents.map((resident) => {
          const completedMilestones = resident.milestones.filter(m => m.status === 'completed').length;
          const totalMilestones = resident.milestones.length;
          const progress = Math.round((completedMilestones / totalMilestones) * 100);
          
          return (
            <Card 
              key={resident.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedResident(resident)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Home className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{resident.name}</h3>
                      <p className="text-sm text-gray-600">Unit {resident.unit}</p>
                    </div>
                  </div>
                  <Badge className={getResidentStatusColor(resident.currentStatus)}>
                    {resident.currentStatus}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{progress}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Lease: {new Date(resident.leaseStartDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{completedMilestones}/{totalMilestones} milestones</span>
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
            <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No residents found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoveProgressTracker;
