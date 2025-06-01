
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Check } from 'lucide-react';
import PointOfSale from '@/components/PointOfSale';
import MoveInStepModal from '@/components/movein/MoveInStepModal';

interface MoveInStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
}

const MoveIn = () => {
  const { homeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const home = location.state?.home;

  const [currentModal, setCurrentModal] = useState<string | null>(null);
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
    }
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const handleStepComplete = (stepId: string) => {
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
    setCurrentModal(null);
  };

  const handleOfferClick = (offer: any) => {
    console.log('Offer clicked:', offer);
    // Handle offer integration
  };

  const isAllCompleted = steps.every(step => step.completed);

  if (!home) {
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
              {isAllCompleted ? 'Welcome to Applaud Living!' : 'Move-In Checklist'}
            </h1>
            <p className="text-sm text-gray-600">
              {isAllCompleted 
                ? 'Your lease has been signed. Next steps to make moving in a breeze:'
                : 'Complete the following items before your move-in date.'
              }
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {completedSteps} of {steps.length} steps completed
        </p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Home Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-lg">{home.title}</h3>
          <p className="text-gray-600 text-sm">{home.address}</p>
          <p className="text-gray-900 font-medium">{home.price}</p>
        </div>

        {/* Steps List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {steps.map((step, index) => (
            <div key={step.id} className="border-b border-gray-100 last:border-b-0">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                    ${step.completed 
                      ? 'bg-green-500 text-white' 
                      : step.locked 
                        ? 'bg-gray-200 text-gray-400'
                        : 'bg-blue-500 text-white'
                    }
                  `}>
                    {step.completed ? <Check size={16} /> : index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${step.locked ? 'text-gray-400' : 'text-gray-900'}`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm ${step.locked ? 'text-gray-300' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={step.locked || step.completed}
                  onClick={() => setCurrentModal(step.id)}
                  className={step.completed ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  {step.completed ? 'Completed' : step.locked ? 'Locked' : 'Start'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Point of Sale Integration */}
        <PointOfSale 
          context="service" 
          onOfferClick={handleOfferClick}
        />

        {/* Completion Actions */}
        {isAllCompleted && (
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
      {currentModal && (
        <MoveInStepModal
          stepId={currentModal}
          onComplete={() => handleStepComplete(currentModal)}
          onClose={() => setCurrentModal(null)}
        />
      )}
    </div>
  );
};

export default MoveIn;
