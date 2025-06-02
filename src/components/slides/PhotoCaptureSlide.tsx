
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
  const canProceed = allowMultiple ? capturedPhotos.length > 0 : capturedPhoto !== '';

  const handleCapture = () => {
    console.log('Capture button clicked - starting animation'); // Debug log
    setIsCapturing(true);
    
    // Simulate photo capture with animation
    setTimeout(() => {
      console.log('Animation finished - setting photo captured'); // Debug log
      setIsCapturing(false);
      if (allowMultiple && setCapturedPhotos) {
        const newPhotos = [...capturedPhotos, 'captured'];
        console.log('Setting multiple photos:', newPhotos); // Debug log
        setCapturedPhotos(newPhotos);
      } else {
        console.log('Setting single photo: captured'); // Debug log
        setCapturedPhoto('captured');
      }
    }, 2000);
  };

  const handleRetake = (index?: number) => {
    console.log('Retake button clicked', { index }); // Debug log
    if (allowMultiple && setCapturedPhotos && index !== undefined) {
      const newPhotos = capturedPhotos.filter((_, i) => i !== index);
      console.log('Removing photo at index:', index, 'New photos:', newPhotos); // Debug log
      setCapturedPhotos(newPhotos);
    } else {
      console.log('Clearing single photo'); // Debug log
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
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-[300px] flex flex-col justify-center">
        {isCapturing ? (
          <div className="space-y-4">
            <div className="w-full h-40 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden mx-auto max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
              
              {/* Camera viewfinder corners */}
              <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-white"></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-white"></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-white"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-white"></div>
              
              {/* Phone/device being captured */}
              <div className="relative z-10">
                <div className="w-20 h-24 bg-amber-100 rounded-lg border-2 border-amber-200 flex flex-col items-center justify-center shadow-lg">
                  {/* Screen */}
                  <div className="w-16 h-16 bg-amber-200 rounded border border-amber-300 flex items-center justify-center mb-1">
                    <div className="flex flex-col space-y-1">
                      {/* Two dots for eyes */}
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                      </div>
                      {/* Smile line */}
                      <div className="w-4 h-0.5 bg-gray-800 rounded"></div>
                    </div>
                  </div>
                  {/* Home button */}
                  <div className="w-16 h-6 bg-amber-200 rounded border border-amber-300"></div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-base font-medium animate-pulse">📸 Capturing photo...</p>
          </div>
        ) : canProceed ? (
          <div className="space-y-3">
            {allowMultiple ? (
              <>
                {capturedPhotos.map((_, index) => (
                  <div key={index} className="w-full h-24 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-green-600 text-sm">📸 Photo {index + 1} Captured</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button onClick={handleCapture} className="flex-1 text-sm py-2">
                    Add Another Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRetake(capturedPhotos.length - 1)}
                    className="text-sm py-2"
                  >
                    Remove Last
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="w-full h-24 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600 text-sm">📸 Photo Captured</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRetake()}
                  className="text-sm"
                >
                  Retake Photo
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Camera className="w-12 h-12 text-gray-400 mx-auto" />
            <Button onClick={handleCapture} className="w-full text-base py-3">
              {allowMultiple ? 'Capture Photos' : 'Capture Photo'}
            </Button>
          </div>
        )}
      </div>
    </FormSlide>
  );
};

export default PhotoCaptureSlide;
