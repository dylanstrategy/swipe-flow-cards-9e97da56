
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
    if (allowMultiple && setCapturedPhotos) {
      setCapturedPhotos([...capturedPhotos, 'captured']);
    } else {
      setCapturedPhoto('captured');
    }
  };

  const handleRetake = (index?: number) => {
    if (allowMultiple && setCapturedPhotos && index !== undefined) {
      const newPhotos = capturedPhotos.filter((_, i) => i !== index);
      setCapturedPhotos(newPhotos);
    } else {
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
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {canProceed ? (
          <div className="space-y-4">
            {allowMultiple ? (
              <>
                {capturedPhotos.map((_, index) => (
                  <div key={index} className="w-full h-32 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-green-600">📸 Photo {index + 1} Captured</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button onClick={handleCapture} className="flex-1">
                    Add Another Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRetake(capturedPhotos.length - 1)}
                  >
                    Remove Last
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="w-full h-32 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600">📸 Photo Captured</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRetake()}
                >
                  Retake Photo
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Camera className="w-12 h-12 text-gray-400 mx-auto" />
            <Button onClick={handleCapture} className="w-full">
              {allowMultiple ? 'Capture Photos' : 'Capture Photo'}
            </Button>
          </div>
        )}
      </div>
    </FormSlide>
  );
};

export default PhotoCaptureSlide;
