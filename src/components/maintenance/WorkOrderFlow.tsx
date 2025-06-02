
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, X, Camera } from 'lucide-react';

interface WorkOrderFlowProps {
  workOrder: any;
  onClose: () => void;
}

const WorkOrderFlow = ({ workOrder, onClose }: WorkOrderFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Details, 2: Diagnosis, 3: Resolution
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [completionPhoto, setCompletionPhoto] = useState<string>('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [vendorCost, setVendorCost] = useState('');
  const [resolutionType, setResolutionType] = useState<'complete' | 'vendor' | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAction, setShowAction] = useState<'up' | null>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const vendors = [
    'ABC Plumbing Services',
    'Reliable Electric Co',
    'Modern Appliance Repair',
    'Premier HVAC Solutions',
    'Express Locksmith'
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - startPos.current.y;
    
    if (Math.abs(deltaY) > 10) {
      const dampedY = deltaY * 0.3;
      setDragOffset({ x: 0, y: Math.max(-80, Math.min(20, dampedY)) });
      
      if (deltaY < -30 && canProceedToNextStep()) {
        setShowAction('up');
      } else {
        setShowAction(null);
      }
    }
  };

  const handleTouchEnd = () => {
    const threshold = 50;
    
    if (Math.abs(dragOffset.y) > threshold && dragOffset.y < -threshold && canProceedToNextStep()) {
      handleNextStep();
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return true; // Always can proceed from details
      case 2: return diagnosisNotes.trim() !== '';
      case 3: return resolutionType === 'complete' ? completionPhoto !== '' : 
                     (selectedVendor !== '' && vendorCost !== '');
      default: return false;
    }
  };

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // Submit work order
        console.log('Work order completed');
        onClose();
      }
    }
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const distance = Math.abs(dragOffset.y);
    const progress = Math.min(distance / 50, 1);
    return Math.max(0.5, progress * 0.9);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Original Issue Photo */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Issue Reported</h3>
              <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-3">
                <img 
                  src={workOrder.photo} 
                  alt="Reported issue"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-700">{workOrder.description}</p>
            </div>

            {/* Work Order Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
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
                  <Badge className={`ml-2 ${workOrder.priority === 'High' ? 'bg-red-100 text-red-800' : 
                    workOrder.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {workOrder.priority}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Swipe up to proceed to diagnosis</p>
              <ArrowUp className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Diagnosis & Tech Notes</h3>
              <Textarea
                placeholder="Enter your diagnosis and technical notes..."
                value={diagnosisNotes}
                onChange={(e) => setDiagnosisNotes(e.target.value)}
                className="min-h-32"
              />
            </div>

            {diagnosisNotes.trim() && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Swipe up to choose resolution</p>
                <ArrowUp className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
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
                  <span>Vendor Support</span>
                </Button>
              </div>

              {resolutionType === 'complete' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Take Completion Photo/Video
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      {completionPhoto ? (
                        <div className="space-y-2">
                          <div className="w-full h-32 bg-green-100 rounded flex items-center justify-center">
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
                          <Camera className="w-12 h-12 text-gray-400 mx-auto" />
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

                  {completionPhoto && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Swipe up to complete work order</p>
                      <ArrowUp className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
                    </div>
                  )}
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

                  {selectedVendor && vendorCost && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Swipe up to submit vendor order</p>
                      <ArrowUp className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
                    </div>
                  )}
                </div>
              )}
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
      case 2: return 'Diagnosis';
      case 3: return 'Resolution';
      default: return 'Work Order';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${dragOffset.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {/* Swipe Up Action Overlay */}
      {showAction === 'up' && canProceedToNextStep() && (
        <div 
          className="absolute inset-0 flex items-start justify-center pt-16 transition-all duration-200 pointer-events-none z-50"
          style={{ 
            backgroundColor: '#10B981',
            opacity: getActionOpacity()
          }}
        >
          <div className="text-white font-bold text-2xl flex flex-col items-center gap-3">
            <div className="text-3xl">↑</div>
            <span>{currentStep === 3 ? 'Submit' : 'Continue'}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-semibold">{getStepTitle()}</h1>
            <p className="text-sm text-gray-600">WO #{workOrder.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full ${
                step <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default WorkOrderFlow;
