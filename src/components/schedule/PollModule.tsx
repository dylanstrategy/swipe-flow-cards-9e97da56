import React, { useState } from 'react';
import { Plus, X, BarChart3, Users, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import SwipeableScreen from './SwipeableScreen';
import SwipeCard from '../SwipeCard';
import SwipeUpPrompt from '@/components/ui/swipe-up-prompt';

interface PollModuleProps {
  onClose: () => void;
}

interface PollOption {
  id: string;
  text: string;
}

const PollModule = ({ onClose }: PollModuleProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [showPrompt, setShowPrompt] = useState(false);
  const [pollData, setPollData] = useState({
    title: '',
    description: '',
    type: '' as 'multiple-choice' | 'yes-no' | 'rating' | 'text' | '',
    options: [
      { id: '1', text: '' },
      { id: '2', text: '' }
    ] as PollOption[],
    duration: '7', // days
    targetAudience: 'all' as 'all' | 'building' | 'specific-units',
    building: '',
    units: '',
    anonymous: true,
    multipleAnswers: false
  });

  const pollTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice', description: 'Select from predefined options' },
    { value: 'yes-no', label: 'Yes/No', description: 'Simple yes or no question' },
    { value: 'rating', label: 'Rating Scale', description: '1-5 star rating' },
    { value: 'text', label: 'Text Response', description: 'Open-ended text answers' }
  ];

  const durationOptions = [
    { value: '1', label: '1 Day' },
    { value: '3', label: '3 Days' },
    { value: '7', label: '1 Week' },
    { value: '14', label: '2 Weeks' },
    { value: '30', label: '1 Month' }
  ];

  const targetOptions = [
    { value: 'all', label: 'All Residents' },
    { value: 'building', label: 'Specific Building' },
    { value: 'specific-units', label: 'Specific Units' }
  ];

  const addOption = () => {
    const newOption = {
      id: (pollData.options.length + 1).toString(),
      text: ''
    };
    setPollData({
      ...pollData,
      options: [...pollData.options, newOption]
    });
  };

  const removeOption = (optionId: string) => {
    if (pollData.options.length > 2) {
      setPollData({
        ...pollData,
        options: pollData.options.filter(option => option.id !== optionId)
      });
    }
  };

  const updateOption = (optionId: string, text: string) => {
    setPollData({
      ...pollData,
      options: pollData.options.map(option =>
        option.id === optionId ? { ...option, text } : option
      )
    });
  };

  const handleSubmit = () => {
    console.log('Submitting poll:', pollData);
    toast({
      title: "Poll Created Successfully",
      description: "Your poll has been scheduled and will appear on all resident calendars.",
    });
    onClose();
  };

  // Updated validation logic
  const canProceed = (): boolean => {
    if (step === 1) {
      return pollData.title.trim() !== '' && pollData.description.trim() !== '' && pollData.type !== '';
    }
    if (step === 2) {
      if (pollData.type === 'multiple-choice') {
        return pollData.options.every(option => option.text.trim() !== '');
      }
      return true;
    }
    if (step === 3) {
      // All fields required for final step
      const hasRequiredFields = pollData.title.trim() !== '' && pollData.description.trim() !== '' && pollData.duration !== '';
      const hasTargetAudience = pollData.targetAudience === 'all' || 
        (pollData.targetAudience === 'building' && pollData.building.trim() !== '') ||
        (pollData.targetAudience === 'specific-units' && pollData.units.trim() !== '');
      return hasRequiredFields && hasTargetAudience;
    }
    return true;
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      setShowPrompt(false);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setShowPrompt(false);
    }
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
    // Clear all data on current step when X is pressed
    if (step === 1) {
      setPollData({
        ...pollData,
        title: '',
        description: '',
        type: ''
      });
    } else if (step === 2) {
      if (pollData.type === 'multiple-choice') {
        setPollData({
          ...pollData,
          options: [
            { id: '1', text: '' },
            { id: '2', text: '' }
          ]
        });
      }
    } else if (step === 3) {
      setPollData({
        ...pollData,
        duration: '7',
        targetAudience: 'all',
        building: '',
        units: ''
      });
    }
  };

  // Auto-show prompt when content is ready and not already showing
  React.useEffect(() => {
    if (step < 3 && canProceed() && !showPrompt) {
      setShowPrompt(true);
    } else if (!canProceed() && showPrompt) {
      setShowPrompt(false);
    }
  }, [step, pollData, showPrompt]);

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto pb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="text-purple-600" size={20} />
                    Poll Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poll Title *
                    </label>
                    <Input
                      placeholder="What would you like to ask residents?"
                      value={pollData.title}
                      onChange={(e) => setPollData({ ...pollData, title: e.target.value })}
                      className="text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <Textarea
                      placeholder="Provide additional context or instructions for the poll..."
                      value={pollData.description}
                      onChange={(e) => setPollData({ ...pollData, description: e.target.value })}
                      rows={3}
                      className="text-base resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poll Type *
                    </label>
                    <Select value={pollData.type} onValueChange={(value: any) => setPollData({ ...pollData, type: value })}>
                      <SelectTrigger className="bg-white border border-gray-300">
                        <SelectValue placeholder="Select poll type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-[9999]">
                        {pollTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="cursor-pointer hover:bg-gray-50">
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto pb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Poll Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pollData.type === 'multiple-choice' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Answer Options
                      </label>
                      <div className="space-y-3">
                        {pollData.options.map((option, index) => (
                          <div key={option.id} className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                            <Input
                              placeholder={`Option ${index + 1}`}
                              value={option.text}
                              onChange={(e) => updateOption(option.id, e.target.value)}
                              className="flex-1 text-base"
                            />
                            {pollData.options.length > 2 && (
                              <button
                                onClick={() => removeOption(option.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        
                        {pollData.options.length < 6 && (
                          <button
                            onClick={addOption}
                            className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-colors"
                          >
                            <Plus size={16} />
                            <span className="text-sm">Add Option</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={pollData.multipleAnswers}
                            onChange={(e) => setPollData({ ...pollData, multipleAnswers: e.target.checked })}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">Allow multiple selections</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {pollData.type === 'yes-no' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Residents will be able to answer with "Yes" or "No" to your question.
                      </p>
                    </div>
                  )}

                  {pollData.type === 'rating' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Residents will rate using a 1-5 star scale.
                      </p>
                    </div>
                  )}

                  {pollData.type === 'text' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Residents can provide open-ended text responses.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 pb-24">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Poll Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poll Duration *
                    </label>
                    <Select value={pollData.duration} onValueChange={(value) => setPollData({ ...pollData, duration: value })}>
                      <SelectTrigger className="bg-white border border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-[9999]">
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience *
                    </label>
                    <Select value={pollData.targetAudience} onValueChange={(value: any) => setPollData({ ...pollData, targetAudience: value })}>
                      <SelectTrigger className="bg-white border border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-[9999]">
                        {targetOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {pollData.targetAudience === 'building' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Building *
                      </label>
                      <Select value={pollData.building} onValueChange={(value) => setPollData({ ...pollData, building: value })}>
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Select building" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-[9999]">
                          <SelectItem value="building-a">Building A</SelectItem>
                          <SelectItem value="building-b">Building B</SelectItem>
                          <SelectItem value="building-c">Building C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {pollData.targetAudience === 'specific-units' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Numbers *
                      </label>
                      <Input
                        placeholder="e.g., 101, 102, 205-210"
                        value={pollData.units}
                        onChange={(e) => setPollData({ ...pollData, units: e.target.value })}
                        className="text-base"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate multiple units with commas. Use hyphens for ranges.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={pollData.anonymous}
                        onChange={(e) => setPollData({ ...pollData, anonymous: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Anonymous responses</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="text-purple-600" size={16} />
                      <Badge variant="outline">Poll</Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{pollData.title || 'Poll Title'}</h3>
                    <p className="text-sm text-gray-600 mb-3">{pollData.description || 'Poll description'}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {durationOptions.find(d => d.value === pollData.duration)?.label}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {targetOptions.find(t => t.value === pollData.targetAudience)?.label}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fixed Submit Button - only on last step */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="w-full bg-purple-600 text-white py-3 text-base font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Poll
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SwipeableScreen
      title="Create Poll"
      currentStep={step}
      totalSteps={3}
      onClose={onClose}
      onSwipeUp={step < 3 && canProceed() ? nextStep : undefined}
      onSwipeLeft={step > 1 ? prevStep : undefined}
      canSwipeUp={step < 3 ? canProceed() : false}
      hideSwipeHandling={step === 3}
    >
      <div className="h-full overflow-hidden relative">
        {renderCurrentStep()}
        
        {/* Conditional SwipeUpPrompt - Only show on steps 1-2 when ready and prompt is shown */}
        {step < 3 && showPrompt && canProceed() && (
          <SwipeUpPrompt 
            onContinue={nextStep}
            onBack={step > 1 ? prevStep : undefined}
            onClose={handleClosePrompt}
            message="Ready to continue!"
            buttonText="Continue"
            showBack={step > 1}
          />
        )}
      </div>
    </SwipeableScreen>
  );
};

export default PollModule;
