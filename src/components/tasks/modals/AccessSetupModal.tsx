
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, Wifi, CheckCircle } from 'lucide-react';
import { EventTask } from '@/types/eventTasks';

interface AccessSetupModalProps {
  task: EventTask;
  onClose: () => void;
  onComplete: () => void;
}

const AccessSetupModal = ({ task, onClose, onComplete }: AccessSetupModalProps) => {
  const [accessCode, setAccessCode] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);

  const generateAccessCode = () => {
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    setAccessCode(code);
  };

  const generateWifiPassword = () => {
    const password = 'WELCOME' + Math.floor(100 + Math.random() * 900);
    setWifiPassword(password);
  };

  const canComplete = accessCode && wifiPassword;

  const handleComplete = () => {
    if (canComplete) {
      console.log('Access setup completed with code:', accessCode, 'wifi:', wifiPassword);
      setSetupComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  if (setupComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Setup Complete!</h3>
          <p className="text-gray-600">Resident access has been configured.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Setup Resident Access</h3>
        </div>
        
        <p className="text-gray-600 mb-4">{task.description}</p>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Building Access Code:
            </label>
            <div className="flex gap-2">
              <Input
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter 5-digit code"
                maxLength={5}
              />
              <Button onClick={generateAccessCode} variant="outline">
                Generate
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Wifi Password:
            </label>
            <div className="flex gap-2">
              <Input
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="Wifi password"
              />
              <Button onClick={generateWifiPassword} variant="outline">
                <Wifi className="w-4 h-4" />
              </Button>
            </div>
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
            <CheckCircle className="w-4 h-4 mr-2" />
            Setup Complete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessSetupModal;
