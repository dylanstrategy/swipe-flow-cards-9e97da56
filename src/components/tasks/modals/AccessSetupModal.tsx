
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Key, Wifi, CreditCard } from 'lucide-react';
import { EventTask } from '@/types/eventTasks';

interface AccessSetupModalProps {
  task: EventTask;
  onClose: () => void;
  onComplete: () => void;
}

const AccessSetupModal = ({ task, onClose, onComplete }: AccessSetupModalProps) => {
  const [setupNotes, setSetupNotes] = useState('');
  const [keyAccess, setKeyAccess] = useState(false);
  const [digitalAccess, setDigitalAccess] = useState(false);
  const [amenityAccess, setAmenityAccess] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const canComplete = setupNotes.trim() && keyAccess && digitalAccess && amenityAccess && confirmed;

  const handleComplete = () => {
    if (canComplete) {
      console.log('Access setup completed:', {
        taskId: task.id,
        notes: setupNotes,
        keyAccess,
        digitalAccess,
        amenityAccess
      });
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">{task.title}</h3>
        </div>
        
        <p className="text-gray-600 mb-4">{task.description}</p>
        
        <div className="space-y-4">
          {/* Setup Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Setup Notes: <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={setupNotes}
              onChange={(e) => setSetupNotes(e.target.value)}
              placeholder="Document access setup details and any special instructions..."
              rows={3}
            />
          </div>

          {/* Access Types */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Access Setup Checklist:</h4>
            
            {/* Key Access */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Physical Key Access</span>
              </div>
              <input
                type="checkbox"
                checked={keyAccess}
                onChange={(e) => setKeyAccess(e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>

            {/* Digital Access */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Digital/App Access</span>
              </div>
              <input
                type="checkbox"
                checked={digitalAccess}
                onChange={(e) => setDigitalAccess(e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>

            {/* Amenity Access */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Amenity/Building Access</span>
              </div>
              <input
                type="checkbox"
                checked={amenityAccess}
                onChange={(e) => setAmenityAccess(e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
          </div>

          {/* Final Confirmation */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="access-confirmation"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="access-confirmation" className="text-sm">
              I confirm all access systems have been set up successfully
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
            Complete Setup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessSetupModal;
