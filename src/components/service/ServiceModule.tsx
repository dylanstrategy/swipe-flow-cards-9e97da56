
import React, { useState } from 'react';
import { ArrowLeft, X, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceCategory from './ServiceCategory';
import ServiceCart from './ServiceCart';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  provider: string;
}

interface ServiceModuleProps {
  onClose: () => void;
}

const ServiceModule = ({ onClose }: ServiceModuleProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<Service[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = [
    { id: 'all', name: 'All Services', icon: '🏠' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'living-room', name: 'Living Room', icon: '🛋️' },
    { id: 'bathroom', name: 'Bathroom', icon: '🚿' },
    { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
    { id: 'household', name: 'Household', icon: '🧹' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧' },
  ];

  const services: Service[] = [
    // Kitchen Services
    {
      id: 'k1',
      name: 'Deep Kitchen Cleaning',
      description: 'Complete kitchen deep clean including appliances, cabinets, and countertops',
      price: 89,
      rating: 4.8,
      image: 'photo-1721322800607-8c38375eef04',
      category: 'kitchen',
      provider: 'CleanPro Services'
    },
    {
      id: 'k2',
      name: 'Premium Cookware Set',
      description: 'Professional-grade non-stick cookware set with lifetime warranty',
      price: 299,
      rating: 4.9,
      image: 'photo-1618160702438-9b02ab6515c9',
      category: 'kitchen',
      provider: 'KitchenMaster'
    },
    {
      id: 'k3',
      name: 'Knife Sharpening Service',
      description: 'Professional knife sharpening service at your door',
      price: 25,
      rating: 4.7,
      image: 'photo-1506744038136-46273834b3fb',
      category: 'kitchen',
      provider: 'Sharp Edge Co.'
    },
    
    // Living Room Services
    {
      id: 'l1',
      name: 'Carpet Deep Cleaning',
      description: 'Professional carpet cleaning with eco-friendly solutions',
      price: 149,
      rating: 4.6,
      image: 'photo-1582562124811-c09040d0a901',
      category: 'living-room',
      provider: 'Fresh Clean Co.'
    },
    {
      id: 'l2',
      name: 'Furniture Polish & Care',
      description: 'Premium furniture polishing and leather conditioning service',
      price: 79,
      rating: 4.5,
      image: 'photo-1500673922987-e212871fec22',
      category: 'living-room',
      provider: 'Furniture Care Plus'
    },
    {
      id: 'l3',
      name: 'Smart Home Setup',
      description: 'Professional smart home device installation and setup',
      price: 199,
      rating: 4.8,
      image: 'photo-1721322800607-8c38375eef04',
      category: 'living-room',
      provider: 'Tech Setup Pro'
    },

    // Bathroom Services
    {
      id: 'b1',
      name: 'Bathroom Deep Clean',
      description: 'Thorough bathroom sanitization and deep cleaning service',
      price: 69,
      rating: 4.7,
      image: 'photo-1618160702438-9b02ab6515c9',
      category: 'bathroom',
      provider: 'Sparkle Clean'
    },
    {
      id: 'b2',
      name: 'Grout Restoration',
      description: 'Professional grout cleaning and sealing service',
      price: 129,
      rating: 4.6,
      image: 'photo-1506744038136-46273834b3fb',
      category: 'bathroom',
      provider: 'Tile Masters'
    },

    // Bedroom Services
    {
      id: 'be1',
      name: 'Mattress Cleaning',
      description: 'Deep mattress cleaning and sanitization service',
      price: 89,
      rating: 4.5,
      image: 'photo-1582562124811-c09040d0a901',
      category: 'bedroom',
      provider: 'Sleep Fresh Co.'
    },
    {
      id: 'be2',
      name: 'Closet Organization',
      description: 'Professional closet organization and decluttering service',
      price: 159,
      rating: 4.8,
      image: 'photo-1500673922987-e212871fec22',
      category: 'bedroom',
      provider: 'Organize It'
    },

    // Household Services
    {
      id: 'h1',
      name: 'Full House Cleaning',
      description: 'Complete house cleaning service - all rooms included',
      price: 249,
      rating: 4.9,
      image: 'photo-1721322800607-8c38375eef04',
      category: 'household',
      provider: 'Complete Clean Co.'
    },
    {
      id: 'h2',
      name: 'Plant Care Service',
      description: 'Weekly plant watering and care service while you\'re away',
      price: 39,
      rating: 4.7,
      image: 'photo-1618160702438-9b02ab6515c9',
      category: 'household',
      provider: 'Green Thumb Care'
    },
    {
      id: 'h3',
      name: 'Laundry & Folding',
      description: 'Pick-up, wash, dry, and fold laundry service',
      price: 29,
      rating: 4.6,
      image: 'photo-1506744038136-46273834b3fb',
      category: 'household',
      provider: 'Wash & Fold Pro'
    },

    // Maintenance Services
    {
      id: 'm1',
      name: 'HVAC Maintenance',
      description: 'Complete HVAC system inspection and maintenance',
      price: 179,
      rating: 4.8,
      image: 'photo-1582562124811-c09040d0a901',
      category: 'maintenance',
      provider: 'Climate Control Co.'
    },
    {
      id: 'm2',
      name: 'Plumbing Check-up',
      description: 'Comprehensive plumbing inspection and minor repairs',
      price: 99,
      rating: 4.7,
      image: 'photo-1500673922987-e212871fec22',
      category: 'maintenance',
      provider: 'Pro Plumbers'
    }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const addToCart = (service: Service) => {
    setCart(prev => [...prev, service]);
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => prev.filter(service => service.id !== serviceId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, service) => total + service.price, 0);
  };

  if (showCart) {
    return (
      <ServiceCart
        cart={cart}
        onClose={() => setShowCart(false)}
        onRemoveItem={removeFromCart}
        onBackToServices={() => setShowCart(false)}
        totalPrice={getTotalPrice()}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          Building Services
        </h1>
        <button
          onClick={() => setShowCart(true)}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ShoppingCart size={24} className="text-gray-700" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-gray-200 bg-white sticky top-16 z-10">
        <div className="flex overflow-x-auto gap-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <ServiceCategory
          services={filteredServices}
          onAddToCart={addToCart}
        />
      </div>
    </div>
  );
};

export default ServiceModule;
