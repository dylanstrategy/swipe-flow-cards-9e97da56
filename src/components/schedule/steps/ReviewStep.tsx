
import React from 'react';
import { CheckCircle } from 'lucide-react';
import PointOfSale from '../../PointOfSale';
import SwipeUpPrompt from '@/components/ui/swipe-up-prompt';

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
    // Here you could track the offer click, redirect to a partner page, etc.
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-4">
        <CheckCircle className="mx-auto text-green-600 mb-2" size={32} />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Review & Submit</h3>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-1 text-sm">Work Order Details</h4>
          <p className="text-xs text-gray-600 mb-1"><strong>Issue:</strong> {workOrderDetails.title}</p>
          <p className="text-xs text-gray-600 mb-1"><strong>Location:</strong> {workOrderDetails.location}</p>
          <p className="text-xs text-gray-600"><strong>Description:</strong> {workOrderDetails.description}</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-1 text-sm">Scheduled Time</h4>
          <p className="text-gray-600 text-xs">
            {selectedDate?.toLocaleDateString()} at {selectedTime}
          </p>
        </div>

        {/* Point of Sale Offer */}
        <PointOfSale 
          context="work-order"
          onOfferClick={handleOfferClick}
        />

        <SwipeUpPrompt 
          onContinue={onSubmit}
          message="Ready to submit work order!"
          buttonText="Submit Work Order"
        />
      </div>
    </div>
  );
};

export default ReviewStep;
