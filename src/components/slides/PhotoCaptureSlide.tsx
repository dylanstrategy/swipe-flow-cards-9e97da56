
import React from 'react';
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
  const canProceed = allowMultiple ? capturedPhotos.length > 0 : capturedPhoto !== '';

  const handleCapture = () => {
    console.log('Capture button clicked'); // Debug log
    if (allowMultiple && setCapturedPhotos) {
      const newPhotos = [...capturedPhotos, 'captured'];
      console.log('Setting multiple photos:', newPhotos); // Debug log
      setCapturedPhotos(newPhotos);
    } else {
      console.log('Setting single photo: captured'); // Debug log
      setCapturedPhoto('captured');
    }
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
        {canProceed ? (
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
