
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PointOfSale from '../../PointOfSale';

interface ReviewStepProps {
  onSubmit: () => void;
  workOrderDetails: {
    title: string;
    description: string;
    location: string;
  };
  selectedDate?: Date;
  selectedTime: string;
}

const ReviewStep = ({ onSubmit, workOrderDetails, selectedDate, selectedTime }: ReviewStepProps) => {
  const handleOfferClick = (offer: any) => {
    console.log('Work order offer clicked:', offer);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="text-center mb-4 flex-shrink-0">
        <CheckCircle className="mx-auto text-green-600 mb-2" size={32} />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Review & Submit</h3>
        <p className="text-sm text-gray-600">Review your details before submitting</p>
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-4 pb-32">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 text-base">Work Order Details</h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><strong>Issue:</strong> {workOrderDetails.title}</p>
              <p className="text-sm text-gray-600"><strong>Location:</strong> {workOrderDetails.location}</p>
              <p className="text-sm text-gray-600"><strong>Description:</strong> {workOrderDetails.description}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 text-base">Scheduled Time</h4>
            <p className="text-gray-600 text-sm">
              {selectedDate?.toLocaleDateString()} at {selectedTime}
            </p>
          </div>

          {/* Point of Sale Offer */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <PointOfSale 
              context="work-order"
              onOfferClick={handleOfferClick}
            />
          </div>
        </div>
      </div>

      {/* Fixed Complete Button with proper bottom spacing for tab navigation */}
      <div className="flex-shrink-0 p-4 pb-24 border-t border-gray-200 bg-white">
        <Button
          onClick={onSubmit}
          className="w-full bg-blue-600 text-white py-3 text-base font-semibold hover:bg-blue-700 transition-colors"
        >
          Complete Work Order
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
