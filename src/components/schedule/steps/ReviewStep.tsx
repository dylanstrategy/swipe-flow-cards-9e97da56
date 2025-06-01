
import React from 'react';
import { CheckCircle, ArrowUp } from 'lucide-react';
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
    // Here you could track the offer click, redirect to a partner page, etc.
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-4">
        <CheckCircle className="mx-auto text-green-600 mb-2" size={32} />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Review & Submit</h3>
      </div>
      
      <div className="flex-1 space-y-3">
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
      </div>
        
      <div className="bg-green-50 p-3 rounded-lg text-center">
        <p className="text-green-800 font-medium text-sm">Ready to submit work order</p>
        <p className="text-green-600 text-xs mb-2">You'll receive a confirmation</p>
        <ArrowUp className="text-green-600 animate-bounce mx-auto mb-2" size={24} />
        <p className="text-xs text-green-600 mb-3">Swipe up anywhere to submit</p>
        <button
          onClick={onSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Submit Work Order
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
