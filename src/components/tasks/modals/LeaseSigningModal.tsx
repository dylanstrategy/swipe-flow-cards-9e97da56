
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, FileText, Pen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeaseSigningModalProps {
  onClose: () => void;
  onComplete: () => void;
  taskTitle: string;
}

const LeaseSigningModal = ({ onClose, onComplete, taskTitle }: LeaseSigningModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');

  const handleSign = () => {
    if (!agreed || !signature.trim()) {
      toast({
        title: "Please complete all required fields",
        description: "You must agree to terms and provide a signature",
        variant: "destructive"
      });
      return;
    }

    onComplete();
    toast({
      title: "Lease Signed Successfully",
      description: "Your lease has been digitally signed and submitted.",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Digital Lease Signing</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Lease Terms Review</h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <p>• Monthly Rent: $1,550</p>
                  <p>• Security Deposit: $1,550</p>
                  <p>• Lease Term: 12 months</p>
                  <p>• Move-in Date: March 1, 2025</p>
                  <p>• Pet Policy: 1 pet allowed with deposit</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I have read and agree to all lease terms and conditions. I understand this constitutes a legally binding agreement.
                  </label>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                disabled={!agreed}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Proceed to Signature
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Signature
                </label>
                <input
                  type="text"
                  placeholder="Type your full legal name"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  By typing your name, you agree this serves as your legal digital signature
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back to Review
                </Button>
                <Button onClick={handleSign} className="flex-1">
                  <Pen className="w-4 h-4 mr-2" />
                  Sign Lease
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaseSigningModal;
