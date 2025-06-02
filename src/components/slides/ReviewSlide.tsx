
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
      <div className="text-center mb-4 flex-shrink-0">
        <CheckCircle className="mx-auto text-green-600 mb-2" size={32} />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto pb-20">
        <div className="space-y-4">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3 text-base">{section.title}</h4>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-start">
                    <span className="text-sm text-gray-600 font-medium">{item.label}:</span>
                    <span className="text-sm text-gray-900 ml-2 text-right flex-1">
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

          {/* Additional spacing for better scrolling */}
          <div className="h-8"></div>
        </div>
      </div>

      {/* Fixed Submit Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Button
          onClick={onSubmit}
          className="w-full bg-blue-600 text-white py-3 text-base font-semibold hover:bg-blue-700 transition-colors"
        >
          {submitButtonText}
        </Button>
      </div>
    </div>
  );
};

export default ReviewSlide;
