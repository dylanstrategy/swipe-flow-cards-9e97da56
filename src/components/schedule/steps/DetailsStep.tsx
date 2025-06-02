
import React from 'react';

interface DetailsStepProps {
  onNext: () => void;
  workOrderDetails: {
    title: string;
    description: string;
    location: string;
  };
  setWorkOrderDetails: (details: { title: string; description: string; location: string; }) => void;
}

const DetailsStep = ({ onNext, workOrderDetails, setWorkOrderDetails }: DetailsStepProps) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Details</h3>
      <div className="flex-1 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title *</label>
          <input
            type="text"
            value={workOrderDetails.title}
            onChange={(e) => setWorkOrderDetails({...workOrderDetails, title: e.target.value})}
            placeholder="e.g., Broken outlet"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            style={{ fontSize: '16px', touchAction: 'manipulation' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            value={workOrderDetails.description}
            onChange={(e) => setWorkOrderDetails({...workOrderDetails, description: e.target.value})}
            placeholder="Describe the issue in detail..."
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            style={{ fontSize: '16px', touchAction: 'manipulation' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            type="text"
            value={workOrderDetails.location}
            onChange={(e) => setWorkOrderDetails({...workOrderDetails, location: e.target.value})}
            placeholder="e.g., Kitchen, Living room"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            style={{ fontSize: '16px', touchAction: 'manipulation' }}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
