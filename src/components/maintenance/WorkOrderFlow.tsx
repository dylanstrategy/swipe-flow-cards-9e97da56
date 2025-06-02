
import React, { useState, useRef } from 'react';
import SwipeableScreen from '@/components/schedule/SwipeableScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Camera } from 'lucide-react';

interface WorkOrderFlowProps {
  workOrder: any;
  onClose: () => void;
}

const WorkOrderFlow = ({ workOrder, onClose }: WorkOrderFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [completionPhoto, setCompletionPhoto] = useState<string>('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [vendorCost, setVendorCost] = useState('');
  const [resolutionType, setResolutionType] = useState<'complete' | 'vendor' | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAction, setShowAction] = useState<'up' | 'left' | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startTime = useRef(0);

  const vendors = [
    'ABC Plumbing Services',
    'Reliable Electric Co',
    'Modern Appliance Repair',
    'Premier HVAC Solutions',
    'Express Locksmith'
  ];

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return true;
      case 2: return diagnosisNotes.trim() !== '';
      case 3: return resolutionType === 'complete' ? completionPhoto !== '' : 
                     (selectedVendor !== '' && vendorCost !== '');
      default: return false;
    }
  };

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      if (currentStep < 3) {
        console.log(`Moving from step ${currentStep} to step ${currentStep + 1}`);
        setCurrentStep(currentStep + 1);
      } else {
        console.log('Work order completed');
        onClose();
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    // Much more sensitive detection - any movement triggers evaluation
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      // Simple damping for visual feedback
      const dampedX = deltaX * 0.8;
      const dampedY = deltaY * 0.8;
      
      setDragOffset({ x: dampedX, y: dampedY });
      
      // Show action based on primary direction with very low thresholds
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // Vertical movement - check for swipe up
        if (deltaY < -15 && canProceedToNextStep()) {
          setShowAction('up');
        } else {
          setShowAction(null);
        }
      } else {
        // Horizontal movement - check for swipe left (made easier)
        if (deltaX < -20 && currentStep > 1) { // Reduced from -30 to -20
          setShowAction('left');
        } else {
          setShowAction(null);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    const deltaX = dragOffset.x;
    const deltaY = dragOffset.y;
    const deltaTime = Date.now() - startTime.current;
    
    // Calculate velocity for quick swipes
    const velocityY = Math.abs(deltaY) / Math.max(deltaTime, 1);
    const velocityX = Math.abs(deltaX) / Math.max(deltaTime, 1);
    
    // Lower thresholds for easier swiping
    const upThreshold = 20;
    const leftThreshold = 30; // Reduced from 40 to 30
    const velocityThreshold = 0.1;
    
    const shouldCompleteUp = (Math.abs(deltaY) > upThreshold || velocityY > velocityThreshold) && 
                            deltaY < -10 && canProceedToNextStep();
    const shouldCompleteLeft = (Math.abs(deltaX) > leftThreshold || velocityX > velocityThreshold) && 
                              deltaX < -leftThreshold && currentStep > 1;
    
    if (shouldCompleteUp) {
      console.log('Swipe up detected - going to next step');
      handleNextStep();
    } else if (shouldCompleteLeft) {
      console.log('Swipe left detected - going to previous step');
      handlePrevStep();
    } else {
      console.log('No valid swipe detected', { deltaX, deltaY, velocityX, velocityY });
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const distance = showAction === 'up' ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
    const progress = Math.min(distance / 25, 1); // Reduced for faster opacity response
    return Math.max(0.5, progress * 0.9);
  };

  const getRotation = () => {
    if (!isDragging) return 0;
    return (dragOffset.x * 0.01);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4 pb-6">
                {/* Original Issue Photo */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Issue Reported</h3>
                  <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-3">
                    <img 
                      src={workOrder.photo} 
                      alt="Reported issue"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{workOrder.description}</p>
                </div>

                {/* Work Order Details */}
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Unit:</span>
                        <span className="font-medium ml-2">{workOrder.unit}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Resident:</span>
                        <span className="font-medium ml-2">{workOrder.resident}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium ml-2">{workOrder.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Priority:</span>
                        <Badge className={`ml-2 ${getPriorityColor(workOrder.priority)}`}>
                          {workOrder.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-4">Diagnosis & Tech Notes</h3>
              <Textarea
                placeholder="Enter your diagnosis and technical notes..."
                value={diagnosisNotes}
                onChange={(e) => setDiagnosisNotes(e.target.value)}
                className="min-h-40 resize-none"
                style={{ fontSize: '16px' }}
                autoFocus
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 pb-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Resolution</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Button
                      variant={resolutionType === 'complete' ? 'default' : 'outline'}
                      onClick={() => setResolutionType('complete')}
                      className="h-20 flex flex-col"
                    >
                      <span className="text-2xl mb-1">✅</span>
                      <span>Complete</span>
                    </Button>
                    <Button
                      variant={resolutionType === 'vendor' ? 'default' : 'outline'}
                      onClick={() => setResolutionType('vendor')}
                      className="h-20 flex flex-col"
                    >
                      <span className="text-2xl mb-1">🏢</span>
                      <span>Additional Support</span>
                    </Button>
                  </div>

                  {resolutionType === 'complete' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Take Completion Photo/Video
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          {completionPhoto ? (
                            <div className="space-y-2">
                              <div className="w-full h-24 bg-green-100 rounded flex items-center justify-center">
                                <span className="text-green-600">📸 Photo Captured</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCompletionPhoto('captured')}
                              >
                                Retake Photo
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Camera className="w-10 h-10 text-gray-400 mx-auto" />
                              <Button
                                onClick={() => setCompletionPhoto('captured')}
                                className="w-full"
                              >
                                Capture Photo
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {resolutionType === 'vendor' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Vendor
                        </label>
                        <select
                          value={selectedVendor}
                          onChange={(e) => setSelectedVendor(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          style={{ fontSize: '16px' }}
                        >
                          <option value="">Choose a vendor...</option>
                          {vendors.map((vendor) => (
                            <option key={vendor} value={vendor}>{vendor}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cost to Resident
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="cost"
                              value="no-cost"
                              checked={vendorCost === 'no-cost'}
                              onChange={(e) => setVendorCost(e.target.value)}
                              className="mr-2"
                            />
                            No additional cost
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="cost"
                              value="with-cost"
                              checked={vendorCost === 'with-cost'}
                              onChange={(e) => setVendorCost(e.target.value)}
                              className="mr-2"
                            />
                            Resident responsible for cost
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Work Order Details';
      case 2: return 'Diagnosis & Tech Notes';
      case 3: return 'Resolution';
      default: return 'Work Order';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${getRotation()}deg)`,
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)',
        transformOrigin: 'center center',
        touchAction: 'pan-x pan-y'
      }}
    >
      {/* Swipe Action Overlays */}
      {showAction === 'up' && canProceedToNextStep() && (
        <div 
          className="absolute inset-0 flex items-start justify-center pt-16 transition-all duration-200 pointer-events-none z-50"
          style={{ 
            backgroundColor: '#22C55E',
            opacity: getActionOpacity()
          }}
        >
          <div className="text-white font-bold text-2xl flex flex-col items-center gap-3">
            <div className="text-3xl">↑</div>
            <span>Continue</span>
          </div>
        </div>
      )}

      {showAction === 'left' && currentStep > 1 && (
        <div 
          className="absolute inset-0 flex items-center justify-start pl-12 transition-all duration-200 pointer-events-none z-50"
          style={{ 
            backgroundColor: '#EF4444',
            opacity: getActionOpacity()
          }}
        >
          <div className="text-white font-bold text-2xl flex items-center gap-4">
            <span className="text-3xl">←</span>
            <span>Back</span>
          </div>
        </div>
      )}

      <SwipeableScreen
        title={`${getStepTitle()} - WO #${workOrder.id}`}
        currentStep={currentStep}
        totalSteps={3}
        onClose={onClose}
        onSwipeUp={canProceedToNextStep() ? handleNextStep : undefined}
        onSwipeLeft={currentStep > 1 ? handlePrevStep : undefined}
        canSwipeUp={canProceedToNextStep()}
        hideSwipeHandling={true}
      >
        {renderStepContent()}
      </SwipeableScreen>
    </div>
  );
};

export default WorkOrderFlow;
