
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Clock, DollarSign, Calendar, CheckCircle, Download, ExternalLink, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeaseSigningEventDetailsProps {
  event: any;
  userRole: string;
}

const LeaseSigningEventDetails = ({ event, userRole }: LeaseSigningEventDetailsProps) => {
  const { toast } = useToast();

  const leaseDetails = {
    resident: 'Mike Chen',
    unit: event.unit,
    leaseType: 'Renewal',
    currentRent: '$1,650',
    newRent: '$1,750',
    leaseStart: 'July 1, 2025',
    leaseEnd: 'June 30, 2026',
    term: '12 months'
  };

  const documents = [
    { 
      id: 1,
      name: 'Lease Renewal Agreement', 
      status: 'ready', 
      required: true,
      action: 'sign',
      description: 'Main lease renewal document requiring signature'
    },
    { 
      id: 2,
      name: 'Rent Increase Notice', 
      status: 'ready', 
      required: true,
      action: 'review',
      description: 'Official notice of rent increase for new term'
    },
    { 
      id: 3,
      name: 'Property Rules & Regulations', 
      status: 'ready', 
      required: false,
      action: 'review',
      description: 'Updated property rules and community guidelines'
    },
    { 
      id: 4,
      name: 'Parking Agreement', 
      status: 'pending', 
      required: false,
      action: 'complete',
      description: 'Parking space assignment and terms'
    }
  ];

  const handleDocumentAction = (doc: any) => {
    switch (doc.action) {
      case 'sign':
        toast({
          title: "Opening Document for Signature",
          description: `Opening ${doc.name} in digital signing platform`,
        });
        break;
      case 'review':
        toast({
          title: "Opening Document",
          description: `Opening ${doc.name} for review`,
        });
        break;
      case 'complete':
        toast({
          title: "Document Processing",
          description: `Processing ${doc.name} - this may take a moment`,
        });
        break;
      default:
        toast({
          title: "Document Action",
          description: `Processing ${doc.name}`,
        });
    }
  };

  const getActionButton = (doc: any) => {
    if (doc.status === 'ready') {
      switch (doc.action) {
        case 'sign':
          return (
            <Button 
              size="sm" 
              onClick={() => handleDocumentAction(doc)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-8 min-w-0 flex-shrink-0"
            >
              <Edit className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Sign Now</span>
              <span className="sm:hidden">Sign</span>
            </Button>
          );
        case 'review':
          return (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleDocumentAction(doc)}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 h-8 min-w-0 flex-shrink-0"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              <span>Review</span>
            </Button>
          );
        default:
          return (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleDocumentAction(doc)}
              className="text-xs px-2 py-1 h-8 min-w-0 flex-shrink-0"
            >
              <Download className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">Get</span>
            </Button>
          );
      }
    } else if (doc.status === 'pending') {
      return (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => handleDocumentAction(doc)}
          className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 text-xs px-2 py-1 h-8 min-w-0 flex-shrink-0"
        >
          <Clock className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Complete Setup</span>
          <span className="sm:hidden">Setup</span>
        </Button>
      );
    }
    return null;
  };

  const handleStartSigning = () => {
    toast({
      title: "Lease Signing Started",
      description: "Digital signing process initiated",
    });
  };

  const handleReschedule = () => {
    toast({
      title: "Reschedule Request",
      description: "Lease signing reschedule request sent",
    });
  };

  const canManageLeases = userRole === 'operator';

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Event Summary */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
          <h3 className="font-semibold text-blue-900 text-sm sm:text-base">Lease Signing</h3>
          <Badge className="bg-blue-100 text-blue-800 text-xs">Medium Priority</Badge>
        </div>
        <p className="text-xs sm:text-sm text-blue-800 mb-3">
          {leaseDetails.leaseType} signing appointment for {leaseDetails.resident}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div>
            <span className="font-medium text-blue-900">Unit:</span> {leaseDetails.unit}
          </div>
          <div>
            <span className="font-medium text-blue-900">Type:</span> {leaseDetails.leaseType}
          </div>
          <div>
            <span className="font-medium text-blue-900">Time:</span> {event.time}
          </div>
          <div>
            <span className="font-medium text-blue-900">Duration:</span> 45 minutes
          </div>
        </div>
      </div>

      {/* Lease Details */}
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
          <DollarSign className="w-4 h-4" />
          Lease Terms
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div><span className="font-medium">Current Rent:</span> {leaseDetails.currentRent}</div>
          <div><span className="font-medium">New Rent:</span> {leaseDetails.newRent}</div>
          <div><span className="font-medium">Lease Start:</span> {leaseDetails.leaseStart}</div>
          <div><span className="font-medium">Lease End:</span> {leaseDetails.leaseEnd}</div>
          <div><span className="font-medium">Term:</span> {leaseDetails.term}</div>
          <div><span className="font-medium">Increase:</span> 
            <span className="text-orange-600 font-medium ml-1">
              +${parseInt(leaseDetails.newRent.replace('$', '').replace(',', '')) - parseInt(leaseDetails.currentRent.replace('$', '').replace(',', ''))}
            </span>
          </div>
        </div>
      </div>

      {/* Document Checklist - Now Actionable */}
      <div className="space-y-3 sm:space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2 text-sm sm:text-base">
          <FileText className="w-4 h-4" />
          Required Documents
        </h4>
        
        <div className="space-y-2 sm:space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors gap-3">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  doc.status === 'ready' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {doc.status === 'ready' && <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  {doc.status === 'pending' && <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    {doc.required && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200 self-start">
                        Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{doc.description}</p>
                  <p className="text-xs text-gray-400">
                    Status: {doc.status === 'ready' ? 'Ready for action' : 'Pending completion'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                {doc.status === 'ready' && (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs flex-shrink-0">
                    Ready
                  </Badge>
                )}
                {doc.status === 'pending' && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 text-xs flex-shrink-0">
                    Pending
                  </Badge>
                )}
                {getActionButton(doc)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resident Information */}
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
          <User className="w-4 h-4" />
          Resident Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div><span className="font-medium">Name:</span> {leaseDetails.resident}</div>
          <div><span className="font-medium">Current Unit:</span> {leaseDetails.unit}</div>
          <div><span className="font-medium">Lease Type:</span> {leaseDetails.leaseType}</div>
          <div><span className="font-medium">Phone:</span> (555) 234-5678</div>
        </div>
      </div>

      {/* Actions */}
      {canManageLeases && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm h-10" onClick={handleStartSigning}>
            <FileText className="w-4 h-4 mr-2" />
            Start Signing Process
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none text-sm h-10" onClick={handleReschedule}>
            <Calendar className="w-4 h-4 mr-2" />
            Reschedule
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeaseSigningEventDetails;
