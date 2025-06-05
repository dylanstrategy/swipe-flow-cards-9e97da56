
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Check, AlertTriangle, TruckIcon } from 'lucide-react';
import PointOfSale from '@/components/PointOfSale';
import MoveInStepModal from '@/components/movein/MoveInStepModal';
import MoveOutStepModal from '@/components/movein/MoveOutStepModal';
import { useResident } from '@/contexts/ResidentContext';
import { useToast } from '@/hooks/use-toast';

interface MoveInStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
}

interface MoveOutStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

const MoveIn = () => {
  const { homeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const home = location.state?.home;
  const { toast } = useToast();
  const { canMoveIn, canMoveOut, markAsMoved, profile } = useResident();

  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'moveIn' | 'moveOut'>('moveIn');
  const [viewMode, setViewMode] = useState<'moveIn' | 'moveOut'>('moveIn');

  // Move-in steps (existing)
  const [steps, setSteps] = useState<MoveInStep[]>([
    {
      id: 'sign-lease',
      title: 'Sign Lease',
      description: 'Review and sign your lease agreement',
      completed: false,
      locked: false
    },
    {
      id: 'payment',
      title: 'Make Payment',
      description: 'Complete your initial payment and security deposit',
      completed: false,
      locked: true
    },
    {
      id: 'renters-insurance',
      title: "Renter's Insurance",
      description: 'Upload proof of renter\'s insurance coverage',
      completed: false,
      locked: true
    },
    {
      id: 'book-movers',
      title: 'Book Movers',
      description: 'Schedule professional moving services',
      completed: false,
      locked: true
    },
    {
      id: 'utilities',
      title: 'Set Up Utilities',
      description: 'Arrange electricity, water, gas, and internet',
      completed: false,
      locked: true
    },
    {
      id: 'inspection',
      title: 'Schedule Inspection',
      description: 'Book your move-in inspection appointment',
      completed: false,
      locked: true
    },
    {
      id: 'community-guidelines',
      title: 'Review Community Guidelines',
      description: 'Read and acknowledge community rules',
      completed: false,
      locked: true
    },
    {
      id: 'move-in',
      title: 'Move In',
      description: 'Complete your move-in inspection and start your residency',
      completed: false,
      locked: true
    }
  ]);

  // Move-out steps
  const [moveOutSteps, setMoveOutSteps] = useState<MoveOutStep[]>([
    {
      id: 'notice-to-vacate',
      title: 'Signed Notice to Vacate',
      description: 'Upload your signed Notice to Vacate form',
      completed: profile.status === 'notice',
      required: true
    },
    {
      id: 'forwarding-address',
      title: 'Forwarding Address',
      description: 'Provide your new address for deposit return',
      completed: !!profile.forwardingAddress,
      required: true
    },
    {
      id: 'final-inspection',
      title: 'Final Inspection',
      description: 'Complete move-out inspection with staff or video upload',
      completed: false,
      required: true
    },
    {
      id: 'exit-survey',
      title: 'Exit Survey',
      description: 'Share your feedback about your residency',
      completed: false,
      required: true
    },
    {
      id: 'key-return',
      title: 'Key Return Confirmation',
      description: 'Confirm return of all keys and access cards',
      completed: false,
      required: true
    },
    {
      id: 'final-balance',
      title: 'Final Balance Payment',
      description: 'Pay any remaining balance on your account',
      completed: false,
      required: true
    },
    {
      id: 'deposit-release',
      title: 'Deposit Release Confirmation',
      description: 'Confirm deposit release details',
      completed: false,
      required: true
    },
    {
      id: 'move-out-confirmation',
      title: 'Final Move-Out Confirmation',
      description: 'Complete your move-out process',
      completed: false,
      required: true
    }
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  const completedMoveOutSteps = moveOutSteps.filter(step => step.completed).length;
  const progressPercentage = viewMode === 'moveIn' 
    ? (completedSteps / steps.length) * 100
    : (completedMoveOutSteps / moveOutSteps.length) * 100;

  const handleStepComplete = (stepId: string) => {
    if (modalType === 'moveIn') {
      setSteps(prevSteps => {
        const newSteps = prevSteps.map(step => {
          if (step.id === stepId) {
            return { ...step, completed: true };
          }
          return step;
        });

        // Unlock the next step
        const currentIndex = newSteps.findIndex(step => step.id === stepId);
        if (currentIndex < newSteps.length - 1) {
          newSteps[currentIndex + 1].locked = false;
        }

        return newSteps;
      });

      // If move-in step is completed, check if resident can be marked as moved in
      if (stepId === 'move-in') {
        const moveInCheck = canMoveIn(profile.id);
        if (moveInCheck.canMove) {
          const result = markAsMoved(profile.id, 'in');
          if (result.success) {
            navigate('/');
          }
        } else {
          toast({
            title: "Cannot Complete Move-In",
            description: "Move-in cannot be completed until all required steps are fulfilled and the lease has begun.",
            variant: "destructive"
          });
        }
      }
    } else {
      setMoveOutSteps(prevSteps => 
        prevSteps.map(step => 
          step.id === stepId ? { ...step, completed: true } : step
        )
      );

      // If final move-out confirmation, check if resident can be marked as moved out
      if (stepId === 'move-out-confirmation') {
        const moveOutCheck = canMoveOut(profile.id);
        if (moveOutCheck.canMove) {
          const result = markAsMoved(profile.id, 'out');
          if (result.success) {
            navigate('/');
          }
        } else {
          toast({
            title: "Cannot Complete Move-Out",
            description: "Move-out cannot be completed until all required steps are fulfilled.",
            variant: "destructive"
          });
        }
      }
    }
    
    setCurrentModal(null);
  };

  const handleOfferClick = (offer: any) => {
    console.log('Offer clicked:', offer);
  };

  const handleMarkAsMoved = (type: 'in' | 'out') => {
    const check = type === 'in' ? canMoveIn(profile.id) : canMoveOut(profile.id);
    
    if (!check.canMove) {
      toast({
        title: `Cannot Mark as Moved ${type === 'in' ? 'In' : 'Out'}`,
        description: check.blockers.join(', '),
        variant: "destructive"
      });
      return;
    }

    const result = markAsMoved(profile.id, type);
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });

    if (result.success) {
      navigate('/');
    }
  };

  const isAllCompleted = viewMode === 'moveIn' 
    ? steps.every(step => step.completed)
    : moveOutSteps.every(step => step.completed);

  if (!home && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Home not found</h2>
          <Button onClick={() => navigate('/matches')}>
            Back to Matches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/matches')}
            className="p-2"
          >
            <ChevronLeft size={20} />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">
              {viewMode === 'moveIn' 
                ? (isAllCompleted ? 'Welcome to Applaud Living!' : 'Move-In Checklist')
                : 'Move-Out Checklist'
              }
            </h1>
            <p className="text-sm text-gray-600">
              {viewMode === 'moveIn'
                ? (isAllCompleted 
                    ? 'Your lease has been signed. Next steps to make moving in a breeze:'
                    : 'Complete the following items before your move-in date.'
                  )
                : 'Complete these steps for a smooth move-out process.'
              }
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-2 mb-4">
          <Button
            variant={viewMode === 'moveIn' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('moveIn')}
          >
            Move-In
          </Button>
          <Button
            variant={viewMode === 'moveOut' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('moveOut')}
          >
            Move-Out
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              viewMode === 'moveIn' ? 'bg-green-500' : 'bg-orange-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {viewMode === 'moveIn' 
            ? `${completedSteps} of ${steps.length} steps completed`
            : `${completedMoveOutSteps} of ${moveOutSteps.length} steps completed`
          }
        </p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Home Info Card */}
        {home && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-lg">{home.title}</h3>
            <p className="text-gray-600 text-sm">{home.address}</p>
            <p className="text-gray-900 font-medium">{home.price}</p>
          </div>
        )}

        {/* Steps List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {(viewMode === 'moveIn' ? steps : moveOutSteps).map((step, index) => (
            <div key={step.id} className="border-b border-gray-100 last:border-b-0">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                    ${step.completed 
                      ? `${viewMode === 'moveIn' ? 'bg-green-500' : 'bg-orange-500'} text-white` 
                      : (viewMode === 'moveIn' && 'locked' in step && step.locked)
                        ? 'bg-gray-200 text-gray-400'
                        : `${viewMode === 'moveIn' ? 'bg-blue-500' : 'bg-orange-600'} text-white`
                    }
                  `}>
                    {step.completed ? <Check size={16} /> : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-medium ${
                        (viewMode === 'moveIn' && 'locked' in step && step.locked) 
                          ? 'text-gray-400' 
                          : 'text-gray-900'
                      }`}>
                        {step.title}
                      </h4>
                      {'required' in step && step.required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <p className={`text-sm ${
                      (viewMode === 'moveIn' && 'locked' in step && step.locked) 
                        ? 'text-gray-300' 
                        : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={
                    step.completed || 
                    (viewMode === 'moveIn' && 'locked' in step && step.locked)
                  }
                  onClick={() => {
                    setCurrentModal(step.id);
                    setModalType(viewMode);
                  }}
                  className={step.completed ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  {step.completed 
                    ? 'Completed' 
                    : (viewMode === 'moveIn' && 'locked' in step && step.locked) 
                      ? 'Locked' 
                      : 'Start'
                  }
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Move-In/Move-Out Action Button */}
        {isAllCompleted && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              {viewMode === 'moveIn' ? (
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">🏠</span>
                </div>
              ) : (
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TruckIcon className="w-6 h-6 text-orange-600" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">
                  {viewMode === 'moveIn' ? 'Ready to Move In!' : 'Ready to Move Out!'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {viewMode === 'moveIn' 
                    ? 'All steps completed - you can now be marked as moved in'
                    : 'All steps completed - you can now finalize your move-out'
                  }
                </p>
              </div>
            </div>
            <Button 
              onClick={() => handleMarkAsMoved(viewMode === 'moveIn' ? 'in' : 'out')}
              className="w-full"
              size="lg"
            >
              {viewMode === 'moveIn' ? 'Mark as Moved In' : 'Complete Move-Out'}
            </Button>
          </div>
        )}

        {/* Point of Sale Integration */}
        <PointOfSale 
          context="service" 
          onOfferClick={handleOfferClick}
        />

        {/* Completion Actions */}
        {isAllCompleted && viewMode === 'moveIn' && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-lg mb-2">Resident Marketplace</h3>
            <p className="text-gray-600 text-sm mb-4">Explore services to help you get settled:</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-orange-600 text-xl">📦</span>
                </div>
                <p className="text-sm font-medium">Moving Company</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 text-xl">🛋️</span>
                </div>
                <p className="text-sm font-medium">Furniture</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 text-xl">🧽</span>
                </div>
                <p className="text-sm font-medium">Cleaning</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step Modal */}
      {currentModal && modalType === 'moveIn' && (
        <MoveInStepModal
          stepId={currentModal}
          onComplete={() => handleStepComplete(currentModal)}
          onClose={() => setCurrentModal(null)}
        />
      )}
      
      {currentModal && modalType === 'moveOut' && (
        <MoveOutStepModal
          stepId={currentModal}
          onComplete={() => handleStepComplete(currentModal)}
          onClose={() => setCurrentModal(null)}
        />
      )}
    </div>
  );
};

export default MoveIn;
