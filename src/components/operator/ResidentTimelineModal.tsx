
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  Download,
  Send,
  ArrowLeft,
  MessageSquare
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
  const [messageText, setMessageText] = useState('');
  const [expandedStep, setExpandedStep] = useState<any>(null);

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
        documents: ['Application.pdf', 'Income Verification.pdf', 'References.pdf'],
        notes: 'Application fee paid, background check initiated. All required documentation submitted successfully.',
        timeline: [
          { user: 'Sarah Chen', action: 'Submitted application', time: 'Dec 1, 2023 at 2:30 PM' },
          { user: 'System', action: 'Application fee processed', time: 'Dec 1, 2023 at 2:31 PM' },
          { user: 'Leasing Team', action: 'Background check initiated', time: 'Dec 1, 2023 at 3:00 PM' }
        ]
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
        documents: ['Approval Letter.pdf', 'Credit Report.pdf', 'Background Check.pdf'],
        notes: 'Background check passed with excellent credit score. Income verification complete at 3.2x rent ratio.',
        timeline: [
          { user: 'Background Service', action: 'Background check completed', time: 'Dec 8, 2023 at 9:15 AM' },
          { user: 'Leasing Manager', action: 'Application approved', time: 'Dec 8, 2023 at 10:30 AM' },
          { user: 'System', action: 'Approval notification sent', time: 'Dec 8, 2023 at 10:31 AM' }
        ]
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
        documents: ['Lease Agreement.pdf', 'Move-in Instructions.pdf', 'Parking Agreement.pdf'],
        notes: 'Security deposit and first month rent collected. Move-in date scheduled for January 10th.',
        timeline: [
          { user: 'Sarah Chen', action: 'E-signed lease agreement', time: 'Dec 15, 2023 at 4:20 PM' },
          { user: 'Property Manager', action: 'Countersigned lease', time: 'Dec 15, 2023 at 4:45 PM' },
          { user: 'Accounting', action: 'Payment processed', time: 'Dec 15, 2023 at 5:00 PM' }
        ]
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
        documents: ['Move-in Checklist.pdf', 'Unit Inspection.pdf', 'Key Receipt.pdf'],
        notes: 'Unit cleaned and inspected. Keys programmed and ready. Utilities activated.',
        timeline: [
          { user: 'Maintenance', action: 'Unit cleaning completed', time: 'Jan 9, 2024 at 2:00 PM' },
          { user: 'Maintenance', action: 'Final inspection passed', time: 'Jan 10, 2024 at 9:00 AM' },
          { user: 'Leasing', action: 'Keys programmed', time: 'Jan 10, 2024 at 10:00 AM' }
        ]
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
        documents: ['Move-in Inspection.pdf', 'Welcome Package.pdf', 'Utility Setup.pdf'],
        notes: 'Walk-through completed successfully. Welcome package delivered. No issues reported.',
        timeline: [
          { user: 'Sarah Chen', action: 'Arrived for move-in', time: 'Jan 15, 2024 at 10:00 AM' },
          { user: 'Leasing Team', action: 'Walk-through completed', time: 'Jan 15, 2024 at 10:30 AM' },
          { user: 'Leasing Team', action: 'Keys handed over', time: 'Jan 15, 2024 at 11:00 AM' }
        ]
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
        documents: ['Check-in Survey.pdf', 'Satisfaction Report.pdf'],
        notes: 'Resident satisfaction survey completed. High satisfaction score. No maintenance issues.',
        timeline: [
          { user: 'System', action: 'Check-in survey sent', time: 'Feb 14, 2024 at 9:00 AM' },
          { user: 'Sarah Chen', action: 'Survey completed', time: 'Feb 15, 2024 at 3:20 PM' },
          { user: 'Leasing Team', action: 'Follow-up call completed', time: 'Feb 16, 2024 at 11:00 AM' }
        ]
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
        documents: ['Renewal Offer.pdf', 'Market Analysis.pdf'],
        notes: 'Renewal terms presented 90 days before expiration. Competitive market rate offered.',
        timeline: [
          { user: 'System', action: 'Renewal notice generated', time: 'Oct 15, 2024 at 9:00 AM' },
          { user: 'Leasing Team', action: 'Renewal offer sent', time: 'Oct 15, 2024 at 10:30 AM' }
        ]
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
        documents: ['Notice to Vacate.pdf', 'Move-out Instructions.pdf'],
        notes: '30-day notice provided as required. Move-out inspection scheduled.',
        timeline: [
          { user: 'Sarah Chen', action: 'Notice to vacate submitted', time: 'Nov 15, 2024 at 2:15 PM' },
          { user: 'Leasing Team', action: 'Notice acknowledged', time: 'Nov 15, 2024 at 3:00 PM' },
          { user: 'System', action: 'Move-out process initiated', time: 'Nov 15, 2024 at 3:01 PM' }
        ]
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
        documents: ['Move-out Checklist.pdf', 'Cleaning Requirements.pdf'],
        notes: 'Pre-move-out inspection scheduled. Cleaning requirements communicated.',
        timeline: [
          { user: 'Leasing Team', action: 'Pre-inspection scheduled', time: 'Dec 5, 2024 at 9:00 AM' },
          { user: 'Maintenance', action: 'Cleaning requirements sent', time: 'Dec 5, 2024 at 10:00 AM' }
        ]
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
        notes: 'Final walkthrough scheduled. Damage assessment to be completed.',
        timeline: []
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
        notes: 'Deposit return to be processed within 30 days per state law.',
        timeline: []
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

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log(`Sending message for ${expandedStep?.title}:`, messageText);
      setMessageText('');
      // In a real app, this would send the message
    }
  };

  const handleDownloadDocument = (docName: string) => {
    console.log(`Downloading document: ${docName}`);
    // In a real app, this would trigger the download
  };

  const pendingSteps = timelineSteps.filter(step => step.status === 'pending' || step.status === 'in-progress');
  const mostPendingStep = pendingSteps[0];

  // Full screen expanded view
  if (expandedStep) {
    return (
      <Dialog open={true} onOpenChange={() => setExpandedStep(null)}>
        <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 m-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedStep(null)}
                  className="p-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className={`w-10 h-10 rounded-full ${expandedStep.bgColor} flex items-center justify-center`}>
                  <expandedStep.icon className={`w-5 h-5 ${expandedStep.color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{expandedStep.title}</h2>
                  <p className="text-gray-600">{expandedStep.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Nudge
                </Button>
                <Button variant="destructive">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Mark Urgent
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Status and Date */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">Status</span>
                        <div className="mt-1">{getStatusBadge(expandedStep.status)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Date</span>
                        <p className="font-medium">{new Date(expandedStep.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Send Message */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Send Message to Maintenance</h3>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Type your message here..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="min-h-[120px]"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="w-full"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                    <div className="space-y-4">
                      {expandedStep.timeline.map((entry: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">{entry.user}</p>
                            <p className="text-gray-600">{entry.action}</p>
                            <p className="text-sm text-gray-500">{entry.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Documents</h3>
                    <div className="space-y-3">
                      {expandedStep.documents.map((doc: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">{doc}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Notes</h3>
                    <p className="text-gray-700">{expandedStep.notes}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Resident Timeline - {residentName}</span>
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
                  <Card className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setExpandedStep(step)}>
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
                        <span>💬 {step.timeline.length} activities</span>
                      </div>
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
