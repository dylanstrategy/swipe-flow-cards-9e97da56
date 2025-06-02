import React from 'react';
import { ShoppingBag, Store, Coffee, Car, Package, Utensils, Heart, Sofa, Flower, Scissors } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

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
  context: 'message' | 'work-order' | 'appointment' | 'service' | 'document' | 'event' | 'pet-service' | 'moving-service' | 'home-setup';
  onOfferClick: (offer: OfferData) => void;
  petName?: string;
}

const PointOfSale = ({ context, onOfferClick, petName }: PointOfSaleProps) => {
  const { profile, getPersonalizedContext } = useProfile();
  
  // Use personalized context if no specific context provided
  const effectiveContext = context || getPersonalizedContext();
  
  // Get pet name from context, profile, or use default
  const displayPetName = petName || (profile.pets.length > 0 ? profile.pets[0].name : 'Luna');

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
      ],
      'pet-service': [
        {
          title: `${displayPetName}'s Spa Day`,
          description: `Pamper ${displayPetName} with professional grooming`,
          discount: "30% OFF",
          business: "Happy Paws Spa",
          icon: Heart,
          color: "bg-pink-500",
          cta: "Book Grooming"
        },
        {
          title: `Walking Service for ${displayPetName}`,
          description: `Professional dog walking tailored for ${displayPetName}`,
          discount: "$15 OFF",
          business: "Pawsome Walkers",
          icon: Heart,
          color: "bg-blue-500",
          cta: "Schedule Walk"
        },
        {
          title: `${displayPetName}'s Vet Checkup`,
          description: `Book ${displayPetName}'s annual wellness exam`,
          discount: "25% OFF",
          business: "CityVet Clinic",
          icon: Heart,
          color: "bg-green-500",
          cta: "Book Appointment"
        },
        {
          title: `Premium Food for ${displayPetName}`,
          description: `Healthy, organic pet food delivered for ${displayPetName}`,
          discount: "$20 OFF",
          business: "PetNutrition Plus",
          icon: Scissors,
          color: "bg-orange-500",
          cta: "Order Food"
        }
      ],
      'moving-service': [
        {
          title: "Furniture Assembly",
          description: "Professional furniture setup service",
          discount: "25% OFF",
          business: "Build It Right",
          icon: Sofa,
          color: "bg-blue-600",
          cta: "Book Service"
        },
        {
          title: "Houseplants Delivery",
          description: "Brighten your new home with plants",
          discount: "$20 OFF",
          business: "Green Thumb Nursery",
          icon: Flower,
          color: "bg-green-600",
          cta: "Shop Plants"
        }
      ],
      'home-setup': [
        {
          title: "Home Furniture",
          description: "Complete your space with style",
          discount: "15% OFF",
          business: "Modern Living Co.",
          icon: Sofa,
          color: "bg-gray-600",
          cta: "Shop Now"
        },
        {
          title: "Indoor Plants",
          description: "Add life to your new home",
          discount: "$10 OFF",
          business: "Plant Paradise",
          icon: Flower,
          color: "bg-emerald-600",
          cta: "Browse Plants"
        }
      ]
    };

    // Add lifestyle-targeted offers based on profile
    const lifestyleOffers = {
      'wellness-focused': [
        {
          title: "Yoga Studio Pass",
          description: "Find your zen with unlimited classes",
          discount: "First Month FREE",
          business: "Mindful Movements",
          icon: Heart,
          color: "bg-purple-500",
          cta: "Start Practice"
        }
      ],
      'foodie-focused': [
        {
          title: "Gourmet Delivery",
          description: "Farm-to-table meals delivered fresh",
          discount: "30% OFF",
          business: "Local Harvest Kitchen",
          icon: Utensils,
          color: "bg-green-600",
          cta: "Order Now"
        }
      ],
      'creative-focused': [
        {
          title: "Art Supply Store",
          description: "Premium supplies for your creative projects",
          discount: "25% OFF",
          business: "Creative Corner",
          icon: Store,
          color: "bg-indigo-500",
          cta: "Shop Supplies"
        }
      ],
      'hosting-focused': [
        {
          title: "Party Planning Service",
          description: "Make your gatherings unforgettable",
          discount: "$50 OFF",
          business: "Perfect Party Co.",
          icon: Utensils,
          color: "bg-pink-600",
          cta: "Plan Event"
        }
      ]
    };

    // Check lifestyle tags and add targeted offers
    let offers = baseOffers[context] || baseOffers.message;
    
    if (profile.lifestyleTags.includes('wellness')) {
      offers = [...offers, ...lifestyleOffers['wellness-focused']];
    }
    if (profile.lifestyleTags.includes('foodAndDrinks')) {
      offers = [...offers, ...lifestyleOffers['foodie-focused']];
    }
    if (profile.lifestyleTags.includes('creativity')) {
      offers = [...offers, ...lifestyleOffers['creative-focused']];
    }
    if (profile.lifestyleTags.includes('hosting')) {
      offers = [...offers, ...lifestyleOffers['hosting-focused']];
    }

    return offers;
  };

  const offers = getContextualOffers(effectiveContext);
  const selectedOffer = offers[Math.floor(Math.random() * offers.length)];
  const IconComponent = selectedOffer.icon;

  const getOfferHeader = () => {
    if (effectiveContext === 'pet-service') {
      return `Exclusive Offer for ${displayPetName}`;
    }
    if (profile.selectedLifestyleTags.length > 0) {
      const tag = profile.selectedLifestyleTags[0];
      return `${tag.emoji} Personalized for You`;
    }
    return 'Exclusive Resident Offer';
  };

  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div className="text-center mb-2">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {getOfferHeader()}
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
