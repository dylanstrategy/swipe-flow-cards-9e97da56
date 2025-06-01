
import React from 'react';
import { ShoppingBag, Store, Coffee, Car, Package, Utensils } from 'lucide-react';

interface OfferData {
  title: string;
  description: string;
  discount: string;
  business: string;
  image?: string;
  icon: React.ComponentType<any>;
  color: string;
  cta: string;
}

interface PointOfSaleProps {
  context: 'message' | 'work-order' | 'appointment' | 'service' | 'document' | 'event';
  onOfferClick: (offer: OfferData) => void;
}

const PointOfSale = ({ context, onOfferClick }: PointOfSaleProps) => {
  const getContextualOffers = (context: string): OfferData[] => {
    const baseOffers = {
      message: [
        {
          title: "Coffee on Us!",
          description: "Great communication deserves a reward",
          discount: "20% OFF",
          business: "Joe's Coffee Corner",
          icon: Coffee,
          color: "bg-amber-500",
          cta: "Claim Offer"
        },
        {
          title: "Lunch Special",
          description: "Hungry after handling business?",
          discount: "15% OFF",
          business: "Corner Bistro",
          icon: Utensils,
          color: "bg-orange-500",
          cta: "Order Now"
        }
      ],
      'work-order': [
        {
          title: "Extra Storage?",
          description: "Keep your space organized",
          discount: "$10 OFF",
          business: "SecureStore Units",
          icon: Package,
          color: "bg-blue-500",
          cta: "Book Now"
        },
        {
          title: "Tools & Hardware",
          description: "For your next DIY project",
          discount: "25% OFF",
          business: "Hardware Haven",
          icon: Store,
          color: "bg-green-500",
          cta: "Shop Now"
        }
      ],
      appointment: [
        {
          title: "Parking Pass",
          description: "Convenient parking for your visit",
          discount: "Free 2hrs",
          business: "Building Garage",
          icon: Car,
          color: "bg-purple-500",
          cta: "Reserve Spot"
        }
      ],
      service: [
        {
          title: "Grocery Delivery",
          description: "Fresh groceries to your door",
          discount: "$5 OFF",
          business: "FreshCart Delivery",
          icon: ShoppingBag,
          color: "bg-emerald-500",
          cta: "Order Now"
        }
      ],
      document: [
        {
          title: "Document Printing",
          description: "Need physical copies?",
          discount: "50% OFF",
          business: "QuickPrint Shop",
          icon: Store,
          color: "bg-indigo-500",
          cta: "Print Now"
        }
      ],
      event: [
        {
          title: "Event Catering",
          description: "Planning your own gathering?",
          discount: "20% OFF",
          business: "Party Platters Plus",
          icon: Utensils,
          color: "bg-pink-500",
          cta: "Get Quote"
        }
      ]
    };

    return baseOffers[context] || baseOffers.message;
  };

  const offers = getContextualOffers(context);
  const selectedOffer = offers[Math.floor(Math.random() * offers.length)];
  const IconComponent = selectedOffer.icon;

  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div className="text-center mb-2">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          Exclusive Resident Offer
        </p>
      </div>
      
      <button
        onClick={() => onOfferClick(selectedOffer)}
        className="w-full bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${selectedOffer.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
            <IconComponent className="text-white" size={18} />
          </div>
          
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{selectedOffer.title}</h4>
              <span className={`px-1.5 py-0.5 ${selectedOffer.color} text-white text-xs font-bold rounded-full flex-shrink-0`}>
                {selectedOffer.discount}
              </span>
            </div>
            <p className="text-gray-600 text-xs mb-1 line-clamp-1">{selectedOffer.description}</p>
            <p className="text-gray-500 text-xs truncate">{selectedOffer.business}</p>
          </div>
          
          <div className="text-right flex-shrink-0">
            <span className="text-blue-600 text-xs font-medium group-hover:text-blue-700">
              {selectedOffer.cta} →
            </span>
          </div>
        </div>
      </button>
      
      <p className="text-center text-xs text-gray-400 mt-2">
        Tap to redeem • Valid for 24 hours
      </p>
    </div>
  );
};

export default PointOfSale;
