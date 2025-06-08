
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Gift, Package, MapPin } from 'lucide-react';
import { EventTask } from '@/types/eventTasks';

interface GiftPackageModalProps {
  task: EventTask;
  onClose: () => void;
  onComplete: () => void;
}

const GiftPackageModal = ({ task, onClose, onComplete }: GiftPackageModalProps) => {
  const [packageContents, setPackageContents] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [packagePrepared, setPackagePrepared] = useState(false);
  const [deliveryScheduled, setDeliveryScheduled] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const canComplete = packageContents.trim() && deliveryLocation.trim() && packagePrepared && deliveryScheduled && confirmed;

  const handleComplete = () => {
    if (canComplete) {
      console.log('Gift package task completed:', {
        taskId: task.id,
        contents: packageContents,
        location: deliveryLocation,
        prepared: packagePrepared,
        scheduled: deliveryScheduled
      });
      onComplete();
    }
  };

  const handlePreparePackage = () => {
    if (packageContents.trim()) {
      setPackagePrepared(true);
    }
  };

  const handleScheduleDelivery = () => {
    if (deliveryLocation.trim() && packagePrepared) {
      setDeliveryScheduled(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">{task.title}</h3>
        </div>
        
        <p className="text-gray-600 mb-4">{task.description}</p>
        
        <div className="space-y-4">
          {/* Package Contents */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Package Contents: <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={packageContents}
              onChange={(e) => setPackageContents(e.target.value)}
              placeholder="List items included in the gift package..."
              rows={3}
            />
          </div>

          {/* Delivery Location */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Delivery Location: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="Unit number or delivery address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prepare Package */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Prepare Package</span>
            </div>
            <Button
              size="sm"
              variant={packagePrepared ? "default" : "outline"}
              onClick={handlePreparePackage}
              disabled={!packageContents.trim() || packagePrepared}
            >
              {packagePrepared ? '✓ Prepared' : 'Prepare'}
            </Button>
          </div>

          {/* Schedule Delivery */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Schedule Delivery</span>
            </div>
            <Button
              size="sm"
              variant={deliveryScheduled ? "default" : "outline"}
              onClick={handleScheduleDelivery}
              disabled={!deliveryLocation.trim() || !packagePrepared || deliveryScheduled}
            >
              {deliveryScheduled ? '✓ Scheduled' : 'Schedule'}
            </Button>
          </div>

          {/* Final Confirmation */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="gift-confirmation"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="gift-confirmation" className="text-sm">
              I confirm the gift package has been prepared and delivery scheduled
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
            Complete Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GiftPackageModal;
