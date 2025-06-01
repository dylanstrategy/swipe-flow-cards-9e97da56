
import React, { useState } from 'react';
import { Camera, CheckCircle, ArrowUp } from 'lucide-react';

interface PhotoCaptureStepProps {
  onNext: () => void;
}

const PhotoCaptureStep = ({ onNext }: PhotoCaptureStepProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setPhotoCaptured(true);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="mb-4 relative">
        {isCapturing ? (
          <div className="w-48 h-32 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
            <div className="relative z-10">
              <div className="w-16 h-20 bg-amber-100 rounded-lg border-2 border-amber-200 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-amber-200 rounded border border-amber-300 flex items-center justify-center mb-1">
                  <div className="flex flex-col space-y-1">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                    </div>
                    <div className="w-3 h-0.5 bg-gray-800 rounded"></div>
                  </div>
                </div>
                <div className="w-12 h-5 bg-amber-200 rounded border border-amber-300"></div>
              </div>
            </div>
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white"></div>
          </div>
        ) : photoCaptured ? (
          <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center relative">
            <div className="w-16 h-20 bg-amber-100 rounded-lg border-2 border-amber-200 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-amber-200 rounded border border-amber-300 flex items-center justify-center mb-1">
                <div className="flex flex-col space-y-1">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                  </div>
                  <div className="w-3 h-0.5 bg-gray-800 rounded"></div>
                </div>
              </div>
              <div className="w-12 h-5 bg-amber-200 rounded border border-amber-300"></div>
            </div>
            <div className="absolute -top-2 -right-2 bg-green-600 rounded-full p-1">
              <CheckCircle className="text-white" size={16} />
            </div>
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
            <Camera className="text-gray-400" size={32} />
          </div>
        )}
      </div>
      
      {!isCapturing && !photoCaptured && (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Take a Photo</h3>
          <p className="text-gray-600 mb-4 text-center text-sm">Capture the issue you'd like to report</p>
          <button 
            onClick={handleCapture}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Open Camera
          </button>
        </>
      )}
      {isCapturing && (
        <p className="text-gray-600 text-sm font-medium mt-4">Capturing photo...</p>
      )}
      {photoCaptured && (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Photo Captured!</h3>
          <p className="text-gray-600 mb-3 text-sm">Swipe up anywhere to continue</p>
          <ArrowUp className="text-green-600 animate-bounce mx-auto mb-3" size={24} />
          <button
            onClick={onNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoCaptureStep;
