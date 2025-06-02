
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

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

  const handleSubmit = () => {
    if (canProceed) {
      console.log('Work order resolution submitted:', {
        resolutionType,
        completionPhoto,
        selectedVendor,
        vendorCost
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Resolution</h3>
        <p className="text-sm text-gray-600">Choose how to resolve this work order</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pb-4">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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

          {/* Additional spacing for better scrolling */}
          <div className="h-4"></div>
        </div>
      </div>

      {/* Fixed Submit Button */}
      {resolutionType && (
        <div className="flex-shrink-0 pt-4 border-t border-gray-200 bg-white">
          <Button
            onClick={handleSubmit}
            disabled={!canProceed}
            className="w-full bg-blue-600 text-white py-3 text-base font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {resolutionType === 'complete' ? 'Complete Work Order' : 'Submit Vendor Order'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkOrderResolutionStep;
