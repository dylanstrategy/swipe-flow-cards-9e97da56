
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import PointOfSale from '../PointOfSale';

interface ReviewItem {
  label: string;
  value: string | React.ReactNode;
}

interface ReviewSection {
  title: string;
  items: ReviewItem[];
}

type PointOfSaleContext = "message" | "work-order" | "appointment" | "service" | "document" | "event" | "pet-service" | "moving-service" | "home-setup";

interface ReviewSlideProps {
  title: string;
  subtitle?: string;
  sections: ReviewSection[];
  onSubmit: () => void;
  submitButtonText?: string;
  showPointOfSale?: boolean;
  pointOfSaleContext?: PointOfSaleContext;
}

const ReviewSlide = ({ 
  title, 
  subtitle, 
  sections, 
  onSubmit, 
  submitButtonText = 'Submit',
  showPointOfSale = true,
  pointOfSaleContext = 'work-order'
}: ReviewSlideProps) => {
  const handleOfferClick = (offer: any) => {
    console.log('Review offer clicked:', offer);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Section - Fixed */}
      <div className="text-center mb-6 flex-shrink-0 px-6 pt-6">
        <CheckCircle className="mx-auto text-green-600 mb-3" size={32} />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6">
        <div className="space-y-6 pb-6">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 text-base">{section.title}</h4>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-start gap-4">
                    <span className="text-sm text-gray-600 font-medium min-w-0 flex-shrink-0">{item.label}:</span>
                    <span className="text-sm text-gray-900 text-right min-w-0 flex-1">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Point of Sale Offer */}
          {showPointOfSale && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <PointOfSale 
                context={pointOfSaleContext}
                onOfferClick={handleOfferClick}
              />
            </div>
          )}
        </div>
      </div>

      {/* Fixed Submit Button */}
      <div className="flex-shrink-0 p-6 bg-white border-t border-gray-200">
        <Button
          onClick={onSubmit}
          className="w-full bg-blue-600 text-white py-4 text-lg font-semibold hover:bg-blue-700 transition-colors h-14"
        >
          {submitButtonText}
        </Button>
      </div>
    </div>
  );
};

export default ReviewSlide;
