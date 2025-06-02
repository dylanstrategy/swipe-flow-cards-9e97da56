
import React from 'react';
import { Star, Plus } from 'lucide-react';
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

interface ServiceCategoryProps {
  services: Service[];
  onAddToCart: (service: Service) => void;
}

const ServiceCategory = ({ services, onAddToCart }: ServiceCategoryProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {services.map((service) => (
        <div key={service.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          {/* Service Image */}
          <div className="relative h-48 bg-gray-100">
            <img
              src={`https://images.unsplash.com/${service.image}?w=400&h=300&fit=crop`}
              alt={service.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1">
              <Star size={12} className="text-yellow-500 fill-current" />
              <span className="text-xs font-medium text-gray-700">{service.rating}</span>
            </div>
          </div>

          {/* Service Details */}
          <div className="p-4">
            <div className="mb-2">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{service.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
              <p className="text-xs text-blue-600 font-medium">{service.provider}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">${service.price}</span>
                <span className="text-sm text-gray-500">per service</span>
              </div>
              
              <Button
                onClick={() => onAddToCart(service)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
              >
                <Plus size={16} />
                Add
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCategory;
