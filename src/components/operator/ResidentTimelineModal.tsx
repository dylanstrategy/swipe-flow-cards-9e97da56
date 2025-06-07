
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  PenTool, 
  Key, 
  Truck, 
  Home, 
  RefreshCw, 
  DollarSign,
  UserPlus,
  FileCheck,
  Calendar,
  X
} from 'lucide-react';

interface ResidentTimelineModalProps {
  open: boolean;
  onClose: () => void;
  residentName: string;
  residentStatus: string;
}

const ResidentTimelineModal: React.FC<ResidentTimelineModalProps> = ({
  open,
  onClose,
  residentName,
  residentStatus
}) => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  // Timeline steps from application to move-out
  const getTimelineSteps = (status: string) => {
    const allSteps = [
      {
        id: 'application',
        title: 'Application Submitted',
        description: 'Rental application completed and submitted',
        status: 'completed',
        date: '2023-12-01',
        icon: UserPlus,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        documents: ['Application.pdf', 'Income Verification.pdf'],
        notes: 'Application fee paid, background check initiated'
      },
      {
        id: 'approval',
        title: 'Application Approved',
        description: 'Application approved, lease ready for signature',
        status: 'completed',
        date: '2023-12-08',
        icon: FileCheck,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        documents: ['Approval Letter.pdf', 'Credit Report.pdf'],
        notes: 'Background check passed, income verified'
      },
      {
        id: 'lease-signing',
        title: 'Lease Agreement Signed',
        description: 'Lease agreement executed by all parties',
        status: 'completed',
        date: '2023-12-15',
        icon: PenTool,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        documents: ['Lease Agreement.pdf', 'Move-in Instructions.pdf'],
        notes: 'Security deposit and first month rent collected'
      },
      {
        id: 'move-in-prep',
        title: 'Move-In Preparation',
        description: 'Unit preparation and key handover',
        status: status === 'prospect' ? 'pending' : 'completed',
        date: '2024-01-10',
        icon: Key,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        documents: ['Move-in Checklist.pdf', 'Unit Inspection.pdf'],
        notes: 'Unit cleaned, keys programmed, utilities activated'
      },
      {
        id: 'move-in',
        title: 'Move-In Complete',
        description: 'Resident successfully moved in',
        status: status === 'prospect' || status === 'future' ? 'pending' : 'completed',
        date: '2024-01-15',
        icon: Truck,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
        documents: ['Move-in Inspection.pdf', 'Welcome Package.pdf'],
        notes: 'Walk-through completed, resident oriented'
      },
      {
        id: 'first-month',
        title: 'First Month Check-in',
        description: '30-day follow-up with resident',
        status: status === 'current' ? 'completed' : 'pending',
        date: '2024-02-15',
        icon: Calendar,
        color: 'text-teal-600',
        bgColor: 'bg-teal-100',
        documents: ['Check-in Survey.pdf'],
        notes: 'Resident satisfaction survey, any issues addressed'
      },
      {
        id: 'lease-renewal',
        title: 'Lease Renewal Offer',
        description: 'Renewal offer presented to resident',
        status: status === 'current' ? (Math.random() > 0.5 ? 'completed' : 'pending') : 'pending',
        date: '2024-10-15',
        icon: RefreshCw,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        documents: ['Renewal Offer.pdf'],
        notes: 'Renewal terms presented 90 days before expiration'
      },
      {
        id: 'notice-to-vacate',
        title: 'Notice to Vacate',
        description: 'Resident provides move-out notice',
        status: status === 'notice' ? 'completed' : 'pending',
        date: '2024-11-15',
        icon: AlertCircle,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        documents: ['Notice to Vacate.pdf'],
        notes: '30-day notice provided, move-out inspection scheduled'
      },
      {
        id: 'move-out-prep',
        title: 'Move-Out Preparation',
        description: 'Move-out inspection and preparation',
        status: status === 'notice' ? 'in-progress' : 'pending',
        date: '2024-12-10',
        icon: Home,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        documents: ['Move-out Checklist.pdf', 'Damage Assessment.pdf'],
        notes: 'Final inspection scheduled, cleaning requirements reviewed'
      },
      {
        id: 'move-out',
        title: 'Move-Out Complete',
        description: 'Resident moved out, unit returned',
        status: 'pending',
        date: '2024-12-15',
        icon: Truck,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        documents: ['Final Inspection.pdf', 'Key Return.pdf'],
        notes: 'Keys returned, final walkthrough completed'
      },
      {
        id: 'deposit-disposition',
        title: 'Security Deposit Disposition',
        description: 'Security deposit processed and returned',
        status: 'pending',
        date: '2024-12-30',
        icon: DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        documents: ['Deposit Disposition.pdf'],
        notes: 'Deposit return processed within 30 days'
      }
    ];

    // Filter steps based on resident status to show relevant timeline
    if (status === 'prospect') {
      return allSteps.slice(0, 4);
    } else if (status === 'future') {
      return allSteps.slice(0, 6);
    } else if (status === 'current') {
      return allSteps.slice(0, 7);
    } else if (status === 'notice') {
      return allSteps.slice(0, 10);
    } else {
      return allSteps;
    }
  };

  const timelineSteps = getTimelineSteps(residentStatus);

  const getStatusIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };

  const pendingSteps = timelineSteps.filter(step => step.status === 'pending' || step.status === 'in-progress');
  const mostPendingStep = pendingSteps[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Resident Timeline - {residentName}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[75vh] pr-2">
          {/* Next Action Alert */}
          {mostPendingStep && (
            <Card className="mb-6 border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${mostPendingStep.bgColor} flex items-center justify-center`}>
                    <mostPendingStep.icon className={`w-4 h-4 ${mostPendingStep.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900">Next Action Required</h3>
                    <p className="text-sm text-gray-600">{mostPendingStep.title}</p>
                  </div>
                  {getStatusBadge(mostPendingStep.status)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            {timelineSteps.map((step, index) => (
              <div key={step.id} className="relative flex items-start space-x-4 pb-6">
                {/* Timeline dot */}
                <div className={`relative z-10 w-12 h-12 rounded-full ${step.bgColor} flex items-center justify-center border-4 border-white shadow-sm`}>
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Card className={`${selectedStep === step.id ? 'ring-2 ring-blue-500' : ''} cursor-pointer hover:shadow-md transition-shadow`}
                        onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{step.title}</h3>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(step.status)}
                          {getStatusBadge(step.status)}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📅 {new Date(step.date).toLocaleDateString()}</span>
                        <span>📄 {step.documents.length} documents</span>
                      </div>

                      {/* Expanded details */}
                      {selectedStep === step.id && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm text-gray-900 mb-1">Documents</h4>
                              <div className="space-y-1">
                                {step.documents.map((doc, docIndex) => (
                                  <div key={docIndex} className="flex items-center space-x-2 text-sm">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="text-blue-600 hover:underline cursor-pointer">{doc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {step.notes && (
                              <div>
                                <h4 className="font-medium text-sm text-gray-900 mb-1">Notes</h4>
                                <p className="text-sm text-gray-600">{step.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResidentTimelineModal;
