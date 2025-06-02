
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, Camera } from 'lucide-react';

interface WorkOrderResolutionStepProps {
  resolutionType: 'complete' | 'vendor' | null;
  setResolutionType: (type: 'complete' | 'vendor' | null) => void;
  completionPhoto: string;
  setCompletionPhoto: (photo: string) => void;
  selectedVendor: string;
  setSelectedVendor: (vendor: string) => void;
  vendorCost: string;
  setVendorCost: (cost: string) => void;
}

const WorkOrderResolutionStep = ({
  resolutionType,
  setResolutionType,
  completionPhoto,
  setCompletionPhoto,
  selectedVendor,
  setSelectedVendor,
  vendorCost,
  setVendorCost
}: WorkOrderResolutionStepProps) => {
  const vendors = [
    'ABC Plumbing Services',
    'Reliable Electric Co',
    'Modern Appliance Repair',
    'Premier HVAC Solutions',
    'Express Locksmith'
  ];

  const canProceed = resolutionType === 'complete' ? completionPhoto !== '' : 
                     (selectedVendor !== '' && vendorCost !== '');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Resolution</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant={resolutionType === 'complete' ? 'default' : 'outline'}
            onClick={() => setResolutionType('complete')}
            className="h-20 flex flex-col"
          >
            <span className="text-2xl mb-1">✅</span>
            <span>Complete</span>
          </Button>
          <Button
            variant={resolutionType === 'vendor' ? 'default' : 'outline'}
            onClick={() => setResolutionType('vendor')}
            className="h-20 flex flex-col"
          >
            <span className="text-2xl mb-1">🏢</span>
            <span>Vendor Support</span>
          </Button>
        </div>

        {resolutionType === 'complete' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Take Completion Photo/Video
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {completionPhoto ? (
                  <div className="space-y-2">
                    <div className="w-full h-32 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-600">📸 Photo Captured</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCompletionPhoto('captured')}
                    >
                      Retake Photo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                    <Button
                      onClick={() => setCompletionPhoto('captured')}
                      className="w-full"
                    >
                      Capture Photo
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {resolutionType === 'vendor' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Vendor
              </label>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Choose a vendor...</option>
                {vendors.map((vendor) => (
                  <option key={vendor} value={vendor}>{vendor}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost to Resident
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="cost"
                    value="no-cost"
                    checked={vendorCost === 'no-cost'}
                    onChange={(e) => setVendorCost(e.target.value)}
                    className="mr-2"
                  />
                  No additional cost
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="cost"
                    value="with-cost"
                    checked={vendorCost === 'with-cost'}
                    onChange={(e) => setVendorCost(e.target.value)}
                    className="mr-2"
                  />
                  Resident responsible for cost
                </label>
              </div>
            </div>
          </div>
        )}

        {canProceed && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 mb-2">
              Swipe up to {resolutionType === 'complete' ? 'complete work order' : 'submit vendor order'}
            </p>
            <ArrowUp className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkOrderResolutionStep;
