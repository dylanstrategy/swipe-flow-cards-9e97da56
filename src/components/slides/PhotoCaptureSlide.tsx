
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
    console.log('Capture button clicked'); // Debug log
    setIsCapturing(true);
    
    // Simulate photo capture with animation
    setTimeout(() => {
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
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {isCapturing ? (
          <div className="space-y-3">
            <div className="w-full h-32 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
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
            <p className="text-gray-600 text-sm font-medium">Capturing photo...</p>
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
          <div className="space-y-3">
            <Camera className="w-10 h-10 text-gray-400 mx-auto" />
            <Button onClick={handleCapture} className="w-full text-sm py-2">
              {allowMultiple ? 'Capture Photos' : 'Capture Photo'}
            </Button>
          </div>
        )}
      </div>
    </FormSlide>
  );
};

export default PhotoCaptureSlide;
