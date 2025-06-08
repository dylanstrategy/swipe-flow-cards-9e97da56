
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, CheckCircle, Hash } from 'lucide-react';
import { EventTask } from '@/types/eventTasks';

interface KeyIssuanceModalProps {
  task: EventTask;
  onClose: () => void;
  onComplete: () => void;
}

const KeyIssuanceModal = ({ task, onClose, onComplete }: KeyIssuanceModalProps) => {
  const [keyNumber, setKeyNumber] = useState('');
  const [residentConfirmed, setResidentConfirmed] = useState(false);
  const [issuanceComplete, setIssuanceComplete] = useState(false);

  const generateKeyNumber = () => {
    const number = 'K' + Math.floor(1000 + Math.random() * 9000).toString();
    setKeyNumber(number);
  };

  const canComplete = keyNumber && residentConfirmed;

  const handleComplete = () => {
    if (canComplete) {
      console.log('Key issuance completed:', keyNumber);
      setIssuanceComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  if (issuanceComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Keys Issued Successfully!</h3>
          <p className="text-gray-600">Key #{keyNumber} has been provided to the resident.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold">Issue Unit Keys</h3>
        </div>
        
        <p className="text-gray-600 mb-4">{task.description}</p>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Key Number:
            </label>
            <div className="flex gap-2">
              <Input
                value={keyNumber}
                onChange={(e) => setKeyNumber(e.target.value)}
                placeholder="Enter key number"
              />
              <Button onClick={generateKeyNumber} variant="outline">
                <Hash className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="resident-confirmed"
              checked={residentConfirmed}
              onChange={(e) => setResidentConfirmed(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="resident-confirmed" className="text-sm">
              Resident has confirmed receipt of keys
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={!canComplete}
            className="flex-1"
          >
            <Key className="w-4 h-4 mr-2" />
            Confirm Issuance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeyIssuanceModal;
