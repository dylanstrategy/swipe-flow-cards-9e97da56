
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, User, Clock, AlertTriangle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentEventDetailsProps {
  event: any;
  userRole: string;
}

const PaymentEventDetails = ({ event, userRole }: PaymentEventDetailsProps) => {
  const { toast } = useToast();

  const paymentInfo = {
    resident: 'John Smith',
    unit: event.unit,
    amount: '$1,550',
    dueDate: 'June 1, 2025',
    daysOverdue: 3,
    lateFee: '$75',
    totalOwed: '$1,625',
    lastPayment: 'May 1, 2025'
  };

  const handleMakeCall = () => {
    toast({
      title: "Call Initiated",
      description: "Phone call started with resident",
    });
  };

  const handleSendNotice = () => {
    toast({
      title: "Notice Sent",
      description: "Payment reminder notice has been sent",
    });
  };

  const handleSetupPaymentPlan = () => {
    toast({
      title: "Payment Plan",
      description: "Payment plan setup initiated",
    });
  };

  const canManagePayments = userRole === 'operator';

  return (
    <div className="p-6 space-y-6">
      {/* Event Summary */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <div className="flex items-center gap-3 mb-3">
          <DollarSign className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-yellow-900">Payment Follow-up</h3>
          <Badge className="bg-red-100 text-red-800">URGENT</Badge>
        </div>
        <p className="text-sm text-yellow-800 mb-3">
          Late rent payment discussion - {paymentInfo.daysOverdue} days overdue
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-yellow-900">Unit:</span> {paymentInfo.unit}
          </div>
          <div>
            <span className="font-medium text-yellow-900">Amount Due:</span> {paymentInfo.totalOwed}
          </div>
          <div>
            <span className="font-medium text-yellow-900">Days Overdue:</span> {paymentInfo.daysOverdue}
          </div>
          <div>
            <span className="font-medium text-yellow-900">Time:</span> {event.time}
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <h4 className="font-medium text-red-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Payment Breakdown
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="font-medium">Monthly Rent:</span> {paymentInfo.amount}</div>
          <div><span className="font-medium">Late Fee:</span> {paymentInfo.lateFee}</div>
          <div><span className="font-medium">Due Date:</span> {paymentInfo.dueDate}</div>
          <div><span className="font-medium">Total Owed:</span> <span className="text-red-600 font-semibold">{paymentInfo.totalOwed}</span></div>
          <div><span className="font-medium">Last Payment:</span> {paymentInfo.lastPayment}</div>
          <div><span className="font-medium">Payment Status:</span> <span className="text-red-600">Overdue</span></div>
        </div>
      </div>

      {/* Resident Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          Resident Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="font-medium">Name:</span> {paymentInfo.resident}</div>
          <div><span className="font-medium">Unit:</span> {paymentInfo.unit}</div>
          <div><span className="font-medium">Phone:</span> (555) 567-8901</div>
          <div><span className="font-medium">Email:</span> john.smith@email.com</div>
          <div><span className="font-medium">Lease Status:</span> Active</div>
          <div><span className="font-medium">Previous Late Payments:</span> 2 in last 12 months</div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Recent Payment History</h4>
        <div className="space-y-2">
          {[
            { date: 'May 1, 2025', amount: '$1,550', status: 'Paid', days: 'On time' },
            { date: 'Apr 1, 2025', amount: '$1,550', status: 'Paid', days: '2 days late' },
            { date: 'Mar 1, 2025', amount: '$1,550', status: 'Paid', days: 'On time' }
          ].map((payment, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span>{payment.date}</span>
              <span>{payment.amount}</span>
              <span className={`${payment.days === 'On time' ? 'text-green-600' : 'text-yellow-600'}`}>
                {payment.days}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {canManagePayments && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-gray-200">
          <Button className="bg-red-600 hover:bg-red-700" onClick={handleMakeCall}>
            <Phone className="w-4 h-4 mr-2" />
            Call Resident
          </Button>
          <Button variant="outline" onClick={handleSendNotice}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Send Notice
          </Button>
          <Button variant="outline" onClick={handleSetupPaymentPlan}>
            <DollarSign className="w-4 h-4 mr-2" />
            Payment Plan
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentEventDetails;
