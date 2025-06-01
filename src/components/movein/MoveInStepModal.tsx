
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, FileText, CreditCard, Shield, Truck, Zap, Calendar, BookOpen } from 'lucide-react';
import PointOfSale from '@/components/PointOfSale';

interface MoveInStepModalProps {
  stepId: string;
  onComplete: () => void;
  onClose: () => void;
}

const MoveInStepModal = ({ stepId, onComplete, onClose }: MoveInStepModalProps) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const getStepContent = (stepId: string) => {
    switch (stepId) {
      case 'sign-lease':
        return {
          icon: <FileText className="text-blue-600" size={48} />,
          title: 'Sign Lease Agreement',
          content: (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                <div className="text-center py-8">
                  <FileText className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-600 font-medium">Lease Agreement Document</p>
                  <p className="text-sm text-gray-500">Review your lease terms and conditions</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Lease term: 12 months</p>
                <p>• Monthly rent: $2,100</p>
                <p>• Security deposit: $2,100</p>
                <p>• Pet deposit: $500 (if applicable)</p>
              </div>
            </div>
          ),
          actionText: 'Sign Lease',
          context: 'document' as const
        };

      case 'payment':
        return {
          icon: <CreditCard className="text-green-600" size={48} />,
          title: 'Make Initial Payment',
          content: (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Payment Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>First Month's Rent:</span>
                    <span className="font-medium">$2,100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span className="font-medium">$2,100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Application Fee:</span>
                    <span className="font-medium">$150</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Due:</span>
                    <span>$4,350</span>
                  </div>
                </div>
              </div>
            </div>
          ),
          actionText: 'Make Payment',
          context: 'service' as const
        };

      case 'renters-insurance':
        return {
          icon: <Shield className="text-purple-600" size={48} />,
          title: "Upload Renter's Insurance",
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">
                Please upload proof of your renter's insurance coverage. Your policy must include:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Minimum $100,000 liability coverage</li>
                <li>• Property damage coverage</li>
                <li>• Valid for your move-in date</li>
              </ul>
              
              {/* Pet Information Section */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Pet Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">Pet Type</label>
                    <select className="w-full p-2 border border-purple-200 rounded-md text-sm">
                      <option value="">Select pet type</option>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="bird">Bird</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">Pet Name</label>
                    <input type="text" placeholder="Pet's name" className="w-full p-2 border border-purple-200 rounded-md text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">Breed</label>
                    <input type="text" placeholder="Breed" className="w-full p-2 border border-purple-200 rounded-md text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">Weight (lbs)</label>
                    <input type="number" placeholder="Weight" className="w-full p-2 border border-purple-200 rounded-md text-sm" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-purple-700">Pet is spayed/neutered</span>
                  </label>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">Drop your insurance document here or click to browse</p>
              </div>
            </div>
          ),
          actionText: 'Upload Document',
          context: 'pet-service' as const
        };

      case 'book-movers':
        return {
          icon: <Truck className="text-orange-600" size={48} />,
          title: 'Book Moving Services',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">
                Schedule professional movers to make your transition smooth and stress-free.
              </p>
              <div className="grid grid-cols-1 gap-3">
                <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Premium Moving Co.</h4>
                      <p className="text-sm text-gray-600">Full-service, insured</p>
                    </div>
                    <span className="text-green-600 font-semibold">$850</span>
                  </div>
                </div>
                <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Quick Move Express</h4>
                      <p className="text-sm text-gray-600">Basic service, reliable</p>
                    </div>
                    <span className="text-green-600 font-semibold">$650</span>
                  </div>
                </div>
              </div>
            </div>
          ),
          actionText: 'Book Movers',
          context: 'moving-service' as const
        };

      case 'utilities':
        return {
          icon: <Zap className="text-yellow-600" size={48} />,
          title: 'Set Up Utilities',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">
                Arrange your utility services for move-in day.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Electricity (City Power)</span>
                  <Button size="sm" variant="outline">Set Up</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Gas (Metro Gas)</span>
                  <Button size="sm" variant="outline">Set Up</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Internet (FastNet)</span>
                  <Button size="sm" variant="outline">Set Up</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Water (Included)</span>
                  <span className="text-green-600 text-sm">✓ Ready</span>
                </div>
              </div>
            </div>
          ),
          actionText: 'Complete Setup',
          context: 'home-setup' as const
        };

      case 'inspection':
        return {
          icon: <Calendar className="text-blue-600" size={48} />,
          title: 'Schedule Move-In Inspection',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">
                Schedule your move-in inspection to document the apartment's condition.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 border rounded-lg hover:bg-gray-50 text-left">
                  <div className="font-medium">March 15</div>
                  <div className="text-sm text-gray-600">10:00 AM</div>
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50 text-left">
                  <div className="font-medium">March 15</div>
                  <div className="text-sm text-gray-600">2:00 PM</div>
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50 text-left">
                  <div className="font-medium">March 16</div>
                  <div className="text-sm text-gray-600">9:00 AM</div>
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50 text-left">
                  <div className="font-medium">March 16</div>
                  <div className="text-sm text-gray-600">1:00 PM</div>
                </button>
              </div>
            </div>
          ),
          actionText: 'Schedule Inspection',
          context: 'appointment' as const
        };

      case 'community-guidelines':
        return {
          icon: <BookOpen className="text-indigo-600" size={48} />,
          title: 'Review Community Guidelines',
          content: (
            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-800 mb-2">Community Guidelines</h4>
                <div className="text-sm text-indigo-700 space-y-1">
                  <p>• Quiet hours: 10 PM - 8 AM</p>
                  <p>• Pet policy: Maximum 2 pets, registration required</p>
                  <p>• Parking: Assigned spaces only</p>
                  <p>• Guests: Maximum 2 weeks consecutive stay</p>
                  <p>• Amenity hours: Pool 6 AM - 10 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="acknowledge" className="rounded" />
                <label htmlFor="acknowledge" className="text-sm text-gray-600">
                  I acknowledge and agree to follow the community guidelines
                </label>
              </div>
            </div>
          ),
          actionText: 'Acknowledge Guidelines',
          context: 'document' as const
        };

      default:
        return {
          icon: <Check className="text-gray-600" size={48} />,
          title: 'Complete Step',
          content: <div>Complete this step</div>,
          actionText: 'Complete',
          context: 'service' as const
        };
    }
  };

  const stepContent = getStepContent(stepId);

  const handleComplete = async () => {
    setIsCompleting(true);
    // Simulate API call or processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    onComplete();
    setIsCompleting(false);
  };

  const handleOfferClick = (offer: any) => {
    console.log('Offer clicked:', offer);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            {stepContent.icon}
            <DialogTitle className="text-xl">{stepContent.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {stepContent.content}

          {/* Point of Sale Integration */}
          <PointOfSale 
            context={stepContent.context}
            onOfferClick={handleOfferClick}
          />

          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={isCompleting}
              className="flex-1"
            >
              {isCompleting ? 'Processing...' : stepContent.actionText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoveInStepModal;
