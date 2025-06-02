
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import FormSlide from './FormSlide';

interface PhotoCaptureSlideProps {
  title: string;
  subtitle?: string;
  capturedPhoto: string;
  setCapturedPhoto: (photo: string) => void;
  allowMultiple?: boolean;
  capturedPhotos?: string[];
  setCapturedPhotos?: (photos: string[]) => void;
}

const PhotoCaptureSlide = ({ 
  title, 
  subtitle, 
  capturedPhoto, 
  setCapturedPhoto,
  allowMultiple = false,
  capturedPhotos = [],
  setCapturedPhotos
}: PhotoCaptureSlideProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Calculate if we can proceed - this is what enables swipe up
  const canProceed = allowMultiple ? capturedPhotos.length > 0 : capturedPhoto !== '';
  
  console.log('🔍 PhotoCaptureSlide state:', { 
    isCapturing, 
    capturedPhoto, 
    canProceed, 
    allowMultiple, 
    capturedPhotos 
  });

  const handleCapture = () => {
    console.log('📸 Capture button clicked - starting animation'); 
    setIsCapturing(true);
    
    // Simulate photo capture with animation
    setTimeout(() => {
      console.log('✅ Animation complete - setting photo captured'); 
      setIsCapturing(false);
      
      if (allowMultiple && setCapturedPhotos) {
        const newPhotos = [...capturedPhotos, 'captured'];
        console.log('📝 Setting multiple photos:', newPhotos); 
        setCapturedPhotos(newPhotos);
      } else {
        console.log('📝 Setting single photo: captured'); 
        setCapturedPhoto('captured');
      }
    }, 2500);
  };

  const handleRetake = (index?: number) => {
    console.log('🔄 Retake clicked', { index }); 
    if (allowMultiple && setCapturedPhotos && index !== undefined) {
      const newPhotos = capturedPhotos.filter((_, i) => i !== index);
      console.log('🗑️ Removing photo at index:', index, 'New photos:', newPhotos); 
      setCapturedPhotos(newPhotos);
    } else {
      console.log('🗑️ Clearing single photo'); 
      setCapturedPhoto('');
    }
  };

  return (
    <FormSlide 
      title={title} 
      subtitle={subtitle} 
      icon={<Camera className="text-blue-600" size={28} />}
      canProceed={canProceed}
    >
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center min-h-[320px] flex flex-col justify-center">
        {isCapturing ? (
          // ANIMATION STATE - This shows while capturing
          <div className="space-y-6">
            {/* Camera Viewfinder Animation */}
            <div className="w-full h-48 bg-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden mx-auto max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
              
              {/* Animated Viewfinder Corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-3 border-t-3 border-white animate-pulse"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-3 border-t-3 border-white animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-3 border-b-3 border-white animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-3 border-b-3 border-white animate-pulse"></div>
              
              {/* Device Being Captured - Enhanced Animation */}
              <div className="relative z-10 transform transition-all duration-1000 animate-pulse">
                <div className="w-24 h-32 bg-amber-100 rounded-xl border-3 border-amber-200 flex flex-col items-center justify-center shadow-2xl transform rotate-2">
                  {/* Screen with face */}
                  <div className="w-20 h-20 bg-amber-200 rounded-lg border-2 border-amber-300 flex items-center justify-center mb-2">
                    <div className="flex flex-col space-y-2">
                      {/* Animated eyes */}
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      </div>
                      {/* Animated smile */}
                      <div className="w-6 h-1 bg-gray-800 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  {/* Bottom section */}
                  <div className="w-20 h-8 bg-amber-200 rounded-lg border-2 border-amber-300"></div>
                </div>
              </div>

              {/* Flash Effect */}
              <div className="absolute inset-0 bg-white opacity-0 animate-ping"></div>
            </div>
            
            {/* Capturing Text with Animation */}
            <div className="space-y-2">
              <p className="text-blue-600 text-lg font-semibold animate-pulse">📸 Capturing Photo...</p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        ) : canProceed ? (
          // PHOTO CAPTURED STATE - This shows after photo is taken, enables swipe up
          <div className="space-y-4">
            {allowMultiple ? (
              <>
                {capturedPhotos.map((_, index) => (
                  <div key={index} className="w-full h-28 bg-green-100 rounded-lg flex items-center justify-center border-2 border-green-200">
                    <span className="text-green-700 text-base font-medium">📸 Photo {index + 1} Captured Successfully</span>
                  </div>
                ))}
                <div className="flex gap-3">
                  <Button onClick={handleCapture} className="flex-1 text-base py-3">
                    Add Another Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRetake(capturedPhotos.length - 1)}
                    className="text-base py-3"
                  >
                    Remove Last
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="w-full h-28 bg-green-100 rounded-lg flex items-center justify-center border-2 border-green-200">
                  <span className="text-green-700 text-base font-medium">📸 Photo Captured Successfully</span>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleRetake()}
                  className="text-base py-3"
                >
                  Retake Photo
                </Button>
              </>
            )}
          </div>
        ) : (
          // INITIAL STATE - This shows before any photo is taken
          <div className="space-y-6">
            <Camera className="w-16 h-16 text-gray-400 mx-auto" />
            <div className="space-y-3">
              <h4 className="text-lg font-medium text-gray-700">Ready to Capture</h4>
              <p className="text-sm text-gray-500">Take a photo of the maintenance issue</p>
            </div>
            <Button 
              onClick={handleCapture} 
              className="w-full text-lg py-4 bg-blue-600 hover:bg-blue-700"
              disabled={isCapturing}
            >
              {allowMultiple ? 'Capture Photos' : 'Capture Photo'}
            </Button>
          </div>
        )}
      </div>
    </FormSlide>
  );
};

export default PhotoCaptureSlide;
