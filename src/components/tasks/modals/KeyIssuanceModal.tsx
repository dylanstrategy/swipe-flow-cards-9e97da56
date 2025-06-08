
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Key, User, FileText } from 'lucide-react';
import { EventTask } from '@/types/eventTasks';

interface KeyIssuanceModalProps {
  task: EventTask;
  onClose: () => void;
  onComplete: () => void;
}

const KeyIssuanceModal = ({ task, onClose, onComplete }: KeyIssuanceModalProps) => {
  const [recipientName, setRecipientName] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [keyNumbers, setKeyNumbers] = useState('');
  const [notes, setNotes] = useState('');
  const [idVerified, setIdVerified] = useState(false);
  const [keysIssued, setKeysIssued] = useState(false);
  const [documentationComplete, setDocumentationComplete] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const canComplete = recipientName.trim() && recipientId.trim() && keyNumbers.trim() && 
                     idVerified && keysIssued && documentationComplete && confirmed;

  const handleComplete = () => {
    if (canComplete) {
      console.log('Key issuance completed:', {
        taskId: task.id,
        recipient: recipientName,
        id: recipientId,
        keys: keyNumbers,
        notes
      });
      onComplete();
    }
  };

  const handleVerifyId = () => {
    if (recipientName.trim() && recipientId.trim()) {
      setIdVerified(true);
    }
  };

  const handleIssueKeys = () => {
    if (keyNumbers.trim() && idVerified) {
      setKeysIssued(true);
    }
  };

  const handleCompleteDocumentation = () => {
    if (keysIssued) {
      setDocumentationComplete(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold">{task.title}</h3>
        </div>
        
        <p className="text-gray-600 mb-4">{task.description}</p>
        
        <div className="space-y-4">
          {/* Recipient Information */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Recipient Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                ID Number: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="ID/License #"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Key Information */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Key Numbers: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={keyNumbers}
              onChange={(e) => setKeyNumbers(e.target.value)}
              placeholder="Key serial numbers (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Notes:
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or notes..."
              rows={2}
            />
          </div>

          {/* Process Checklist */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Issuance Process:</h4>
            
            {/* Verify ID */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Verify Recipient ID</span>
              </div>
              <Button
                size="sm"
                variant={idVerified ? "default" : "outline"}
                onClick={handleVerifyId}
                disabled={!recipientName.trim() || !recipientId.trim() || idVerified}
              >
                {idVerified ? '✓ Verified' : 'Verify'}
              </Button>
            </div>

            {/* Issue Keys */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Issue Keys</span>
              </div>
              <Button
                size="sm"
                variant={keysIssued ? "default" : "outline"}
                onClick={handleIssueKeys}
                disabled={!keyNumbers.trim() || !idVerified || keysIssued}
              >
                {keysIssued ? '✓ Issued' : 'Issue'}
              </Button>
            </div>

            {/* Complete Documentation */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Complete Documentation</span>
              </div>
              <Button
                size="sm"
                variant={documentationComplete ? "default" : "outline"}
                onClick={handleCompleteDocumentation}
                disabled={!keysIssued || documentationComplete}
              >
                {documentationComplete ? '✓ Complete' : 'Complete'}
              </Button>
            </div>
          </div>

          {/* Final Confirmation */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="key-confirmation"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="key-confirmation" className="text-sm">
              I confirm all keys have been issued and documented properly
            </label>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={!canComplete}
            className="flex-1"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Issuance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeyIssuanceModal;
