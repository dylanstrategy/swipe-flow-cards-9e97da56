
import React, { useState } from 'react';
import { ArrowLeft, Trash2, ShoppingCart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface ServiceCartProps {
  cart: Service[];
  onClose: () => void;
  onRemoveItem: (serviceId: string) => void;
  onBackToServices: () => void;
  totalPrice: number;
}

const ServiceCart = ({ cart, onClose, onRemoveItem, onBackToServices, totalPrice }: ServiceCartProps) => {
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    setShowCheckout(true);
    // Here you would integrate with payment processing
    setTimeout(() => {
      alert('Services booked successfully! You will receive confirmation details shortly.');
      onClose();
    }, 2000);
  };

  if (showCheckout) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Order</h2>
          <p className="text-gray-600">Please wait while we confirm your services...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button 
          onClick={onBackToServices}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          Your Cart ({cart.length})
        </h1>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ShoppingCart size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-4">Add some services to get started</p>
            <Button onClick={onBackToServices} variant="outline">
              Browse Services
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((service) => (
              <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
                <img
                  src={`https://images.unsplash.com/${service.image}?w=100&h=100&fit=crop`}
                  alt={service.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{service.provider}</p>
                  <p className="text-lg font-bold text-gray-900">${service.price}</p>
                </div>
                <button
                  onClick={() => onRemoveItem(service.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Section */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-white pb-24">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-gray-900">${totalPrice}</span>
          </div>
          <Button
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
          >
            Book Services
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            You'll receive scheduling details after booking
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceCart;
