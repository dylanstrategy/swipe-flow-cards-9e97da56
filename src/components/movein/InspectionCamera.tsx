
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, RotateCcw, Check } from 'lucide-react';

interface InspectionCameraProps {
  onComplete: () => void;
  onCancel: () => void;
}

const InspectionCamera = ({ onComplete, onCancel }: InspectionCameraProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = () => {
    setIsRecording(true);
    // In a real app, you would start the actual video recording here
    console.log('Starting video recording...');
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
    // In a real app, you would stop the video recording here
    console.log('Stopping video recording...');
  };

  const retakeVideo = () => {
    setIsRecording(false);
    setHasRecorded(false);
    // In a real app, you would clear the recorded video here
    console.log('Retaking video...');
  };

  const completeInspection = () => {
    // In a real app, you would upload the video here
    console.log('Completing inspection...');
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Move-In Inspection</h2>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 bg-gray-900 relative flex items-center justify-center">
        <div className="w-full max-w-md aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <Video size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm opacity-75">Camera view placeholder</p>
            <p className="text-xs opacity-50 mt-1">Record a walkthrough of your apartment</p>
          </div>
        </div>

        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>Recording</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white p-6">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Record a video walkthrough of your apartment to document its condition
          </p>
          <p className="text-xs text-gray-500">
            Include all rooms, fixtures, and any existing damage
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          {!hasRecorded && (
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-8 py-3 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isRecording ? (
                <>
                  <VideoOff size={20} className="mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Video size={20} className="mr-2" />
                  Start Recording
                </>
              )}
            </Button>
          )}

          {hasRecorded && (
            <>
              <Button variant="outline" onClick={retakeVideo} className="px-6 py-3">
                <RotateCcw size={20} className="mr-2" />
                Retake
              </Button>
              <Button onClick={completeInspection} className="px-8 py-3 bg-green-600 hover:bg-green-700">
                <Check size={20} className="mr-2" />
                Complete Inspection
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionCamera;
