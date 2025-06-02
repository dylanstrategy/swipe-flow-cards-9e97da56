
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, FileText, CreditCard, Shield, Truck, Zap, Calendar, BookOpen, ExternalLink, Phone, Home } from 'lucide-react';
import PointOfSale from '@/components/PointOfSale';
import InspectionCamera from './InspectionCamera';

interface MoveInStepModalProps {
  stepId: string;
  onComplete: () => void;
  onClose: () => void;
}

const MoveInStepModal = ({ stepId, onComplete, onClose }: MoveInStepModalProps) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [hasPet, setHasPet] = useState(false);
  const [needsParking, setNeedsParking] = useState(false);
  const [parkingType, setParkingType] = useState('');
  const [needsStorage, setNeedsStorage] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [readyForInspection, setReadyForInspection] = useState<boolean | null>(null);

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
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">Drop your insurance document here or click to browse</p>
              </div>

              {/* Pet Selection */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-3">Pet Information</h4>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-sm font-medium text-purple-700">Do you have any pets?</span>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="hasPet" 
                        value="yes"
                        checked={hasPet}
                        onChange={() => setHasPet(true)}
                        className="text-purple-600"
                      />
                      <span className="text-sm text-purple-700">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="hasPet" 
                        value="no"
                        checked={!hasPet}
                        onChange={() => setHasPet(false)}
                        className="text-purple-600"
                      />
                      <span className="text-sm text-purple-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Pet Information Form - Only show if user has pets */}
                {hasPet && (
                  <div className="space-y-3">
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
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-purple-700">Pet is spayed/neutered</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ),
          actionText: 'Upload Document',
          context: hasPet ? 'pet-service' as const : 'document' as const
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
                  <div className="flex-1">
                    <span className="font-medium">Electricity (PSEG)</span>
                    <div className="flex items-center space-x-4 mt-1">
                      <a 
                        href="https://www.pseg.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 text-sm hover:underline"
                      >
                        <ExternalLink size={14} />
                        <span>pseg.com</span>
                      </a>
                      <a 
                        href="tel:1-800-436-7734" 
                        className="flex items-center space-x-1 text-blue-600 text-sm hover:underline"
                      >
                        <Phone size={14} />
                        <span>1-800-436-7734</span>
                      </a>
                    </div>
                  </div>
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

              {/* Parking Selection */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Parking</h4>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-sm font-medium text-blue-700">Do you need parking?</span>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="needsParking" 
                        value="yes"
                        checked={needsParking}
                        onChange={() => setNeedsParking(true)}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-blue-700">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="needsParking" 
                        value="no"
                        checked={!needsParking}
                        onChange={() => setNeedsParking(false)}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-blue-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Parking Type Selection - Only show if user needs parking */}
                {needsParking && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">Parking Type</label>
                      <div className="space-y-2">
                        <label className="flex items-center justify-between p-3 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-50">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name="parkingType" 
                              value="uncovered"
                              checked={parkingType === 'uncovered'}
                              onChange={(e) => setParkingType(e.target.value)}
                              className="text-blue-600"
                            />
                            <span className="text-sm text-blue-700">Uncovered Parking</span>
                          </div>
                          <span className="text-sm font-medium text-blue-800">$250/month</span>
                        </label>
                        <label className="flex items-center justify-between p-3 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-50">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name="parkingType" 
                              value="covered"
                              checked={parkingType === 'covered'}
                              onChange={(e) => setParkingType(e.target.value)}
                              className="text-blue-600"
                            />
                            <span className="text-sm text-blue-700">Covered Parking</span>
                          </div>
                          <span className="text-sm font-medium text-blue-800">$300/month</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Storage Selection */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Storage</h4>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-sm font-medium text-gray-700">Do you need storage?</span>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="needsStorage" 
                        value="yes"
                        checked={needsStorage}
                        onChange={() => setNeedsStorage(true)}
                        className="text-gray-600"
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="needsStorage" 
                        value="no"
                        checked={!needsStorage}
                        onChange={() => setNeedsStorage(false)}
                        className="text-gray-600"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Storage Information - Only show if user needs storage */}
                {needsStorage && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white">
                      <span className="text-sm text-gray-700">Storage Unit</span>
                      <span className="text-sm font-medium text-gray-800">$50/month</span>
                    </div>
                  </div>
                )}
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

      case 'move-in':
        return {
          icon: <Home className="text-emerald-600" size={48} />,
          title: 'Move In',
          content: (
            <div className="space-y-4">
              {readyForInspection === null && (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Are you ready to perform your move-in inspection?
                  </p>
                  <p className="text-sm text-gray-500">
                    The inspection involves recording a video walkthrough of your apartment to document its condition.
                  </p>
                  <div className="flex flex-col space-y-3">
                    <Button
                      onClick={() => setReadyForInspection(true)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Yes, I'm ready
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setReadyForInspection(false)}
                    >
                      Perform later
                    </Button>
                  </div>
                </div>
              )}

              {readyForInspection === false && (
                <div className="text-center space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Inspection Scheduled for Later</h4>
                    <p className="text-sm text-yellow-700">
                      You can complete your move-in inspection from the resident portal after you've settled in.
                    </p>
                  </div>
                  <Button
                    onClick={onComplete}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Continue to Resident Portal
                  </Button>
                </div>
              )}
            </div>
          ),
          actionText: readyForInspection === true ? 'Start Inspection' : 'Complete Move-In',
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
    if (stepId === 'move-in' && readyForInspection === true) {
      setShowCamera(true);
      return;
    }

    setIsCompleting(true);
    // Simulate API call or processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    onComplete();
    setIsCompleting(false);
  };

  const handleInspectionComplete = () => {
    setShowCamera(false);
    onComplete();
  };

  const handleOfferClick = (offer: any) => {
    console.log('Offer clicked:', offer);
  };

  // Show camera if inspection is ready
  if (showCamera) {
    return (
      <InspectionCamera
        onComplete={handleInspectionComplete}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] w-full mx-4 overflow-hidden">
        <div className="flex flex-col h-full max-h-[85vh] overflow-hidden">
          <DialogHeader className="flex-shrink-0 pb-4">
            <div className="flex items-center space-x-3">
              {stepContent.icon}
              <DialogTitle className="text-xl break-words">{stepContent.title}</DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2">
            <div className="space-y-6 min-w-0">
              <div className="overflow-x-hidden">
                {stepContent.content}
              </div>

              {/* Point of Sale Integration - only show for non-move-in steps */}
              {stepId !== 'move-in' && (
                <div className="overflow-x-hidden">
                  <PointOfSale 
                    context={stepContent.context}
                    onOfferClick={handleOfferClick}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Only show action buttons for move-in step when user made a choice */}
          {(stepId !== 'move-in' || readyForInspection !== null) && (
            <div className="flex-shrink-0 pt-4 border-t">
              <div className="flex space-x-3">
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoveInStepModal;
